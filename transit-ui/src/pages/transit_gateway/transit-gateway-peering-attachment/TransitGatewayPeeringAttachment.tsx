import { Box, Button, Typography } from "@mui/material";

import { useDialog } from "../../../context/DialogContext";
import TransitGatewayPeeringGrid from "./TransitGatewayPeeringAttachmentGrid";
import TransitGatewayPeeringAttachmentCreateForm from "./TransitGatewayPeeringAttachmentCreateForm";



export default function TransitGatewayPeeringAttachment() {
    const { DialogComponent, openDialog, closeDialog } = useDialog()

    return <Box width="100%" height="100%" display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <div>

                <Typography variant="h5" fontWeight="bold">
                    Transit Gateway Peering Attachments
                </Typography>
                <Typography variant="body1" color={"gray"}>
                    Manage your Transit Gateway Peering Attachments
                </Typography>

            </div>
            <Button
                size="small" variant="outlined"
                disableRipple

                onClick={() => {
                    openDialog("create-transit-gateway-peerring-attachment")
                }}
            >
                Add a Peering route
            </Button>


        </Box>


        <TransitGatewayPeeringGrid />

        <DialogComponent dialogId="create-transit-gateway-peerring-attachment" title="Create Transit Gateway Peering Attachment" contextText="Create Transit Gateway Peering Attachment" dividers={true}>
            <TransitGatewayPeeringAttachmentCreateForm closeDialog={closeDialog} />
        </DialogComponent>

    </Box >
}