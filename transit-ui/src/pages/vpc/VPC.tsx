import { Box, Button, Typography } from "@mui/material";

import { useDialog } from "../../context/DialogContext";

import VPCGrid from "./VPCGrid";
import VPCCreateForm from "./VPCCreateForm";

export default function VPC() {
    const { DialogComponent, openDialog, closeDialog } = useDialog()

    return <Box width="100%" height="100%" display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <div>

                <Typography variant="h5" fontWeight="bold">
                    VPC
                </Typography>
                <Typography variant="body1" color={"gray"}>
                    Manage your Virtual Private Cloud
                </Typography>

            </div>

            <Button
                size="small" variant="outlined"
                disableRipple
                onClick={() => {
                    openDialog("create-vpc")
                }}>
                Create VPC
            </Button>

        </Box>


        <VPCGrid />
        <DialogComponent dialogId="create-vpc" title="Create vpc" contextText="Create VPC" dividers={true}>
            <VPCCreateForm closeDialog={closeDialog} />
        </DialogComponent>

    </Box >
}