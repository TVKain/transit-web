interface TransitGateway {
    id: string; 
    name: string;
    status: string; 
    created_at: string;
}

interface TransitGatewayVPCAttachment {
    name: string;
    id: string; 
    transit_gateway_id: string;
    vpc_id: string; 
    vpc_cidr: string;
    status: string;
    created_at: string;
}

interface TransitGatewayRoute {
    id: string; 
    destination: string; 
    target: string;
    status: string;
    type: string;
}

interface VPCTransitGatewayRoute {
    id: string; 
    vpc_id: string;
    destination_cidr: string; 
    target: string;
    status: string;
}

interface TransitGatewayPeeringAttachment {
    id: string; 
    name: string;
    transit_gateway_id: string;
    peer_transit_gateway_id: string;
    status: string;
    remote_region_id: string; 
}

export type { TransitGateway, TransitGatewayVPCAttachment, VPCTransitGatewayRoute, TransitGatewayRoute, TransitGatewayPeeringAttachment }