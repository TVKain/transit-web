import { Navigate } from "react-router";
import useRegion from "../../hooks/useRegion";
import Loading from "../info/Loading";
import { Box } from "@mui/material";
import Error from "../info/Error";

export default function RegionLoader() {
    const { regions, isLoading } = useRegion()

    if (isLoading) {
        return <Box height="100vh" width="100vw">
            <Loading />
        </Box>
    }

    if (regions!.length === 0) {
        return <Box height="100vh" width="100vw">
            <Error errorMessage="No region found" />
        </Box>
    }


    return <Navigate to={`/region/${regions![0]!.id}/vpc/`} />
}

