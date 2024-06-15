import { Box, Button, Typography } from "@mui/material";


import ComputeGrid from "./ComputeGrid";
import ComputeCreateForm from "./ComputeCreateForm";
import { useDialog } from "../../context/DialogContext";
import { useParams } from "react-router";
import Info from "../info/Info";



export default function Compute() {
    const { DialogComponent, openDialog, closeDialog } = useDialog()

    const { vpcId } = useParams()

    return <Box width="100%" height="100%" display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <div>

                <Typography variant="h5" fontWeight="bold">
                    Compute
                </Typography>
                <Typography variant="body1" color={"gray"}>
                    Manage your compute instances
                </Typography>

            </div>

            <Button
                size="small" variant="outlined"
                disableRipple
                disabled={!vpcId}
                onClick={() => {
                    openDialog("create-compute")
                }}>
                Create compute
            </Button>

        </Box>
        {
            vpcId ?
                <>
                    <ComputeGrid />
                    <DialogComponent dialogId="create-compute" title="Create compute" contextText="Create compute for your VPC" dividers={true}>
                        <ComputeCreateForm closeDialog={closeDialog} />
                    </DialogComponent>
                </> :
                <Info infoMessage="You have no VPCs" />
        }
    </Box >
}