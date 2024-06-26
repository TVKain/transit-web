
import { useParams } from "react-router-dom";


import { DataGrid, GridColDef } from "@mui/x-data-grid";

import EmptyPlaceholder from "../../../components/ui/EmptyPlaceholder";
import { Delete, Route } from "@mui/icons-material";

import { Typography, useTheme } from "@mui/material";

import { useGetVPCTransitGatewayRoute } from "../../../hooks/useVPCTransitGatewayRoute";

import GenericMenu from "../../../components/ui/GenericMenu";
import { useState } from "react";
import { VPCTransitGatewayRoute } from "../../../types/Transit";
import VPCRouteTableDeleteForm from "./VPCRouteTableDeleteForm";
import { useDialog } from "../../../context/DialogContext";

export default function TransitGatewayVPCAttachmentGrid() {

    const { regionId } = useParams()

    const { vpcId } = useParams()

    const theme = useTheme()

    const { vpcTransitGatewayRoutes, isLoading, isFetching } = useGetVPCTransitGatewayRoute(regionId!, vpcId!)

    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)

    const { DialogComponent, openDialog, closeDialog } = useDialog()

    const columns: GridColDef<VPCTransitGatewayRoute>[] = [
        { field: 'id', headerName: 'ID', flex: 0.2 },
        {
            field: 'destination',
            headerName: 'Destination',
            flex: 0.1
        },
        {
            field: 'target',
            headerName: 'Target',
            flex: 0.3
        },

        {
            field: 'status',
            headerName: 'Status',

            flex: 0.1,
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
                                    openDialog('delete-vpc-route')

                                },
                                icon: <Delete />,
                                color: theme.palette.error.main
                            }
                        ]
                    }
                />

            ),
            renderHeader: (_) => <Typography fontWeight="bold">Actions</Typography>,
            flex: 0.1
        }

    ];

    return <>

        <DialogComponent dialogId="delete-vpc-route" title="Delete VPC Route" dividers={true}>
            <VPCRouteTableDeleteForm closeDialog={closeDialog} vpcRouteId={selectedRouteId!} />
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
            rows={(isLoading || isFetching) ? [] : vpcTransitGatewayRoutes!}
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
                noRowsOverlay: () => <EmptyPlaceholder Icon={<Route fontSize="large" />} message="You don't have any VPC Routes" subMessage="Start creating one now" />
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnResize={true}
        />
    </>
}