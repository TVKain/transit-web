import { useMutation, useQuery } from 'react-query';



import { TransitGatewayRouteApi } from '../api/transit-gateway/transit-route';

function useCreateTransitGatewayVPCRoute() {
    const createTransitGatewayVPCRoute = useMutation({
        mutationFn: async ({
            region_id,
            destination_cidr, 
            vpc_attachment_id,
            
        }: {
           
            region_id: string;
            destination_cidr: string, 
            vpc_attachment_id: string,
            
        }) => {
            return await TransitGatewayRouteApi.createVPCRoute(region_id, { 
                destination_cidr, 
                vpc_attachment_id,
            });
        },
    });

    return {  createTransitGatewayVPCRoute }
}


function useGetTransitGatewayRoute(region_id: string, transit_gateway_id: string) {
    const {
        data: transitGatewayRoutes,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['transit-gateway-routes', region_id, transit_gateway_id],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await TransitGatewayRouteApi.getAll(region_id, transit_gateway_id);

            return res;
        },
    });

    return { transitGatewayRoutes, isLoading, isError, isFetching };
}

const useDeleteTransitGatewayVPCRoute = () => {
    const deleteTransitGatewayVPCRoute = useMutation(
        async ({ region_id, route_id }: { region_id: string; route_id: string }) => {
            return await TransitGatewayRouteApi.deleteVPCRoute(region_id, route_id);
        }
    );

    return { deleteTransitGatewayVPCRoute };
}

const useCreateTransitGatewayPeeringRoute = () => {
    const createTransitGatewayPeeringRoute = useMutation(
        async ({ region_id, destination_cidr, transit_gateway_peering_attachment_id }: { region_id: string; destination_cidr: string; transit_gateway_peering_attachment_id: string }) => {
            return await TransitGatewayRouteApi.createPeeringRoute(region_id, { destination_cidr, transit_gateway_peering_attachment_id });
        }
    );

    return { createTransitGatewayPeeringRoute };
}

const useDeleteTransitGatewayPeeringRoute = () => {
    const deleteTransitGatewayPeeringRoute = useMutation(
        async ({ region_id, route_id }: { region_id: string; route_id: string }) => {
            return await TransitGatewayRouteApi.deletePeeringRoute(region_id, route_id);
        }
    );

    return { deleteTransitGatewayPeeringRoute };
}



export { 
    useGetTransitGatewayRoute, 
    useCreateTransitGatewayVPCRoute, 
    useDeleteTransitGatewayVPCRoute, 
    useCreateTransitGatewayPeeringRoute, 
    useDeleteTransitGatewayPeeringRoute
};
