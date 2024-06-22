import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";


import { useFormik } from "formik";



import { toast } from "react-toastify"

import { useQueryClient } from "react-query";

import * as yup from "yup";

import LoadingButton from "../../../components/ui/LoadingButton";
import { useParams } from "react-router";
import { useCreateTransitGatewayVPCRoute } from "../../../hooks/useTransitGatewayRoute";
import { useGetTransitGatewayVPCAttachmentByTransitGatewayId } from "../../../hooks/useTransitGatewayVPCAttachment";

import Loading from "../../info/Loading";


const validationSchema = yup.object({
    destination: yup.string()
        .required("Destination is required"),
    vpcAttachmentId: yup.string()
        .required("Transit Gateway VPC Attachment ID is required"),

});




export default function TransitGatewayRouteTableVPCCreateForm({ closeDialog }: { closeDialog: () => void }) {
    const { regionId } = useParams()

    const { transitGatewayId } = useParams()

    const clientQuery = useQueryClient()


    const { createTransitGatewayVPCRoute } = useCreateTransitGatewayVPCRoute()


    const { transitGatewayVPCAttachments, isLoading: isLoadingTransitGatewayVPCAttachments } =
        useGetTransitGatewayVPCAttachmentByTransitGatewayId(regionId!, transitGatewayId!)

    const formik = useFormik({
        initialValues: {
            destination: '',
            vpcAttachmentId: isLoadingTransitGatewayVPCAttachments ? "" :
                transitGatewayVPCAttachments!.length === 0 ? "" : transitGatewayVPCAttachments![0].id,
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            async function handleSubmit() {
                try {
                    await createTransitGatewayVPCRoute.mutateAsync({
                        region_id: regionId!,
                        destination_cidr: values.destination,
                        vpc_attachment_id: values.vpcAttachmentId,
                    })
                    clientQuery.invalidateQueries({ queryKey: ['transit-gateway-routes'] })
                    toast.success("Sending request to create Transit Gateway VPC Route")
                    closeDialog()
                } catch (error: any) {
                    toast.error(error?.response?.data?.detail || "An error occurred")
                } finally {
                    setSubmitting(false)
                }
            }

            handleSubmit()
        },
    });





    if (isLoadingTransitGatewayVPCAttachments) {
        return <Loading />
    }

    return <form onSubmit={(event) => { event.preventDefault(); formik.handleSubmit() }}>
        <Box display="flex" flexDirection="column" gap={2}>

            <div>
                <TextField

                    margin="dense"
                    label="Destination"
                    size="small"
                    fullWidth
                    disabled={formik.isSubmitting}
                    id="destination"
                    name="destination"
                    value={formik.values.destination}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.destination && Boolean(formik.errors.destination)}
                    helperText={formik.touched.destination && formik.errors.destination}
                />

            </div>

            <FormControl size="small">
                <InputLabel id="transit-gateway-vpc-attachment-label">{transitGatewayVPCAttachments!.length === 0 ? "No Transit Gateway VPC Attachment for this Transit Gateway" : "Transit Gateway VPC Attachment Id"}</InputLabel>
                <Select
                    labelId="transit-gateway-vpc-attachment-label"
                    label="Transit Gateway VPC Attachment Id"
                    size="small"
                    fullWidth
                    disabled={transitGatewayVPCAttachments!.length === 0}
                    value={formik.values.vpcAttachmentId}
                    onChange={(event) => {
                        formik.setFieldValue("vpcAttachmentId", event.target.value)
                    }}
                >
                    {transitGatewayVPCAttachments!.map((transitGatewayVPCAttachment) => {
                        return <MenuItem key={transitGatewayVPCAttachment.id} value={transitGatewayVPCAttachment.id}>
                            {transitGatewayVPCAttachment.id}
                        </MenuItem>
                    })}
                </Select>

            </FormControl>

            <Box alignSelf="end" display="flex">
                <Button variant="text" size="medium" color="inherit" onClick={() => closeDialog()}>Cancel</Button>

                <LoadingButton size="medium" variant="text" disabled={formik.isSubmitting || transitGatewayVPCAttachments!.length === 0} type="submit" loading={formik.isSubmitting}>
                    Submit
                </LoadingButton>
            </Box>

        </Box>
    </form >
}
