import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import Error from "../pages/info/Error";

import { useNavigate, useParams } from "react-router";

import useRegion from "../hooks/useRegion";
import Loading from "../pages/info/Loading";


const menuItems = [
    {
        label: "Home",
        to: "home"
    },
    {
        label: "Compute",
        to: "computes"
    },
    {
        label: "Subnet",
        to: "subnets",
    },
    {
        label: "VPC",
        to: "vpcs",
        type: "main"
    },
    {
        label: "VPC",
        to: "vpcs/vpcs",
        type: "sub",
    },
    {
        label: "Route Table",
        type: "sub",
        to: "vpcs/route-tables",
    },
    {
        label: "Transit gateway",
        to: "transit-gateways",
        type: "main",
    },

    {
        label: "Transit Gateway",
        to: "transit-gateways/transit-gateways",
        type: "sub"
    },
    {
        label: "VPC Attachment",
        to: "transit-gateways/vpc-attachments",
        type: "sub"
    },
    {
        label: "Peering Attachment",
        to: "transit-gateways/peering-attachments",
        type: "sub"
    },
]



const Sidebar = () => {
    const navigate = useNavigate()

    const { regions, isLoading } = useRegion()

    const { regionId, vpcId } = useParams()

    const currentRegion = regions?.find((region) => region.id === regionId);

    if (isLoading) {
        return <Loading text="Loading..." />
    }

    if (!currentRegion) {
        return <Error errorMessage={`No region with id "${regionId}"`} />
    }

    if (vpcId && !currentRegion.vpcs.find((vpc) => vpc.id === vpcId)) {
        return <Error errorMessage={`No vpc with id "${vpcId}" in region "${regionId}"`} />
    }


    return <Box display='flex' flexDirection="column" width="100%" padding={2} gap={2} >
        {vpcId ?
            <>
                <FormControl fullWidth size="small">
                    <InputLabel id="vpc label">VPC</InputLabel>
                    <Select
                        id="vpc_select"
                        labelId="vpc label"
                        label="VPC"
                        renderValue={(selected) => "VPC: " + selected}
                        value={currentRegion.vpcs.find((vpc) => vpc.id === vpcId)!.name}
                        onChange={(event) => {
                            let vpc = currentRegion.vpcs.find((vpc) => vpc.name === event.target.value)

                            navigate(`/region/${regionId}/vpc/${vpc?.id}/home`)
                        }}>
                        {currentRegion.vpcs.map((vpc) =>
                            <MenuItem key={vpc.name} value={vpc.name}>
                                {vpc.name} - {vpc.cidr}
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
                <TextField size="small" label="ID" value={vpcId} />
                <TextField size="small" label="CIDR" value={currentRegion.vpcs.find((vpc) => vpc.id === vpcId)!.cidr} />
            </>
            : <>
                <FormControl fullWidth size="small">
                    <InputLabel>You have no VPCs</InputLabel>
                    <Select disabled={true} value={""}>

                    </Select>
                </FormControl>
                <TextField size="small" disabled={true} value={"You have no VPCs"} />
            </>

        }
        <Divider />

        <Box display="flex" flexDirection="column" >
            {
                menuItems.map((menuItem) =>
                    <Button
                        variant={location.pathname.includes(menuItem.to) ? "contained" : "text"}
                        key={menuItem.to}

                        color={location.pathname.includes(menuItem.to) && menuItem.type !== "sub" ? "primary" : "inherit"}
                        sx={{
                            justifyContent: "flex-start",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "auto",
                            fontSize: menuItem.type !== "sub" ? "0.85rem" : "0.7rem",
                            marginLeft: menuItem.type === "sub" ? 2 : 0,
                        }}
                        onClick={menuItem.type === "main" ? () => { } : () => {
                            vpcId ? navigate(`/region/${regionId}/vpc/${vpcId}/${menuItem.to}`) :
                                navigate(`/region/${regionId}/vpc/${menuItem.to}`)
                        }}
                    >
                        {menuItem.label}
                    </Button>)
            }

        </Box>


    </Box >


};

export default Sidebar;