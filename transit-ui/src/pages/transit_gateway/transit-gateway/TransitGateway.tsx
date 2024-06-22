import { Box, Button, Typography } from "@mui/material";

import { useDialog } from "../../../context/DialogContext";
import TransitGatewayGrid from "./TransitGatewayGrid";
import TransitGatewayCreateForm from "./TransitGatewayCreateForm";



export default function TransitGateway() {
    const { DialogComponent, openDialog, closeDialog } = useDialog()

    return <Box width="100%" height="100%" display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <div>

                <Typography variant="h5" fontWeight="bold">
                    Transit Gateway
                </Typography>
                <Typography variant="body1" color={"gray"}>
                    Manage your Transit Gateway
                </Typography>

            </div>

            <Button
                size="small" variant="outlined"
                disableRipple
                onClick={() => {
                    openDialog("create-transit-gateway")
                }}>


                Create Transit Gateway
            </Button>

        </Box>

        <TransitGatewayGrid />
        <DialogComponent dialogId="create-transit-gateway" title="Create Transit Gateway" contextText="Create Transit Gateway" dividers={true}>
            <TransitGatewayCreateForm closeDialog={closeDialog} />
        </DialogComponent>

    </Box >
}