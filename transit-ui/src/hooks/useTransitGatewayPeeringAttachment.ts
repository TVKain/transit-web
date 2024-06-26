import { useMutation, useQuery } from 'react-query';
import { TransitGatewayPeeringApi } from '../api/transit-gateway/transit-peering-attachment';


function useCreateTransitGatewayPeeringAttachment() {
    const createTransitGatewayPeeringAttachmentMutation = useMutation({
        mutationFn: async ({
            name,
            transit_gateway_id,
            region_id,
            remote_region_id,
            remote_transit_gateway_id,
        }: {
            name: string; 
            transit_gateway_id: string;
            region_id: string;
            remote_region_id: string;
            remote_transit_gateway_id: string;
        }) => {
            return await TransitGatewayPeeringApi.create({
                name: name,
                transit_gateway_id: transit_gateway_id,
                region_id: region_id,
                remote_region_id: remote_region_id,
                remote_transit_gateway_id: remote_transit_gateway_id,
            });
        },
    });

    return { createTransitGatewayPeeringAttachmentMutation };

}

function useDeleteTransitGatewayPeeringAttachment() {
    const deleteTransitGatewayPeeringAttachmentMutation = useMutation({
        mutationFn: async ({ region_id, transit_gateway_peering_attachment_id }: { region_id: string; transit_gateway_peering_attachment_id: string }) => {
            return await TransitGatewayPeeringApi.delete(region_id, transit_gateway_peering_attachment_id);
        },
    });

    return { deleteTransitGatewayPeeringAttachmentMutation };
}

// function useCreateSubnet() {
//     const createSubnetMutation = useMutation({
//         mutationFn: async ({
//             vpc_id,
//             network_address,
//         }: {
//             vpc_id: string;
//             network_address: string;
//         }) => {
//             return await SubnetApi.create({
//                 vpc_id: vpc_id,
//                 network_address: network_address,
//             });
//         },
//     });

//     return { createSubnetMutation };
// }

// function useDeleteSubnet() {
//     const deleteSubnetMutation = useMutation({
//         mutationFn: async ({ subnet_id, vpc_id }: { subnet_id: string; vpc_id: string }) => {
//             return await SubnetApi.delete(subnet_id, vpc_id);
//         },
//     });

//     return { deleteSubnetMutation };
// }

function useGetTransitGatewayPeeringAttachment(regionId: string) {
    const {
        data: transitGatewayPeeringAttachments,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['transit-gateway-peering-attachments', regionId],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await TransitGatewayPeeringApi.getAll(regionId);

            return res;
        },
    });

    return { transitGatewayPeeringAttachments, isLoading, isError, isFetching };
}

function useGetTransitGatewayPeeringAttachmentByTransitGatewayId(regionId: string, transitGatewayId: string) {
    const {
        data: transitGatewayPeeringAttachments,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['transit-gateway-peering-attachments', regionId, transitGatewayId],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await TransitGatewayPeeringApi.getAll(regionId);

            return res.filter((attachment
            ) => attachment.transit_gateway_id === transitGatewayId);
        },
    });

    return { transitGatewayPeeringAttachments, isLoading, isError, isFetching };
}

export { useGetTransitGatewayPeeringAttachment, 
    useCreateTransitGatewayPeeringAttachment, 
    useDeleteTransitGatewayPeeringAttachment, 
    useGetTransitGatewayPeeringAttachmentByTransitGatewayId };
