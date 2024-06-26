import { Box, Button, Typography } from "@mui/material";

import { useDialog } from "../../../context/DialogContext";
import Error from "../../info/Error";
import { useParams } from "react-router-dom";
import TransitGatewayRouteTableGrid from "./TransitGatewayRouteTableGrid";

import TransitGatewayRouteTableVPCCreateForm from "./TransitGatewayRouteTableVPCCreateForm";
import TransitGatewayRouteTablePeeringCreateForm from "./TransitGatewayRouteTablePeeringCreateForm";



export default function TransitGateway() {

    const { DialogComponent, openDialog, closeDialog } = useDialog()

    const { transitGatewayId } = useParams()

    if (!transitGatewayId) {
        return <Error errorMessage="Invalid transit gateway ID" />
    }

    return <Box width="100%" height="100%" display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <div>

                <Typography variant="h5" fontWeight="bold">
                    Transit Gateway Route Table - <Typography fontWeight="bold" fontSize={21} component="span" color="primary">{transitGatewayId}</Typography>
                </Typography>
                <Typography variant="body1" color={"gray"}>
                    Manage your Transit Gateway Route Table
                </Typography>

            </div>

            <Box display="flex" gap={2}>

                <Button
                    size="small" variant="outlined"
                    disableRipple

                    onClick={() => {
                        openDialog("create-transit-gateway-vpc-route")
                    }}
                >
                    Add a VPC route
                </Button>

                <Button
                    size="small" variant="outlined"
                    disableRipple

                    onClick={() => {
                        openDialog("create-transit-gateway-peering-route")
                    }}
                >
                    Add a Peering route
                </Button>
            </Box>

        </Box>

        <TransitGatewayRouteTableGrid />

        <DialogComponent dialogId="create-transit-gateway-vpc-route" title="Create Transit Gateway VPC Route" contextText="Create Transit Gateway VPC Route" dividers={true}>
            <TransitGatewayRouteTableVPCCreateForm closeDialog={closeDialog} />
        </DialogComponent>


        <DialogComponent dialogId="create-transit-gateway-peering-route" title="Create Transit Gateway Peering Route" contextText="Create Transit Gateway Peering Route" dividers={true}>
            <TransitGatewayRouteTablePeeringCreateForm closeDialog={closeDialog} />
        </DialogComponent>
    </Box >
}