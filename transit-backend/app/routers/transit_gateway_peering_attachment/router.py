import ipaddress
import json
import logging 

from fastapi import APIRouter, HTTPException

import requests

from openstack import exceptions as openstack_exceptions

from app.api.openstack_api import OpenStackAuth

from app.database.repositories.region.region import RegionRepository

from app.routers.transit_gateway_peering_attachment.models.request import CreateTransitGatewayPeeringAttachmentRequest, DeleteTransitGatewayPeeringAttachmentRequest


router = APIRouter(prefix="/transit_gateway_peering_attachments", tags=["transit-gateway-peering-attachments"])


@router.post("/") 
def create(request: CreateTransitGatewayPeeringAttachmentRequest): 
    """_summary_

    Args:
        request (CreateTransitGatewayPeeringAttachmentRequest): _description_

    Raises:
        HTTPException: _description_
        HTTPException: _description_
        HTTPException: _description_
    """
    region_repository = RegionRepository()
    
    try: 
        region = region_repository.get(request.region_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Region not found") from e
    
    try: 
        remote_region = region_repository.get(request.remote_region_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Remote region '{request.remote_region_id}' not found") from e
    
    
    print(request.transit_gateway_id)
    print(request.remote_transit_gateway_id)
    
    if request.transit_gateway_id == request.remote_transit_gateway_id:
        raise HTTPException(status_code=400, detail="Transit Gateway and Remote Transit Gateway are the same")
    
    first_region_tgw_url = region.transit_service_url
    second_region_tgw_url = remote_region.transit_service_url
    
    tgw_first_region = _get_transit_gateway(first_region_tgw_url, request.transit_gateway_id)
    
    if not tgw_first_region:
        raise HTTPException(status_code=404, detail=f"Transit Gateway {request.transit_gateway_id} not found")
    
    
    tgw_second_region = _get_transit_gateway(second_region_tgw_url, request.remote_transit_gateway_id)
    
    if not tgw_second_region:
        raise HTTPException(status_code=404, detail=f"Remote Transit Gateway '{request.remote_transit_gateway_id}' not found")
   
    # Check if quota is max
    try: 
        is_quota_max = _get_is_quota_max(first_region_tgw_url, request.transit_gateway_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error while getting is quota max for {request.transit_gateway_id}") from e
    
    if is_quota_max:
        raise HTTPException(status_code=400, detail=f"Quota max reached for transit gateway {request.transit_gateway_id}")
    
    try: 
        is_quota_max = _get_is_quota_max(second_region_tgw_url, request.remote_transit_gateway_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error while getting is quota max for {request.remote_transit_gateway_id}") from e
    
    if is_quota_max:
        raise HTTPException(status_code=400, detail=f"Quota max reached for remote transit gateway {request.remote_transit_gateway_id}")
 
    # Check if transit gateway already peered with remote transit gateway
    try:
        tgw_peer_atts =_get_all_transit_gateway_peering_attachments(first_region_tgw_url, request.transit_gateway_id) 
        
       
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error while getting transit gateway peering attachments") from e
    
    for tgw_peer_att in tgw_peer_atts:
            if tgw_peer_att["remote_transit_gateway_id"] == request.remote_transit_gateway_id:
                raise HTTPException(status_code=400, detail=f"Transit Gateway '{request.transit_gateway_id}' already peered with Remote Transit Gateway '{request.remote_transit_gateway_id}'")
    
    # Get available CIDRs
    try:
        first_region_cidrs = _get_available_cidrs(first_region_tgw_url, request.transit_gateway_id)
        second_region_cidrs = _get_available_cidrs(second_region_tgw_url, request.remote_transit_gateway_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error while getting available CIDRs") from e
    

    # Find common CIDRs
    common_cidrs = list(set(first_region_cidrs) & set(second_region_cidrs))
    common_cidrs.sort()
    if len(common_cidrs) == 0:
        raise HTTPException(status_code=400, detail="No common CIDRs available")
    
    common_cidr = common_cidrs[0]
    
    print(f"Common CIDR: {common_cidrs}")

        
    common_cidr = ipaddress.ip_network(common_cidr)
    
    hosts = list(common_cidr.hosts())
    
    first_tun_ip = hosts[0]
    second_tun_ip = hosts[1]
    
    
  
    # Create transit gateway peering attachment
    try:    
       tgw_peer_att_first = _create_transit_gateway_peering_attachment(first_region_tgw_url, 
                                               name=request.name, 
                                               transit_gateway_id=request.transit_gateway_id, 
                                               remote_tunnel_interface_ip=tgw_second_region["peering_net_ip"], 
                                               remote_transit_gateway_id=request.remote_transit_gateway_id,
                                               tun_ip=str(first_tun_ip), remote_tun_ip=str(second_tun_ip), tun_cidr=str(common_cidr), remote_region_id=request.remote_region_id)
        
       
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error while creating transit gateway peering attachment {e}") from e                                       
    
    # Create transit gateway peering attachment
    try: 
        tgw_peer_att_second = _create_transit_gateway_peering_attachment(second_region_tgw_url,
                                                   name=request.name, 
                                               transit_gateway_id=request.remote_transit_gateway_id, 
                                               remote_tunnel_interface_ip=tgw_first_region["peering_net_ip"], 
                                               remote_transit_gateway_id=request.transit_gateway_id,
                                               tun_ip=str(second_tun_ip), remote_tun_ip=str(first_tun_ip), tun_cidr=str(common_cidr), remote_region_id=request.region_id)
        
       
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error while creating transit gateway peering attachment {e}") from e
    
    
    print(tgw_peer_att_first)
    print(tgw_peer_att_second)
    
    _update_tgw_peer_att_remote_id(first_region_tgw_url, tgw_peer_att_first["id"], tgw_peer_att_second["id"])
    _update_tgw_peer_att_remote_id(second_region_tgw_url, tgw_peer_att_second["id"], tgw_peer_att_first["id"])
    

@router.delete("/{transit_gateway_peering_attachment_id}") 
def delete(transit_gateway_peering_attachment_id: str, region_id: str): 
    region_repository = RegionRepository()
    
    try: 
        region = region_repository.get(region_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Region not found") from e
    
    try:
        tgw_peer_att = _get_transit_gateway_peering_attachment(region.transit_service_url,transit_gateway_peering_attachment_id)
    except Exception as e: 
        raise HTTPException(status_code=404, detail=f"Transit Gateway Peering Attachment '{transit_gateway_peering_attachment_id}' not found for region '{region.id}'") from e
    
    
    remote_region_id = tgw_peer_att["remote_region_id"]
    
    try: 
        remote_region = region_repository.get(remote_region_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Remote region '{remote_region_id}' not found") from e

    first_region_tgw_url = region.transit_service_url
    second_region_tgw_url = remote_region.transit_service_url
    
    result = _get_can_delete(first_region_tgw_url, transit_gateway_peering_attachment_id)
    
    if result["can_delete"] == False:
        raise HTTPException(status_code=400, detail=f"Can not delete transit gateway peering attachment '{transit_gateway_peering_attachment_id}', reason: {result['reason']}")
    
    result = _get_can_delete(second_region_tgw_url, tgw_peer_att["remote_transit_gateway_peering_attachment_id"])
    
    if result["can_delete"] == False:
        raise HTTPException(status_code=400, detail=f"Can not delete transit gateway peering attachment '{tgw_peer_att['remote_transit_gateway_peering_attachment_id']}', reason: {result['reason']}")
    
    try: 
        _delete_transit_gateway_peering_attachment(first_region_tgw_url, transit_gateway_peering_attachment_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error while deleting transit gateway peering attachment") from e
    
    try: 
        _delete_transit_gateway_peering_attachment(second_region_tgw_url, tgw_peer_att["remote_transit_gateway_peering_attachment_id"])
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error while deleting transit gateway peering attachment") from e
 


def _get_transit_gateway_peering_attachment(tgw_url: str, transit_gateway_peering_attachment_id: str):
    try:
        result = requests.get(f"{tgw_url}/transit_gateway_peering_attachments/{transit_gateway_peering_attachment_id}", timeout=5)
        
        return result.json()
    except Exception as e:
        raise Exception("Error while getting transit gateway peering attachment") from e

def _get_all_transit_gateway_peering_attachments(tgw_url: str, transit_gateway_id: str):
    try: 
        # Use query params to filter transit gateway peering attachments
        result = requests.get(f"{tgw_url}/transit_gateway_peering_attachments/?transit_gateway_id={transit_gateway_id}", timeout=5)
        
        return result.json()
    except Exception as e:
        print(e)
        
        raise Exception("Error while getting transit gateway peering attachments") from e

def _create_transit_gateway_peering_attachment(tgw_url: str, 
                                            name: str, 
                                            transit_gateway_id: str, 
                                            remote_tunnel_interface_ip: str, 
                                            remote_transit_gateway_id: str, 
                                            tun_ip: str, 
                                            remote_tun_ip: str, 
                                            remote_region_id: str,
                                            tun_cidr: str):
    try: 
        result = requests.post(f"{tgw_url}/transit_gateway_peering_attachments/", data=json.dumps({
            "name": name,
            "transit_gateway_id": transit_gateway_id,
            "remote_tunnel_interface_ip": remote_tunnel_interface_ip,
            "remote_transit_gateway_id": remote_transit_gateway_id,
            "remote_region_id": remote_region_id,
            "tun_ip": tun_ip,
            "remote_tun_ip": remote_tun_ip,
            "tun_cidr": tun_cidr
        }), timeout=5)


        result.raise_for_status()
        
        return result.json()
        
    except Exception as e: 
        print(e)
        raise Exception(f"{(result.json())['detail']}") from e

def _get_transit_gateway(tgw_url: str, transit_gateway_id: str):
    try:
        result = requests.get(f"{tgw_url}/transit_gateways/{transit_gateway_id}", timeout=5)
        
        return result.json()
    except Exception as e:
        raise Exception("Error while getting transit gateway") from e

def _get_is_quota_max(tgw_url: str, transit_gateway_id: str) -> bool:
    try:
        
        result = requests.get(f"{tgw_url}/transit_gateway_peering_attachments/is_quota_max/{transit_gateway_id}", timeout=5)
        
        return result.json()
    except Exception as e:
       
        raise Exception("Error while getting is quota max") from e

def _get_available_cidrs(tgw_url: str, transit_gateway_id: str) -> list[str]:
    
    try: 
        result = requests.get(f"{tgw_url}/transit_gateway_peering_attachments/available_cidr/{transit_gateway_id}", timeout=5)
        
        return result.json()
    except Exception as e: 
        raise Exception("Error while getting available CIDRs") from e
    
def _get_can_delete(tgw_url: str, transit_gateway_peering_attachment_id: str) -> bool:  
    try:
        result = requests.get(f"{tgw_url}/transit_gateway_peering_attachments/can_delete/{transit_gateway_peering_attachment_id}", timeout=5)

        return result.json()
    except Exception as e:
        raise Exception("Error while getting can delete") from e
    
def _delete_transit_gateway_peering_attachment(tgw_url: str, transit_gateway_peering_attachment_id: str):
    try:
        result = requests.delete(f"{tgw_url}/transit_gateway_peering_attachments/{transit_gateway_peering_attachment_id}", timeout=5)
        
        result.raise_for_status()
    except Exception as e:
        raise Exception("Error while deleting transit gateway peering attachment") from e
    
    
def _update_tgw_peer_att_remote_id(tgw_url: str, transit_gateway_peering_attachment_id: str, remote_tgw_peer_att_id: str):
    try:
        url = f"{tgw_url}/transit_gateway_peering_attachments/{transit_gateway_peering_attachment_id}?remote_transit_gateway_peering_attachment_id={remote_tgw_peer_att_id}"
        
        result = requests.patch(url)
        
        result.raise_for_status()
    except Exception as e:
        raise Exception("Error while updating transit gateway peering attachment") from e