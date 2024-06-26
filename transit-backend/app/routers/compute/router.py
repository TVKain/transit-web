import logging
from fastapi import APIRouter, HTTPException

from app.api.openstack_api import OpenStackAuth
from app.database.repositories.region.region import RegionRepository
from app.database.repositories.vpc.vpc import VPCRepository
from app.routers.compute.models.response import (
    GetAllComputeResponse,
    GetComputeResponse,
    IPAddress,
)

from app.routers.compute.models.request import (
    CreateComputeRequest,
)


router = APIRouter(prefix="/computes", tags=["computes"])


@router.post("/")
def create(request: CreateComputeRequest):
    try:
        vpc_repo = VPCRepository()

        region_repo = RegionRepository()

        vpc = vpc_repo.get(ident=request.vpc_id)

        region = region_repo.get(ident=vpc.region_id)

        connection = OpenStackAuth.get_connection(
            auth_url=region.auth_url, region_name=region.id
        )

        current_project = connection.get_project(vpc.id)

        connection = connection.connect_as_project(current_project.name)

        port = connection.create_port(
            network_id=vpc.network_id, fixed_ips=[{"subnet_id": request.subnet_id}]
        )

        ip_address = port.fixed_ips[0]["ip_address"]

        connection.network.delete_port(port)
        image = connection.get_image("cirros")
        flavor = connection.get_flavor("m1.nano")

        server = connection.compute.create_server(
            name=request.name,
            image_id=image.id,
            flavor_id=flavor.id,
            networks=[{"uuid": vpc.network_id, "fixed_ip": ip_address}],
        )

        server = connection.compute.wait_for_server(server)
        
        try:
            compute_ports = connection.list_ports(
                filters={"device_id": server.id}
            )

            logging.info("Disabling port security for ports")

            for compute_port in compute_ports:
                connection.update_port(
                    name_or_id=compute_port.id, security_groups=[]
                )
                connection.update_port(
                    name_or_id=compute_port.id, port_security_enabled=False
                )

            logging.info("Disabling port security for ports done")
        except Exception as e:
            logging.info(f"Error disabling port security for ports {e}")
        
        
        
    except Exception as e:
        raise HTTPException(400, detail=str(e)) from e

    return {"status": "success"}


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
        ret = connection.delete_server(ident, wait=True)

        if not ret:
            raise Exception("Delete compute fail")
    except Exception as e:
        raise HTTPException(400, detail=str(e)) from e

    return {"status": "success"}


@router.get("/", response_model=GetAllComputeResponse)
def get_all(vpc_id: str):
    try:
        vpc_repo = VPCRepository()

        region_repo = RegionRepository()

        vpc = vpc_repo.get(ident=vpc_id)

        if vpc is None:
            raise Exception(f"VPC '{vpc_id}' does not exist")

        region = region_repo.get(ident=vpc.region_id)

        connection = OpenStackAuth.get_connection(
            auth_url=region.auth_url, region_name=region.id
        )

        server_generator = connection.compute.servers(
            all_tenants=True, project_id=vpc.id
        )
    except Exception as e:
        raise HTTPException(400, detail=str(e)) from e

    ret: list[GetComputeResponse] = []

    for server in server_generator:
        ports = connection.network.ports(device_id=server.id)

        ip_addresses = []

        for port in ports:
            subnet_id = port.fixed_ips[0]["subnet_id"]
            subnet = connection.get_subnet_by_id(subnet_id)

            ip_addresses.append(
                IPAddress(
                    ip_address=port.fixed_ips[0]["ip_address"], subnet=subnet.cidr
                )
            )

        console = connection.compute.create_console(server, console_type="novnc")

        ret.append(
            GetComputeResponse(
                id=server.id,
                name=server.name,
                ip_addresses=ip_addresses,
                status=server.status,
                console_url=console["url"],
            )
        )

    return GetAllComputeResponse(computes=ret)
