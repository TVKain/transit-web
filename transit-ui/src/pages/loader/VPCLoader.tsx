import { Navigate, useParams } from "react-router";
import useRegion from "../../hooks/useRegion";
import Loading from "../info/Loading";
import { Box } from "@mui/material";
import Error from "../info/Error";

export default function RegionLoader() {
    const { regions, isLoading } = useRegion();
    const { regionId } = useParams();


    if (isLoading) {
        return (
            <Box height="100vh" width="100vw">
                <Loading />
            </Box>
        );
    }

    if (!regions || regions.length === 0) {
        return (
            <Box height="100vh" width="100vw">
                <Error errorMessage="No region found" />
            </Box>
        );
    }


    const currentRegion = regions.find(region => region.id === regionId);


    if (!currentRegion) {
        return (
            <Box height="100vh" width="100vw">
                <Error errorMessage={`No region with id ${regionId}`} />
            </Box>
        );
    }


    if (currentRegion.vpcs.length !== 0) {
        return <Navigate to={`/region/${currentRegion.id}/vpc/${currentRegion.vpcs[0].id}/home`} />;
    }

    return <Navigate to={`/region/${currentRegion.id}/vpc/home`} />;
}
