import { Box, Button, Typography } from "@mui/material";
import LoadingButton from "../../../components/ui/LoadingButton";
import { useFormik } from "formik";

import { useQueryClient } from "react-query";

import { toast } from "react-toastify"


import { useParams } from "react-router-dom";

import { useDeleteTransitGatewayPeeringRoute } from "../../../hooks/useTransitGatewayRoute";


export default function TransitGatewayRouteTablePeeringDeleteForm({ closeDialog, peeringRouteId }: { closeDialog: () => void, peeringRouteId: string }) {

    const { regionId } = useParams()

    const { deleteTransitGatewayPeeringRoute } = useDeleteTransitGatewayPeeringRoute()

    const clientQuery = useQueryClient()

    const formik = useFormik({
        initialValues: {},
        onSubmit: (_, { setSubmitting }) => {
            async function handleSubmit() {
                try {
                    await deleteTransitGatewayPeeringRoute.mutateAsync({ region_id: regionId!, route_id: peeringRouteId })

                    toast.success("Sending request to delete route")
                } catch (err) {
                    toast.error("Delete route fail")
                } finally {
                    closeDialog()
                    setSubmitting(false)
                    clientQuery.invalidateQueries({ queryKey: ["transit-gateway-routes"] })
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
                    <Typography>Peering Route <Typography fontWeight="bold" component={'span'} color="error">{peeringRouteId}</Typography> is about to be deleted</Typography>
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