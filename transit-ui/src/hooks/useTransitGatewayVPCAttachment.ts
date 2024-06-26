import { useMutation, useQuery } from 'react-query';



import { TransitGatewayVPCAttachmentApi } from '../api/transit-gateway/transit-vpc-attachment';

function useCreateTransitGatewayVPCAttachment() {
    const createTransitGatewayVPCAttachment = useMutation({
        mutationFn: async ({
            region_id,
            transit_gateway_id,  
            vpc_id, 
            vpc_router_id, 
            vpc_cidr, 
            name, 
        }: {
           
            region_id: string;
            transit_gateway_id :string,  
            vpc_id: string, 
            vpc_router_id: string, 
            vpc_cidr: string
            name: string
            
        }) => {
            return await TransitGatewayVPCAttachmentApi.create(region_id, { 
                name,
                transit_gateway_id,  
                vpc_id, 
                vpc_router_id, 
                vpc_cidr
            });
        },
    });

    return {  createTransitGatewayVPCAttachment }
}


function useGetTransitGatewayVPCAttachmentByVPCId(region_id: string, vpc_id: string) {
    const {
        data: transitGatewayVPCAttachments,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['transit-gateway-vpc-attachments-by-vpc', region_id, vpc_id],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await TransitGatewayVPCAttachmentApi.getAll(region_id);

            return  res.filter((attachment) => attachment.vpc_id === vpc_id);
        },
    });

    return { transitGatewayVPCAttachments, isLoading, isError, isFetching };
}

function useGetTransitGatewayVPCAttachment(region_id: string) {
    const {
        data: transitGatewayVPCAttachments,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['transit-gateway-vpc-attachments', region_id],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await TransitGatewayVPCAttachmentApi.getAll(region_id);

            return res;
        },
    });

    return { transitGatewayVPCAttachments, isLoading, isError, isFetching };
}

function useGetTransitGatewayVPCAttachmentByTransitGatewayId(region_id: string, transit_gateway_id: string ) {
    const {
        data: transitGatewayVPCAttachments,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['transit-gateway-vpc-attachments', region_id, transit_gateway_id],

        refetchOnWindowFocus: false,


        queryFn: async () => {
            const res = await TransitGatewayVPCAttachmentApi.getAllByTransitGateway(region_id, transit_gateway_id!);

            return res; 
        }})

        return { transitGatewayVPCAttachments, isLoading, isError, isFetching };
    }


function useDeleteTransitGatewayVPCAttachment() {
    const deleteTransitGatewayVPCAttachment = useMutation({
        mutationFn: async ({ region_id, attachmentId }: { region_id: string; attachmentId: string }) => {
            return await TransitGatewayVPCAttachmentApi.delete(region_id, attachmentId);
        },
    });

    return { deleteTransitGatewayVPCAttachment };
}

export { 
    useCreateTransitGatewayVPCAttachment, 
    useGetTransitGatewayVPCAttachment, 
    useGetTransitGatewayVPCAttachmentByVPCId, 
    useGetTransitGatewayVPCAttachmentByTransitGatewayId,
    useDeleteTransitGatewayVPCAttachment
};
