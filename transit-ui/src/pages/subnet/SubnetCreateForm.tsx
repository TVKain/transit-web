import { Box, Button, Link, TextField, Typography } from "@mui/material";

import * as yup from "yup";
import { useFormik } from "formik";
import { useCreateSubnet } from "../../hooks/useSubnet";


import { toast } from "react-toastify"

import { useQueryClient } from "react-query";

import LoadingButton from "../../components/ui/LoadingButton";
import { useParams } from "react-router";

const validationSchema = yup.object({
    network_address: yup.string()
        .required("Network address is required"),
});


export default function SubnetCreateForm({ closeDialog }: { closeDialog: () => void }) {
    const { vpcId } = useParams()

    const { createSubnetMutation } = useCreateSubnet()

    const clientQuery = useQueryClient()

    const formik = useFormik({
        initialValues: {
            network_address: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, setFieldError, resetForm }) => {
            async function handleSubmit() {
                try {
                    await createSubnetMutation.mutateAsync({ vpc_id: vpcId!, network_address: values.network_address })
                    resetForm()
                    clientQuery.invalidateQueries({ queryKey: ["subnets"] })
                    toast.success("Create subnet success")
                    closeDialog()
                } catch (error: any) {
                    setFieldError('network_address', error.response.data.detail)
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
                    placeholder="10.0.0.0/24"
                    margin="dense"
                    label="Network address"
                    size="small"
                    fullWidth
                    disabled={formik.isSubmitting}
                    id="network_address"
                    name="network_address"
                    value={formik.values.network_address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.network_address && Boolean(formik.errors.network_address)}
                    helperText={formik.touched.network_address && formik.errors.network_address}
                />
                <Typography variant="body2">
                    Network address must be in the CIDR block that the subnet belongs to
                </Typography>
                <Typography variant="body2">Network address can not overlap with existing subnets</Typography>
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
