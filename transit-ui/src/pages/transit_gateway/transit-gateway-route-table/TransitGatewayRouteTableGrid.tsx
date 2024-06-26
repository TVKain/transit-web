
import { useParams } from "react-router-dom";


import { DataGrid, GridColDef } from "@mui/x-data-grid";

import EmptyPlaceholder from "../../../components/ui/EmptyPlaceholder";
import { AltRoute, Delete } from "@mui/icons-material";

import { Typography, useTheme } from "@mui/material";
import { TransitGatewayRoute, } from "../../../types/Transit";

import GenericMenu from "../../../components/ui/GenericMenu";
import { useGetTransitGatewayRoute } from "../../../hooks/useTransitGatewayRoute";
import { useDialog } from "../../../context/DialogContext";
import { useState } from "react";
import TransitGatewayRouteTableDeleteForm from "./TransitGatewayRouteTableVPCDeleteForm";
import TransitGatewayRouteTablePeeringDeleteForm from "./TransitGatewayRouteTablePeeringDeleteForm";

export default function TransitGatewayRouteTableGrid() {

    const { regionId } = useParams()

    const { transitGatewayId } = useParams()

    const theme = useTheme()

    const { DialogComponent, openDialog, closeDialog } = useDialog()

    const { transitGatewayRoutes, isLoading, isFetching } = useGetTransitGatewayRoute(regionId!, transitGatewayId!)

    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)

    const columns: GridColDef<TransitGatewayRoute>[] = [
        { field: 'id', headerName: 'ID', flex: 0.26 },
        {
            field: 'type',
            headerName: 'Type',
            flex: 0.05
        },
        {
            field: 'destination',
            headerName: 'Destination',
            flex: 0.1
        },
        {
            field: 'target',
            headerName: 'Target',
            flex: 0.26
        },
        {
            field: 'status',
            headerName: 'Status',

            flex: 0.06,
            cellClassName: (params) => {
                switch (params.value) {
                    case "ACTIVE": case "READY":
                        return 'status-active';
                    case "PENDING":
                        return 'status-build';
                    case "ERROR": case "DELETING":
                        return 'status-error';
                    default:
                        return '';
                }
            },
        },
        {
            field: 'actions',
            type: 'actions',
            renderCell: (values) => (
                <GenericMenu
                    menuWidth={200}
                    menuItems={
                        [
                            {
                                label: "Delete",
                                onClick: () => {
                                    setSelectedRouteId(values.row.id)

                                    if (values.row.type === "VPC")
                                        openDialog('delete-transit-gateway-vpc-route')
                                    else if (values.row.type === "PEERING")
                                        openDialog('delete-transit-gateway-peering-route')
                                },
                                icon: <Delete />,
                                color: theme.palette.error.main
                            }
                        ]
                    }
                />

            ),
            renderHeader: (_) => <Typography fontWeight="bold">Actions</Typography>,
            flex: 0.08
        }



    ];

    return <>

        <DialogComponent dialogId="delete-transit-gateway-vpc-route" title="Delete Transit Gateway VPC Route" contextText="Delete Transit Gateway VPC Route" dividers={true}>
            <TransitGatewayRouteTableDeleteForm closeDialog={closeDialog} vpcRouteId={selectedRouteId!} />
        </DialogComponent>

        <DialogComponent dialogId="delete-transit-gateway-peering-route" title="Delete Transit Gateway Peering Route" contextText="Delete Transit Gateway Peering Route" dividers={true}>
            <TransitGatewayRouteTablePeeringDeleteForm closeDialog={closeDialog} peeringRouteId={selectedRouteId!} />
        </DialogComponent>


        <DataGrid
            sx={{
                '& .status-active': {
                    color: theme.palette.primary.main
                },
                '& .status-build': {
                    color: 'orange'
                },
                '& .status-error': {
                    color: theme.palette.error.main
                },
                '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                },

                '& .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold'
                }
            }}
            rows={(isLoading || isFetching) ? [] : transitGatewayRoutes!}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                },
            }}
            loading={isLoading || isFetching}
            slots={{
                noRowsOverlay: () => <EmptyPlaceholder Icon={<AltRoute fontSize="large" />} message="You don't have any Transit Gateway Routes" subMessage="Start creating one now" />
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnResize={true}
        />
    </>
}