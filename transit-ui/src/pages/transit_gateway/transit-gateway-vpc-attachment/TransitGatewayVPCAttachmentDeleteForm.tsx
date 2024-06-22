import { Box, Button, Typography } from "@mui/material";

import { useFormik } from "formik";


import { useQueryClient } from "react-query";



import { toast } from "react-toastify"
import { useParams } from "react-router-dom";
import LoadingButton from "../../../components/ui/LoadingButton";
import { useDeleteTransitGateway } from "../../../hooks/useTransitGateway";
import { useDeleteTransitGatewayVPCAttachment } from "../../../hooks/useTransitGatewayVPCAttachment";


export default function TransitGatewayDeleteForm({ closeDialog, transitGatewayVPCAttachmentId }: { closeDialog: () => void, transitGatewayVPCAttachmentId: string }) {



    const { regionId } = useParams()

    const clientQuery = useQueryClient()

    const { deleteTransitGatewayVPCAttachment } = useDeleteTransitGatewayVPCAttachment()

    const formik = useFormik({
        initialValues: {},
        onSubmit: (_, { setSubmitting }) => {
            async function handleSubmit() {
                try {
                    await deleteTransitGatewayVPCAttachment.mutateAsync({ region_id: regionId!, attachmentId: transitGatewayVPCAttachmentId })
                    toast.success("Sending delete transit gateway vpc attachment request")
                } catch (err: any) {
                    toast.error(`Sending delete request transit gateway vpc attachment fail: ${err.response.data.detail}`)
                } finally {
                    setSubmitting(false)
                    closeDialog()
                    clientQuery.invalidateQueries({ queryKey: ["transit-gateway-vpc-attachments"] })
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
                <Typography>Transit gateway <Typography fontWeight="bold" display="inline" color="error">{transitGatewayVPCAttachmentId}</Typography> is about to be deleted</Typography>
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