import { Box, Button, Typography } from "@mui/material";
import LoadingButton from "../../../components/ui/LoadingButton";
import { useFormik } from "formik";

import { useQueryClient } from "react-query";

import { toast } from "react-toastify"


import { useParams } from "react-router-dom";
import { useDeleteVPCTransitGatewayRoute } from "../../../hooks/useVPCTransitGatewayRoute";


export default function VPCRouteTableDeleteForm({ closeDialog, vpcRouteId }: { closeDialog: () => void, vpcRouteId: string }) {

    const { regionId } = useParams()

    const { deleteVPCTransitGatewayRoute } = useDeleteVPCTransitGatewayRoute()

    const clientQuery = useQueryClient()

    const formik = useFormik({
        initialValues: {},
        onSubmit: (_, { setSubmitting }) => {
            async function handleSubmit() {
                try {
                    await toast.promise(deleteVPCTransitGatewayRoute.mutateAsync({ region_id: regionId!, routeId: vpcRouteId }), {
                        pending: "Deleting route",
                        success: "Sent request to delete route",
                        error: "Delete route fail"
                    })
                } catch (err) {

                } finally {
                    closeDialog()
                    setSubmitting(false)
                    clientQuery.invalidateQueries({ queryKey: ["vpc-transit-gateway-routes"] })
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
                    <Typography>VPC Route <Typography fontWeight="bold" component={'span'} color="error">{vpcRouteId}</Typography> is about to be deleted</Typography>
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