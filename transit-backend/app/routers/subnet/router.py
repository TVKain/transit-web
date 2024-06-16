from fastapi import APIRouter, HTTPException

from openstack import exceptions as openstack_exceptions

from app.api.openstack_api import OpenStackAuth
from app.database.repositories.region.region import RegionRepository
from app.database.repositories.vpc.vpc import VPCRepository
from app.routers.subnet.models.request import CreateSubnetRequest
from app.routers.subnet.models.response import (
    CreateSubnetResponse,
    GetAllSubnetResponse,
)

from app.routers.utils import utils

router = APIRouter(prefix="/subnets", tags=["subnets"])


@router.get("/", response_model=GetAllSubnetResponse)
def get_all(vpc_id: str):
    try:
        vpc_repo = VPCRepository()

        region_repo = RegionRepository()

        vpc = vpc_repo.get(ident=vpc_id)

        region = region_repo.get(ident=vpc.region_id)

        connection = OpenStackAuth.get_connection(
            auth_url=region.auth_url, region_name=region.id
        )

        subnet_generator = connection.network.subnets(
            network_id=vpc.network_id, project_id=vpc.id
        )
    except Exception as e:
        raise HTTPException(400, detail=str(e)) from e

    return {
        "subnets": [
            {
                "id": subnet.id,
                "network_address": subnet.cidr,
                "gateway_ip": subnet.gateway_ip,
            }
            for subnet in subnet_generator
        ]
    }


@router.delete("/{ident}")
def delete(ident: str, vpc_id: str):
    try:
        vpc_repo = VPCRepository()

        region_repo = RegionRepository()

        vpc = vpc_repo.get(ident=vpc_id)

        region = region_repo.get(ident=vpc.region_id)

        connection = OpenStackAuth.get_connection(
            auth_url=region.auth_url, region_name=region.id
        )
        
        ports = connection.network.get_subnet_ports(ident)

        port_devices = [port.device_owner for port in ports]
        
        if 'compute:nova' in port_devices:
            raise Exception("There are still compute instances attached to the subnet")
        
        virtual_router = connection.network.get_router(vpc.router_id)

        connection.remove_router_interface(virtual_router, subnet_id=ident)

        ret = connection.delete_subnet(ident)

        if not ret:
            raise Exception("Delete subnet fail")
    except Exception as e:
        raise HTTPException(400, detail=str(e)) from e

    return {"status": "success"}


@router.post("/", response_model=CreateSubnetResponse)
def create(request: CreateSubnetRequest):
    if not utils.is_valid_subnet(request.network_address):
        raise HTTPException(
            status_code=400,
            detail=f"Input CIDR '{request.network_address}' is not valid",
        )

    vpc_repo = VPCRepository()
    region_repo = RegionRepository()

    vpc = vpc_repo.get(ident=request.vpc_id)

    if not utils.is_in_cidr(request.network_address, vpc.cidr):
        raise HTTPException(
            status_code=400,
            detail=f"Input CIDR '{request.network_address}' is not in VPC CIDR '{vpc.cidr}'",
        )

    region = region_repo.get(ident=vpc.region_id)

    connection = OpenStackAuth.get_connection(
        auth_url=region.auth_url, region_name=region.id
    )

    try:
        subnet = connection.create_subnet(
            tenant_id=vpc.id,
            network_name_or_id=vpc.network_id,
            cidr=request.network_address,
            ip_version="4",
            enable_dhcp=True,
        )
    except openstack_exceptions.HttpException as e:

        raise HTTPException(status_code=400, detail=str(e.details)) from e
    try:

        virtual_router = connection.network.get_router(vpc.router_id)

        connection.add_router_interface(virtual_router, subnet.id)
    except openstack_exceptions.ResourceNotFound as e:
        raise HTTPException(status_code=400, detail=str(e.details)) from e

    return CreateSubnetResponse(id=subnet.id)
