import { useMutation, useQuery } from 'react-query';
import { SubnetApi } from '../api/subnet';

function useCreateSubnet() {
    const createSubnetMutation = useMutation({
        mutationFn: async ({
            vpc_id,
            network_address,
        }: {
            vpc_id: string;
            network_address: string;
        }) => {
            return await SubnetApi.create({
                vpc_id: vpc_id,
                network_address: network_address,
            });
        },
    });

    return { createSubnetMutation };
}

function useDeleteSubnet() {
    const deleteSubnetMutation = useMutation({
        mutationFn: async ({ subnet_id, vpc_id }: { subnet_id: string; vpc_id: string }) => {
            return await SubnetApi.delete(subnet_id, vpc_id);
        },
    });

    return { deleteSubnetMutation };
}

function useGetSubnet(vpc_id: string) {
    const {
        data: subnets,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['subnets', vpc_id],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await SubnetApi.getAll(vpc_id);

            return res;
        },
    });

    return { subnets, isLoading, isError, isFetching };
}

export { useGetSubnet, useCreateSubnet, useDeleteSubnet };
