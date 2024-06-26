from fastapi import APIRouter

from app.routers.test.router import router as test_router
from app.routers.user.router import router as user_router
from app.routers.auth.router import router as auth_router
from app.routers.region.router import router as region_router
from app.routers.vpc.router import router as vpc_router
from app.routers.subnet.router import router as subnet_router
from app.routers.compute.router import router as compute_router

from app.routers.transit_gateway_peering_attachment.router import router as transit_gateway_peering_attachment_router


api_router = APIRouter()
api_router.include_router(test_router)
api_router.include_router(user_router)
api_router.include_router(auth_router)
api_router.include_router(region_router)
api_router.include_router(vpc_router)
api_router.include_router(subnet_router)
api_router.include_router(compute_router)
api_router.include_router(transit_gateway_peering_attachment_router)
