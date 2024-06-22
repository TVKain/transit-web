import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";


import { useFormik } from "formik";



import { toast } from "react-toastify"

import { useQueryClient } from "react-query";

import LoadingButton from "../../../components/ui/LoadingButton";
import { useParams } from "react-router";


import { useCreateTransitGatewayVPCAttachment, } from "../../../hooks/useTransitGatewayVPCAttachment";
import Loading from "../../info/Loading";
import { useGetVPC } from "../../../hooks/useVPC";
import { useGetActiveTransitGateway } from "../../../hooks/useTransitGateway";
import { useLocalStorage } from "@uidotdev/usehooks";




export default function TransitGatewayVPCAttachmentCreateForm({ closeDialog }: { closeDialog: () => void }) {
    const { regionId } = useParams()

    const [userId] = useLocalStorage<string | null>("user_id", null)

    const clientQuery = useQueryClient()

    const { vpcs, isLoading: isLoadingVPCs } = useGetVPC(userId!, regionId!)

    const { transitGateways, isLoading: isLoadingTransitGateways } = useGetActiveTransitGateway(regionId!)


    const { createTransitGatewayVPCAttachment } = useCreateTransitGatewayVPCAttachment()

    const formik = useFormik({
        initialValues: {
            vpc_id: isLoadingVPCs ? "" : vpcs?.length === 0 ? "" : vpcs![0].id,
            transit_gateway_id: isLoadingTransitGateways ? "" : transitGateways?.length === 0 ? "" : transitGateways![0].id,
        },
        onSubmit: (values, { setSubmitting }) => {
            async function handleSubmit() {
                try {

                    const vpc_info = vpcs?.find(vpc => vpc.id === values.vpc_id)

                    const arg = {
                        region_id: regionId!,
                        vpc_id: values.vpc_id,
                        transit_gateway_id: values.transit_gateway_id,
                        vpc_router_id: vpc_info?.router_id!,
                        vpc_cidr: vpc_info?.cidr!
                    }

                    console.log(arg)

                    await createTransitGatewayVPCAttachment.mutateAsync(arg)

                    clientQuery.invalidateQueries({ queryKey: ['transit-gateway-vpc-attachments'] })
                    toast.success("Sending request to create Transit gateway VPC attachmetn")
                    closeDialog()
                } catch (error: any) {
                    toast.error(`Create route Transit gateway VPC attachment ${error.response.data.detail}`)
                } finally {
                    setSubmitting(false)
                }
            }

            handleSubmit()
        },
    });

    if (isLoadingTransitGateways || isLoadingVPCs)
        return <Loading />


    return <form onSubmit={(event) => { event.preventDefault(); formik.handleSubmit() }}>
        <Box display="flex" flexDirection="column" gap={2} marginTop={2}>

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


            <FormControl fullWidth size="small">
                <InputLabel id="vpc-label">VPC</InputLabel>
                <Select labelId="vpc-label" label="VPC" size="small" fullWidth disabled={vpcs!.length === 0} value={formik.values.vpc_id} onChange={(event) => {
                    formik.setFieldValue("vpc_id", event.target.value)
                }}>
                    {vpcs!.map((attachment) => {
                        return <MenuItem key={attachment.id} value={attachment.id}>
                            {attachment.id} - {`[${attachment.name}]`}
                        </MenuItem>
                    })}
                </Select>
            </FormControl>


            <Box alignSelf="end" display="flex">
                <Button variant="text" size="medium" color="inherit" onClick={() => closeDialog()}>Cancel</Button>

                <LoadingButton size="medium" variant="text" disabled={formik.isSubmitting || vpcs!.length === 0 || transitGateways!.length === 0} type="submit" loading={formik.isSubmitting}>
                    Submit
                </LoadingButton>
            </Box>

        </Box>
    </form >
}
