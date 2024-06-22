interface TransitGateway {
    id: string; 
    name: string;
    status: string; 
    created_at: string;
}

interface TransitGatewayVPCAttachment {
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

export type { TransitGateway, TransitGatewayVPCAttachment, VPCTransitGatewayRoute, TransitGatewayRoute }