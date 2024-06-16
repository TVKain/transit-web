from fastapi import APIRouter

from app.api.openstack_api import OpenStackAuth

router = APIRouter(prefix="/test", tags=["test"])


@router.get("/")
def test():
    connection = OpenStackAuth.get_connection(
        auth_url="http://controller-b:5000/v3", region_name="Ho-Chi-Minh"
    )

    return list(connection.network.networks())
