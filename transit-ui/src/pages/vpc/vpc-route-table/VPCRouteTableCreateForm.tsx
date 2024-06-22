import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";


import { useFormik } from "formik";



import { toast } from "react-toastify"

import { useQueryClient } from "react-query";

import LoadingButton from "../../../components/ui/LoadingButton";
import { useParams } from "react-router";

import * as yup from "yup";
import { useCreateVPCTransitGatewayRoute } from "../../../hooks/useVPCTransitGatewayRoute";
import { useGetTransitGatewayVPCAttachmentByVPCId } from "../../../hooks/useTransitGatewayVPCAttachment";
import Loading from "../../info/Loading";

const validationSchema = yup.object({
    destination: yup.string()
        .required("Destination is required"),
    transitGatewayVPCAttachmentId: yup.string()
        .required("Transit Gateway VPC Attachment ID is required"),

});



export default function VPCRouteTableCreateForm({ closeDialog }: { closeDialog: () => void }) {
    const { regionId } = useParams()

    const { vpcId } = useParams()

    const clientQuery = useQueryClient()

    const { createCreateVPCTransitGatewayRoute } = useCreateVPCTransitGatewayRoute()

    const { transitGatewayVPCAttachments, isLoading } = useGetTransitGatewayVPCAttachmentByVPCId(regionId!, vpcId!)

    const formik = useFormik({
        initialValues: {
            destination: '',
            transitGatewayVPCAttachmentId: isLoading ? "" : transitGatewayVPCAttachments!.length !== 0 ? transitGatewayVPCAttachments![0].id : "",
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            async function handleSubmit() {
                try {

                    await createCreateVPCTransitGatewayRoute.mutateAsync({
                        region_id: regionId!,
                        vpc_id: vpcId!,
                        destination_cidr: values.destination,
                        transit_gateway_vpc_attachment_id: values.transitGatewayVPCAttachmentId!
                    })

                    clientQuery.invalidateQueries({ queryKey: ['vpc-transit-gateway-routes'] })
                    toast.success("Sending request to create route for VPC")
                    closeDialog()
                } catch (error: any) {
                    toast.error(`Create route fail ${error.response.data.detail}`)
                } finally {
                    setSubmitting(false)
                }
            }

            handleSubmit()
        },
    });

    if (isLoading)
        return <Loading />


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
                <InputLabel id="transit-gateway-label">{transitGatewayVPCAttachments!.length !== 0 ? "Transit Gateway VPC Attachment ID" : "No Transit Gateway VPC Attachment"}</InputLabel>
                <Select
                    labelId="transit-gateway-label"
                    label={transitGatewayVPCAttachments!.length !== 0 ? "Transit Gateway VPC Attachment ID" : "No Transit Gateway VPC Attachment"}
                    size="small"
                    fullWidth
                    disabled={transitGatewayVPCAttachments!.length === 0}
                    value={formik.values.transitGatewayVPCAttachmentId}>
                    {transitGatewayVPCAttachments!.map((attachment) => {
                        return <MenuItem key={attachment.id} value={attachment.id}>
                            {attachment.id}
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
