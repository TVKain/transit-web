import { Box, Button, Typography } from "@mui/material";
import LoadingButton from "../../components/ui/LoadingButton";
import { useFormik } from "formik";


import { useQueryClient } from "react-query";

import { useDeleteSubnet } from "../../hooks/useSubnet";

import { toast } from "react-toastify"
import { useParams } from "react-router-dom";


export default function SubnetDeleteForm({ closeDialog, subnetId }: { closeDialog: () => void, subnetId: string }) {
    const { vpcId } = useParams()

    const { deleteSubnetMutation } = useDeleteSubnet()

    const clientQuery = useQueryClient()

    const formik = useFormik({
        initialValues: {},
        onSubmit: (_, { setSubmitting }) => {
            async function handleSubmit() {
                try {
                    await deleteSubnetMutation.mutateAsync({ subnet_id: subnetId, vpc_id: vpcId! })
                    toast.success("Delete subnet success")
                } catch (err: any) {
                    toast.error(`Delete subnet fail ${err.response.data.detail}`)
                } finally {
                    setSubmitting(false)
                    closeDialog()
                    clientQuery.invalidateQueries({ queryKey: ["subnets"] })
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
                <Typography>Subnet <Typography fontWeight="bold" display="inline" color="error">{subnetId}</Typography> is about to be deleted</Typography>
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