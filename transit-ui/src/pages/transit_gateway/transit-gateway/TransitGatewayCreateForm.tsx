import { Box, Button, TextField } from "@mui/material";


import { useFormik } from "formik";



import { toast } from "react-toastify"

import { useQueryClient } from "react-query";

import LoadingButton from "../../../components/ui/LoadingButton";
import { useParams } from "react-router";


import { useCreateTransitGateway } from "../../../hooks/useTransitGateway";



export default function TransitGatewayCreateForm({ closeDialog }: { closeDialog: () => void }) {
    const { regionId } = useParams()

    const clientQuery = useQueryClient()

    const { createTransitGatewayMutation } = useCreateTransitGateway()
    const formik = useFormik({
        initialValues: {
            name: '',

        },
        onSubmit: (values, { setSubmitting }) => {
            async function handleSubmit() {
                try {
                    await createTransitGatewayMutation.mutateAsync({ region_id: regionId!, name: values.name })
                    clientQuery.invalidateQueries({ queryKey: ['transit-gateways'] })
                    toast.success("Sending request to create Transit Gateway")
                    closeDialog()
                } catch (error: any) {

                } finally {
                    setSubmitting(false)
                }
            }

            handleSubmit()
        },
    });

    return <form onSubmit={(event) => { event.preventDefault(); formik.handleSubmit() }}>
        <Box display="flex" flexDirection="column" gap={2}>

            <div>
                <TextField

                    margin="dense"
                    label="Name"
                    size="small"
                    fullWidth
                    disabled={formik.isSubmitting}
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />

            </div>

            <Box alignSelf="end" display="flex">
                <Button variant="text" size="medium" color="inherit" onClick={() => closeDialog()}>Cancel</Button>

                <LoadingButton size="medium" variant="text" disabled={formik.isSubmitting} type="submit" loading={formik.isSubmitting}>
                    Submit
                </LoadingButton>
            </Box>

        </Box>
    </form >
}
