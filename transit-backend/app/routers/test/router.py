from fastapi import APIRouter

from app.api.openstack_api import OpenStackAuth

router = APIRouter(prefix="/test", tags=["test"])


@router.get("/")
def test():
    connection = OpenStackAuth.get_connection(
        auth_url="http://127.0.0.1:5000/v3", region_name="RegionTwo"
    )

    return list(connection.network.networks())
