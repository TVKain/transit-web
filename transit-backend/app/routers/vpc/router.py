from fastapi import APIRouter, HTTPException

from app.api.openstack_api import OpenStackAuth

from app.routers.vpc.models.request import CreateVPCRequest
from app.routers.vpc.models.response import CreateVPCResponse

from app.database.repositories.region.region import RegionRepository
from app.database.repositories.vpc.vpc import VPCRepository
from app.database.repositories.user.user import UserRepository

from app.routers.utils import utils

router = APIRouter(prefix="/vpcs", tags=["vpcs"])


@router.get("/{vpc_id}")
def get(vpc_id: str):
    vpc_repo = VPCRepository()

    try:
        vpc = vpc_repo.get(ident=vpc_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="VPC does not exist") from e

    return vpc

@router.post(
    "/", response_model=CreateVPCResponse, responses={400: {"detail": "VPC exists"}}
)
def create(request: CreateVPCRequest):
    region_repo = RegionRepository()
    vpc_repo = VPCRepository()
    user_repo = UserRepository()

    print(request)

    if not utils.is_valid_subnet(request.cidr):
        raise HTTPException(
            status_code=400, detail=f"CIDR {request.cidr} for VPC is not valid"
        )

    if not utils.is_private_subnet(request.cidr):
        raise HTTPException(
            status_code=400,
            detail=f"CIDR {request.cidr} is not in the private address space",
        )

    try:
        region = region_repo.get(ident=request.region_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Region does not exist") from e

    try:
        user_repo.get(ident=request.user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="User does not exist") from e

    connection = OpenStackAuth.get_connection(
        auth_url=region.auth_url, region_name=region.id
    )

    # Create project
    try:
        project = connection.identity.create_project(name=request.name)
    except Exception as e:
        raise HTTPException(status_code=400, detail="VPC exists") from e

    admin = connection.identity.find_user("admin")
    role = connection.identity.find_role("admin")

    connection.identity.assign_project_role_to_user(project, admin, role)

    # Create virtual neutron router
    provider_net = connection.network.get_network(region.provider_id)

    virtual_router = connection.network.create_router(
        project_id=project.id,
        external_gateway_info={"network_id": provider_net.id, "enable_snat": True},
        admin_state_up=True,
    )

    # Create virtual network
    network = connection.network.create_network(
        project_id=project.id, admin_state_up=True
    )

    # Persist in database

    vpc_repo.create(
        ident=project.id,
        region_id=request.region_id,
        router_id=virtual_router.id,
        network_id=network.id,
        name=request.name,
        cidr=request.cidr,
    )

    vpc_repo.add_user(vpc_id=project.id, user_id=request.user_id)

    return {
        "id": project.id,
        "user_id": request.user_id,
        "region_id": request.region_id,
        "name": request.name,
    }


@router.get("/")
def get_all(user_id: str, region_id):
    region_repo = RegionRepository()
    vpc_repo = VPCRepository()
    user_repo = UserRepository()

    try:
        region_repo.get(ident=region_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Region does not exist") from e

    try:
        user_repo.get(ident=user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="User does not exist") from e

    return vpc_repo.get_all_in_region_of_user(user_id=user_id, region_id=region_id)
