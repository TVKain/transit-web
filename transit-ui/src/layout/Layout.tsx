import { Box, Divider } from "@mui/material";
import { Navigate, Outlet, useParams } from "react-router";

import Header from "./Header";
import Sidebar from "./Sidebar";

import useRegion from "../hooks/useRegion";
import Loading from "../pages/info/Loading";
import useUser from "../hooks/useUser";
import Error from "../pages/info/Error";

export default function Layout() {
    const { regions, isLoading: regionIsLoading, isError } = useRegion();
    const { isLoading: userIsLoading, isError: userIsError } = useUser();
    const { regionId, vpcId } = useParams();

    if (isError) {
        return <Error />;
    }

    if (userIsError) {
        return <Error errorMessage="Invalid user" />
    }

    if (regionIsLoading || userIsLoading) {
        return <Loading text="Loading..." />;
    }

    const currentRegion = regions?.find((region) => region.id === regionId);

    if (!currentRegion) {
        return <Error errorMessage={`No region with id "${regionId}"`} />;
    }

    const currentVPC = currentRegion.vpcs.find((vpc) => vpc.id === vpcId);

    if (vpcId && !currentVPC) {
        return <Error errorMessage={`No VPC with id "${vpcId}" in region "${regionId}"`} />;
    }

    if (!vpcId && currentRegion.vpcs.length !== 0) {
        return <Navigate to={`/region/${regionId}/vpc/${currentRegion.vpcs[0].id}/home`} />
    }

    return (
        <Box minWidth={920} display="flex" height="100vh" flexDirection="column">
            <Header />
            <Box display="flex" flex={1} width="100%">
                <Box width="20%">
                    <Sidebar />
                </Box>
                <Divider orientation="vertical" />
                <Box width="80%" p={2}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
