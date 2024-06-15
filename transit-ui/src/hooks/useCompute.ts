import { useMutation, useQuery } from 'react-query';

import { ComputeApi } from '../api/compute';

function useCreateCompute() {
    const createComputeMutation = useMutation({
        mutationFn: async ({
            vpc_id,
            subnet_id,
            compute_name,
        }: {
            vpc_id: string;
            subnet_id: string;
            compute_name: string;
        }) => {
            return await ComputeApi.create({
                vpc_id: vpc_id,
                subnet_id: subnet_id,
                name: compute_name,
            });
        },
    });

    return { createComputeMutation };
}

function useDeleteCompute() {
    const deleteComputeMutation = useMutation({
        mutationFn: async ({ compute_id, vpc_id }: { compute_id: string; vpc_id: string }) => {
            return await ComputeApi.delete(compute_id, vpc_id);
        },
    });

    return { deleteComputeMutation };
}

function useGetCompute(vpc_id: string) {
    const {
        data: computes,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ['computes', vpc_id],

        refetchOnWindowFocus: false,

        queryFn: async () => {
            const res = await ComputeApi.getAll(vpc_id);

            console.log('In usecompute: ' + res);

            return res;
        },
    });

    return { computes, isLoading, isError, isFetching };
}

export { useGetCompute, useDeleteCompute, useCreateCompute };
