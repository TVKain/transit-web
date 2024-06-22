import { useMutation, useQuery } from 'react-query';



import { TransitGatewayApi } from '../api/transit-gateway/transit-gateway';
function useCreateTransitGateway() {
    const createTransitGatewayMutation = useMutation({
        mutationFn: async ({
            region_id, 
            name, 
        }: {
           
            region_id: string;
            name: string;
            
        }) => {
            return await TransitGatewayApi.create(region_id, { name });
        },
    });

    return { createTransitGatewayMutation };
}

function useGetActiveTransitGateway(region_id: string) {
    const {
        data: transitGateways,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['transit-gateways', region_id],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await TransitGatewayApi.getAll(region_id);


            return res.filter((transitGateway) => transitGateway.status === 'ACTIVE');
        },
    });

    return { transitGateways, isLoading, isError, isFetching };
}


function useGetTransitGateway(region_id: string) {
    const {
        data: transitGateways,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['transit-gateways', region_id],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await TransitGatewayApi.getAll(region_id);

            return res;
        },
    });

    return { transitGateways, isLoading, isError, isFetching };
}

function useDeleteTransitGateway() {
    const deleteTransitGatewayMutation = useMutation({
        mutationFn: async ({region_id, transitGatewayId}: {region_id: string, transitGatewayId: string}) => {
            return await TransitGatewayApi.delete(region_id, transitGatewayId);
        },
    });

    return { deleteTransitGatewayMutation };
}

export { useCreateTransitGateway, useGetTransitGateway, useDeleteTransitGateway, useGetActiveTransitGateway };
