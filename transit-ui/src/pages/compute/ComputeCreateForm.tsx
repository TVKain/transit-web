import { Box, Button, FormControl, MenuItem, TextField } from "@mui/material";


import * as yup from "yup";
import { useFormik } from "formik";
import { useGetSubnet } from "../../hooks/useSubnet";

import { toast } from "react-toastify"

import { useQueryClient } from "react-query";

import LoadingButton from "../../components/ui/LoadingButton";
import { useCreateCompute } from "../../hooks/useCompute";
import Loading from "../info/Loading";
import Error from "../info/Error";
import { useEffect } from "react";
import { useParams } from "react-router";

const validationSchema = yup.object({
    name: yup.string()
        .required("Name is required"),
    subnet_id: yup.string()
        .required("Subnet is required")
});


export default function ComputeCreateForm({ closeDialog }: { closeDialog: () => void }) {
    const { vpcId } = useParams()

    const { subnets, isLoading, isError } = useGetSubnet(vpcId!)

    const { createComputeMutation } = useCreateCompute()

    const clientQuery = useQueryClient()


    const formik = useFormik({
        initialValues: {
            name: '',
            subnet_id: '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values, { setSubmitting }) => {
            async function handleSubmit() {
                try {
                    closeDialog()
                    await toast.promise(
                        createComputeMutation.mutateAsync({ vpc_id: vpcId!, compute_name: values.name, subnet_id: values.subnet_id }), {
                        pending: 'Building compute...',
                        success: 'Create compute success',
                        error: 'Create compute fail'
                    })

                    clientQuery.invalidateQueries({ queryKey: ["computes"] })

                } catch (error: any) {

                } finally {
                    setSubmitting(false)
                }
            }
            handleSubmit()
        },
    });

    useEffect(() => {
        if (subnets && subnets.length > 0) {
            formik.setValues({ ...formik.values, subnet_id: subnets[0].id });
        }
    }, [subnets]);


    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <Error />
    }


    return <form onSubmit={(event) => { event.preventDefault(); formik.handleSubmit() }}>
        <Box display="flex" flexDirection="column" gap={2}>
            <div>
                <TextField
                    placeholder="Name"
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
            <div>
                <FormControl fullWidth>

                    <TextField
                        size="small"
                        select
                        id="subnet-selector"
                        disabled={formik.isSubmitting || subnets!.length === 0}
                        label={subnets!.length === 0 ? "You don't have any subnets" : "Subnet"}
                        name="subnet_id"
                        value={formik.values.subnet_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.subnet_id && Boolean(formik.errors.subnet_id)}
                    >
                        {
                            subnets!.map(subnet => (
                                <MenuItem key={subnet.id} value={subnet.id}>{subnet.network_address}</MenuItem>
                            ))
                        }
                    </TextField>
                </FormControl>

            </div>

            <Box alignSelf="end" display="flex">
                <Button variant="text" size="medium" color="inherit" onClick={() => closeDialog()}>Cancel</Button>

                <LoadingButton size="medium" variant="text" disabled={formik.isSubmitting || subnets!.length === 0} type="submit" loading={formik.isSubmitting}>
                    Submit
                </LoadingButton>
            </Box>

        </Box>


    </form >
}
