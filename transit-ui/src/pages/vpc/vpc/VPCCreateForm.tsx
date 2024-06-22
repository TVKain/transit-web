import { Box, Button, Link, TextField, Typography } from "@mui/material";

import * as yup from "yup";
import { useFormik } from "formik";
import { useCreateSubnet } from "../../../hooks/useSubnet";


import { toast } from "react-toastify"

import { useQueryClient } from "react-query";

import LoadingButton from "../../../components/ui/LoadingButton";
import { useParams } from "react-router";
import { useCreateVPC } from "../../../hooks/useVPC";
import { useLocalStorage } from "@uidotdev/usehooks";

const validationSchema = yup.object({
    name: yup.string()
        .required("Name is required"),
    cidr: yup.string()
        .required("CIDR is required")
});


export default function VPCCreateForm({ closeDialog }: { closeDialog: () => void }) {
    const { regionId } = useParams()

    const [userId] = useLocalStorage<string | null>("user_id", null)

    const { createVPCMutation } = useCreateVPC()

    const clientQuery = useQueryClient()

    const formik = useFormik({
        initialValues: {
            name: '',
            cidr: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting, setFieldError, resetForm }) => {
            async function handleSubmit() {
                try {
                    await createVPCMutation.mutateAsync({ region_id: regionId!, cidr: values.cidr, name: values.name, user_id: userId! })
                    resetForm()
                    clientQuery.invalidateQueries({ queryKey: ["vpcs"] })
                    clientQuery.invalidateQueries({ queryKey: ["regions"] })
                    toast.success("Create VPC success")
                    closeDialog()
                } catch (error: any) {
                    setFieldError("name", error.response.data.detail)
                    setFieldError("cidr", error.response.data.detail)
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
                <TextField
                    placeholder="10.0.0.0/8"
                    margin="dense"
                    label="CIDR block"
                    size="small"
                    fullWidth
                    disabled={formik.isSubmitting}
                    id="cidr"
                    name="cidr"
                    value={formik.values.cidr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cidr && Boolean(formik.errors.cidr)}
                    helperText={formik.touched.cidr && formik.errors.cidr}
                />
                <Typography variant="body2">
                    CIDR block must be in the private address space as specified in {" "}
                    <Link rel="noopener noreferrer" target="_blank" href="https://datatracker.ietf.org/doc/html/rfc1918">
                        RFC1918
                    </Link>
                </Typography>
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
