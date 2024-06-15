import { useMutation, useQuery } from 'react-query';

import { VPCApi } from '../api/vpc';

function useCreateVPC() {
    const createVPCMutation = useMutation({
        mutationFn: async ({
            user_id,
            region_id,
            name,
            cidr,
        }: {
            user_id: string;
            region_id: string;
            name: string;
            cidr: string;
        }) => {
            return await VPCApi.create({
                region_id: region_id,
                user_id: user_id,
                name: name,
                cidr: cidr,
            });
        },
    });

    return { createVPCMutation };
}

function useGetVPC(user_id: string, region_id: string) {
    const {
        data: vpcs,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['vpcs', region_id],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await VPCApi.getAll(user_id, region_id);

            return res;
        },
    });

    return { vpcs, isLoading, isError, isFetching };
}

export { useGetVPC, useCreateVPC };
