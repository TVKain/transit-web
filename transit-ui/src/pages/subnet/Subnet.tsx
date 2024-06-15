import { Box, Button, Typography } from "@mui/material";


import { useDialog } from "../../context/DialogContext";

import SubnetCreateForm from "./SubnetCreateForm";
import SubnetGrid from "./SubnetGrid";

import Info from "../info/Info";
import { useParams } from "react-router-dom";


export default function Subnet() {

    const { DialogComponent, openDialog, closeDialog } = useDialog()

    const { vpcId } = useParams()

    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column" gap={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                    <Typography variant="h5" fontWeight="bold">
                        Subnet
                    </Typography>
                    <Typography variant="body1" color={"gray"}>
                        Manage your subnets
                    </Typography>
                </div>
                <Button
                    size="small" variant="outlined"
                    disableRipple
                    disabled={!vpcId}
                    onClick={() => {
                        openDialog("create-subnet")
                    }}>
                    Create subnet
                </Button>

            </Box>

            {
                vpcId ? <>
                    <SubnetGrid />

                    <DialogComponent dialogId="create-subnet" title="Create subnet" contextText="Create subnet for your VPC" dividers={true}>
                        <SubnetCreateForm closeDialog={closeDialog} />
                    </DialogComponent>
                </> : <Info infoMessage="You have no VPCs" />
            }

        </Box>
    );
}
