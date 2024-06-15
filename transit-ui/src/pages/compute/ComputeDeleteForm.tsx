import { Box, Button, Typography } from "@mui/material";
import LoadingButton from "../../components/ui/LoadingButton";
import { useFormik } from "formik";

import { useQueryClient } from "react-query";

import { toast } from "react-toastify"

import { useDeleteCompute } from "../../hooks/useCompute";
import { useParams } from "react-router-dom";


export default function ComputeDeleteForm({ closeDialog, computeId }: { closeDialog: () => void, computeId: string }) {
    const { vpcId } = useParams()

    const { deleteComputeMutation } = useDeleteCompute()

    const clientQuery = useQueryClient()

    const formik = useFormik({
        initialValues: {},
        onSubmit: (_, { setSubmitting }) => {
            async function handleSubmit() {
                try {
                    await toast.promise(deleteComputeMutation.mutateAsync({ compute_id: computeId, vpc_id: vpcId! }), {
                        pending: "Deleting compute",
                        success: "Delete compute success",
                        error: "Delete compute fail"
                    })
                } catch (err) {

                } finally {
                    closeDialog()
                    setSubmitting(false)
                    clientQuery.invalidateQueries({ queryKey: ["computes"] })
                }
            }

            handleSubmit()
        }
    })

    return <>

        <form onSubmit={(event) => {
            event.preventDefault()
            formik.handleSubmit()
        }}>

            <Box display="flex" flexDirection="column" gap={2}>
                <div>
                    <Typography>Compute <Typography fontWeight="bold" component={'span'} color="error">{computeId}</Typography> is about to be deleted</Typography>
                    <Typography mt={1}>This action is <Typography component={'span'} fontWeight="bold" display="inline" color="error">irreversible. </Typography>   Are you sure? </Typography>
                </div>

                <Box alignSelf="end" display="flex">
                    <Button disabled={formik.isSubmitting} variant="text" size="medium" color="inherit" onClick={() => closeDialog()}>Cancel</Button>

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
    </>
}