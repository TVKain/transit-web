import { Box, Button, Typography } from "@mui/material";

import { useDialog } from "../../../context/DialogContext";
import VPCRouteTableGrid from "./VPCRouteTableGrid";
import { useParams } from "react-router-dom";
import VPCRouteTableCreateForm from "./VPCRouteTableCreateForm";


export default function VPC() {

    const { vpcId } = useParams()

    const { DialogComponent, openDialog, closeDialog } = useDialog()

    return <Box width="100%" height="100%" display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <div>

                <Typography variant="h5" fontWeight="bold">
                    VPC Route Table
                </Typography>
                <Typography variant="body1" color={"gray"}>
                    Manage your Virtual Private Cloud Route Table
                </Typography>

            </div>

            <Button
                size="small" variant="outlined"
                disableRipple
                disabled={!vpcId}
                onClick={() => {
                    openDialog("create-vpc-route")
                }}
            >
                Add a route
            </Button>

        </Box>

        {vpcId && <>
            <VPCRouteTableGrid />
            <DialogComponent dialogId="create-vpc-route" title="Add VPC route" contextText="Add route for your VPC" dividers={true}>
                <VPCRouteTableCreateForm closeDialog={closeDialog} />
            </DialogComponent>
        </>}


    </Box >
}