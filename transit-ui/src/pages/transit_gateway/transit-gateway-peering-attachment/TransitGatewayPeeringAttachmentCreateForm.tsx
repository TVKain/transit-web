import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";


import { useFormik } from "formik";



import { toast } from "react-toastify"

import { useQueryClient } from "react-query";

import LoadingButton from "../../../components/ui/LoadingButton";
import { useParams } from "react-router";

import * as yup from "yup";

import { useCreateTransitGatewayVPCAttachment, } from "../../../hooks/useTransitGatewayVPCAttachment";
import Loading from "../../info/Loading";

import { useGetActiveTransitGateway } from "../../../hooks/useTransitGateway";
import { useCreateTransitGatewayPeeringAttachment } from "../../../hooks/useTransitGatewayPeeringAttachment";


const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    transit_gateway_id: yup.string().required("Transit gateway is required"),
    remote_region_id: yup.string().required("Remote region is required"),
    remote_transit_gateway_id: yup.string().required("Remote transit gateway is required"),
})


export default function TransitGatewayPeeringAttachmentCreateForm({ closeDialog }: { closeDialog: () => void }) {
    const { regionId } = useParams()

    const clientQuery = useQueryClient()


    const { transitGateways, isLoading: isLoadingTransitGateways } = useGetActiveTransitGateway(regionId!)

    const { createTransitGatewayPeeringAttachmentMutation } = useCreateTransitGatewayPeeringAttachment()


    const formik = useFormik({
        initialValues: {
            name: "",
            transit_gateway_id: isLoadingTransitGateways ? "" : transitGateways?.length === 0 ? "" : transitGateways![0].id,
            remote_region_id: "",
            remote_transit_gateway_id: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            async function handleSubmit() {
                try {


                    await createTransitGatewayPeeringAttachmentMutation.mutateAsync({
                        name: values.name,
                        transit_gateway_id: values.transit_gateway_id,
                        region_id: regionId!,
                        remote_region_id: values.remote_region_id,
                        remote_transit_gateway_id: values.remote_transit_gateway_id
                    })

                    clientQuery.invalidateQueries({ queryKey: ['transit-gateway-peering-attachments'] })
                    toast.success("Sending request to create Transit gateway Peering attachment")
                    closeDialog()
                } catch (error: any) {
                    toast.error(`${error.response.data.detail}`)
                } finally {
                    setSubmitting(false)
                }
            }

            handleSubmit()
        },
    });

    if (isLoadingTransitGateways)
        return <Loading />


    return <form onSubmit={(event) => { event.preventDefault(); formik.handleSubmit() }}>
        <Box display="flex" flexDirection="column" gap={2} marginTop={2}>

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

            <FormControl fullWidth size="small">
                <InputLabel id="transit-gateway-label">Transit gateway</InputLabel>
                <Select
                    labelId="transit-gateway-label"
                    label="Transit gateway"
                    size="small"
                    fullWidth
                    disabled={transitGateways!.length === 0}
                    value={formik.values.transit_gateway_id}
                    onChange={(event) => {
                        formik.setFieldValue("transit_gateway_id", event.target.value)
                    }}
                >
                    {transitGateways!.map((transitGateway) => {
                        return <MenuItem key={transitGateway.id} value={transitGateway.id}>
                            {transitGateway.id} - {`[${transitGateway.name ? transitGateway.name : "<Empty-name>"}]`}
                        </MenuItem>
                    })}
                </Select>

            </FormControl>

            <TextField

                margin="dense"
                label="Remote region ID"
                size="small"
                fullWidth
                disabled={formik.isSubmitting}
                id="remote_region_id"
                name="remote_region_id"
                value={formik.values.remote_region_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.remote_region_id && Boolean(formik.errors.remote_region_id)}
                helperText={formik.touched.remote_region_id && formik.errors.remote_region_id}
            />


            <TextField

                margin="dense"
                label="Remote transit gateway ID"
                size="small"
                fullWidth
                disabled={formik.isSubmitting}
                id="remote_transit_gateway_id"
                name="remote_transit_gateway_id"
                value={formik.values.remote_transit_gateway_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.remote_transit_gateway_id && Boolean(formik.errors.remote_transit_gateway_id)}
                helperText={formik.touched.remote_transit_gateway_id && formik.errors.remote_transit_gateway_id}
            />




            <Box alignSelf="end" display="flex">
                <Button variant="text" size="medium" color="inherit" onClick={() => closeDialog()}>Cancel</Button>

                <LoadingButton size="medium" variant="text" disabled={formik.isSubmitting || transitGateways!.length === 0} type="submit" loading={formik.isSubmitting}>
                    Submit
                </LoadingButton>
            </Box>

        </Box>
    </form >
}
