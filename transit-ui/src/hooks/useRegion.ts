import { useQuery } from 'react-query';
import { RegionApi } from '../api/region';

const fetchRegions = async () => {
    const userId = JSON.parse(localStorage.getItem('user_id')!);

    const res = await RegionApi.getAll(userId);
    return res;
};

function useRegion() {
    const {
        data: regions,
        isLoading,
        isError,
    } = useQuery('regions', fetchRegions, {
        refetchOnWindowFocus: false,
    });

    return { regions, isLoading, isError };
}

export default useRegion;
