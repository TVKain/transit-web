import { Box, Button, Typography } from "@mui/material";

import { useFormik } from "formik";


import { useQueryClient } from "react-query";



import { toast } from "react-toastify"
import { useParams } from "react-router-dom";
import LoadingButton from "../../../components/ui/LoadingButton";

import { useDeleteTransitGatewayPeeringAttachment } from "../../../hooks/useTransitGatewayPeeringAttachment";


export default function TransitGatewayPeeringAttachmentDeleteForm({ closeDialog, transitGatewayPeeringAttachmentId }: { closeDialog: () => void, transitGatewayPeeringAttachmentId: string }) {

    const { regionId } = useParams()

    const clientQuery = useQueryClient()

    const { deleteTransitGatewayPeeringAttachmentMutation } = useDeleteTransitGatewayPeeringAttachment()

    const formik = useFormik({
        initialValues: {},
        onSubmit: (_, { setSubmitting }) => {
            async function handleSubmit() {
                try {
                    await deleteTransitGatewayPeeringAttachmentMutation.mutateAsync({ region_id: regionId!, transit_gateway_peering_attachment_id: transitGatewayPeeringAttachmentId })
                    toast.success("Sending delete transit gateway peering attachment request")
                } catch (err: any) {
                    toast.error(`Sending delete request transit gateway peering attachment fail: ${err.response.data.detail}`)
                } finally {
                    setSubmitting(false)
                    closeDialog()
                    clientQuery.invalidateQueries({ queryKey: ["transit-gateway-peering-attachments"] })
                }
            }

            handleSubmit()
        }
    })

    return <form onSubmit={(event) => {
        event.preventDefault()
        formik.handleSubmit()
    }}>
        <Box display="flex" flexDirection="column" gap={2}>
            <div>
                <Typography>Transit gateway Peering Attachment <Typography fontWeight="bold" display="inline" color="error">{transitGatewayPeeringAttachmentId}</Typography> is about to be deleted</Typography>
                <Typography mt={1}>This action is <Typography fontWeight="bold" display="inline" color="error">irreversible. </Typography>   Are you sure? </Typography>
            </div>

            <Box alignSelf="end" display="flex">
                <Button variant="text" size="medium" color="inherit" onClick={() => closeDialog()}>Cancel</Button>

                <LoadingButton
                    color="error"
                    size="medium"
                    variant="text"
                    disabled={formik.isSubmitting}
                    type="submit"
                    loading={formik.isSubmitting}
                    iconColor="error"
                >
                    Delete
                </LoadingButton>
            </Box>
        </Box >
    </form >
}