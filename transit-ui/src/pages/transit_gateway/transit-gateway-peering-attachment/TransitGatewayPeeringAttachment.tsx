import { Box, Button, Typography } from "@mui/material";

import { useDialog } from "../../../context/DialogContext";



export default function TransitGatewayPeeringAttachment() {
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


        </Box>



    </Box >
}