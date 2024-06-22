import { Box, Button, Typography } from "@mui/material";

import { useDialog } from "../../../context/DialogContext";
import TransitGatewayVPCAttachmentGrid from "./TransitGatewayVPCAttachmentGrid";
import TransitGatewayVPCAttachmentCreateForm from "./TransitGatewayVPCAttachmentCreateForm";



export default function TransitGatewayVPCAttachment() {
    const { DialogComponent, openDialog, closeDialog } = useDialog()

    return <Box width="100%" height="100%" display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <div>

                <Typography variant="h5" fontWeight="bold">
                    Transit Gateway VPC Attachments
                </Typography>
                <Typography variant="body1" color={"gray"}>
                    Manage your Transit Gateway VPC Attachments
                </Typography>

            </div>

            <Button
                size="small" variant="outlined"
                disableRipple
                onClick={() => {
                    openDialog("create-transit-gateway-vpc-attachment")
                }}>


                Create Transit Gateway VPC Attachment
            </Button>
        </Box>

        <TransitGatewayVPCAttachmentGrid />
        <DialogComponent dialogId="create-transit-gateway-vpc-attachment" title="Create Transit Gateway VPC Attachment" contextText="Connect Transit Gateway to your VPC" dividers={true}>
            <TransitGatewayVPCAttachmentCreateForm closeDialog={closeDialog} />
        </DialogComponent>


    </Box >
}