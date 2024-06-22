import { useMutation, useQuery } from 'react-query';

import { VPCTransitGatewayRouteApi } from '../api/transit-gateway/vpc-transit-route';


function useCreateVPCTransitGatewayRoute() {
    const createCreateVPCTransitGatewayRoute = useMutation({
        mutationFn: async ({
            region_id, 
            vpc_id,
            destination_cidr, 
            transit_gateway_vpc_attachment_id, 
        }: {
           
            region_id: string;
            vpc_id: string,
            destination_cidr: string, 
            transit_gateway_vpc_attachment_id: string, 
            
        }) => {
            return await VPCTransitGatewayRouteApi.create(region_id, { vpc_id, destination_cidr, transit_gateway_vpc_attachment_id });
        },
    });

    return { createCreateVPCTransitGatewayRoute };
}


function useGetVPCTransitGatewayRoute(region_id: string, vpcId: string) {
    const {
        data: vpcTransitGatewayRoutes,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['vpc-transit-gateway-routes', region_id, vpcId],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await VPCTransitGatewayRouteApi.getAll(region_id, vpcId);

            return res;
        },
    });

    return { vpcTransitGatewayRoutes, isLoading, isError, isFetching };
}

function useDeleteVPCTransitGatewayRoute() {
    const deleteVPCTransitGatewayRoute = useMutation({
        mutationFn: async ({ region_id, routeId }: { region_id: string; routeId: string }) => {
            return await VPCTransitGatewayRouteApi.delete(region_id, routeId);
        },
    });

    return { deleteVPCTransitGatewayRoute };
}

export {  useCreateVPCTransitGatewayRoute, useGetVPCTransitGatewayRoute, useDeleteVPCTransitGatewayRoute };
