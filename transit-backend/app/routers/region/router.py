from fastapi import APIRouter

from app.database.repositories.vpc.vpc import VPCRepository
from app.routers.region.models.request import CreateRegionRequest
from app.routers.region.models.response import GetAllRegionResponse

from app.database.repositories.region.region import RegionRepository

router = APIRouter(prefix="/regions", tags=["regions"])


# TODO: Remove this route, only for testing purposes
@router.post("/", response_model=CreateRegionRequest)
def create(request: CreateRegionRequest):
    region_repo = RegionRepository()

    region = region_repo.create(id=request.id, auth_url=request.auth_url)

    return region


@router.get("/{user_id}", response_model=GetAllRegionResponse)
def get_all(user_id: str):
    region_repo = RegionRepository()

    vpc_repo = VPCRepository()

    regions = region_repo.get_all()

    regions_res = []

    for region in regions:
        vpcs = vpc_repo.get_all_in_region_of_user(user_id, region.id)

        regions_res.append(
            {
                "id": region.id,
                "auth_url": region.auth_url,
                "vpcs": [
                    {"id": vpc.id, "name": vpc.name, "cidr": vpc.cidr} for vpc in vpcs
                ],
            }
        )

    return {"regions": regions_res}
