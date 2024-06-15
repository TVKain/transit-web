
import { AppBar, Box, Button, Divider, FormControl, MenuItem, Select, Toolbar, Typography } from "@mui/material";

import GenericMenu from "../components/ui/GenericMenu";
import { ArrowDropDown, Logout } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import useRegion from "../hooks/useRegion";
import { useNavigate, useParams } from "react-router";
import Error from "../pages/info/Error";

const Header = () => {
    const navigate = useNavigate()

    const { regions, isLoading: regionIsLoading } = useRegion()

    const { user, isLoading: userIsLoading } = useUser()

    const auth = useAuth()

    const { regionId } = useParams()

    if (userIsLoading || regionIsLoading) {
        return null;
    }

    if (!(regions?.find((region) => region.id === regionId))) {
        return <Error errorMessage={`No region with id ${regionId}`} />
    }

    return (
        <AppBar position="static" color="secondary">
            <Toolbar >
                <Box alignItems="center" height="100%" display="flex" sx={{
                    gap: 2,
                    flexGrow: 1
                }}> <img src="/assets/icon.svg" width={40} />

                    <Divider sx={{
                        height: "75%"
                    }} variant="middle" orientation="vertical" />

                    <Typography variant="h6" color="primary" fontWeight="bold" >MINI CLOUD</Typography>

                    <FormControl sx={{ minWidth: 160 }} size="small">
                        <Select
                            renderValue={(selected) => {
                                return 'Region: ' + selected;
                            }}
                            placeholder="Region"
                            labelId="region-label"
                            id="region-select"
                            value={regionId}
                            onChange={(event) => {
                                navigate(`/region/${event.target.value}/`)
                            }}
                        >
                            {regions!.map(region => <MenuItem value={region.id} key={region.id}>{region.id}</MenuItem>)}
                        </Select>
                    </FormControl>

                </Box>

                <GenericMenu
                    menuWidth={200}
                    triggerElement={
                        <Button
                            disableRipple size="small"
                            sx={{ textTransform: 'none', fontSize: 18 }}
                            color="inherit" endIcon={<ArrowDropDown />}
                        >
                            {user?.username}
                        </Button>}
                    menuItems={[
                        { label: "Logout", onClick: () => auth.logout(), icon: <Logout /> }
                    ]} />
            </Toolbar>

        </AppBar>
    );
};

export default Header;