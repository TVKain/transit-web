import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { RegionApi } from '../../api/region';
import { VPCApi } from '../../api/vpc';
import Loading from '../info/Loading';
import useRegion from '../../hooks/useRegion';
import Error from '../info/Error';



function Initialize() {

    const {
        regions,
        isLoading: loadingRegions,
        isError: errorLoadingRegions
    } = useRegion()

    if (loadingRegions) {
        return <Loading text='Loading...' />;
    }

    if (errorLoadingRegions) {
        return <Error errorMessage='ERR: Can not load regions' />
    }

    const selectedRegionVPC = {
        vpcId: regions![0].vpcs[0].id,
        regionId: regions![0].id
    };

    return <Navigate to={`/home/regions/${selectedRegionVPC?.regionId}/vpcs/${selectedRegionVPC?.vpcId}`} />;
}

export default Initialize;
