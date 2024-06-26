from sqlmodel import SQLModel

class CreateTransitGatewayPeeringAttachmentRequest(SQLModel):
    name: str | None = None 
    transit_gateway_id: str
    region_id: str 
    remote_region_id: str 
    remote_transit_gateway_id: str
    
    
    
class DeleteTransitGatewayPeeringAttachmentRequest(SQLModel):
    transit_gateway_peering_attachment_id: str
    region_id: str 
    
    