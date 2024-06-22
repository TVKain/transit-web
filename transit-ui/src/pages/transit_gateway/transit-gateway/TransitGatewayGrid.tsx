
import { useNavigate, useParams } from "react-router-dom";


import { DataGrid, GridColDef } from "@mui/x-data-grid";

import EmptyPlaceholder from "../../../components/ui/EmptyPlaceholder";
import { Delete, Router } from "@mui/icons-material";
import { useGetTransitGateway } from "../../../hooks/useTransitGateway";
import { Typography, useTheme } from "@mui/material";
import { TransitGateway } from "../../../types/Transit";
import GenericMenu from "../../../components/ui/GenericMenu";
import React from "react";
import { useDialog } from "../../../context/DialogContext";
import TransitGatewayDeleteForm from "./TransitGatewayDeleteForm";

export default function TransitGatewayGrid() {

    const { regionId } = useParams()

    const theme = useTheme()

    const navigate = useNavigate()

    const { transitGateways, isLoading, isFetching } = useGetTransitGateway(regionId!)

    const [transitGatewayId, setTransitGatewayId] = React.useState<string | null>(null)

    const { DialogComponent, openDialog, closeDialog } = useDialog()

    const columns: GridColDef<TransitGateway>[] = [
        { field: 'id', headerName: 'ID', flex: 0.4 },
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.2
        },
        {
            field: 'status',
            headerName: 'Status',

            flex: 0.2,
            cellClassName: (params) => {
                switch (params.value) {
                    case "ACTIVE":
                        return 'status-active';
                    case "BUILD":
                        return 'status-build';
                    case "ERROR": case "DELETING":
                        return 'status-error';
                    default:
                        return '';
                }
            },
        },
        {
            field: 'created_at',

            headerName: 'Created at',

            flex: 0.2
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
                                label: "Route table",
                                onClick: () => {
                                    navigate(`${values.row.id}/route-table`)
                                },
                                icon: <Router />,
                                color: theme.palette.text.primary
                            },
                            {
                                label: "Delete",
                                onClick: () => {
                                    setTransitGatewayId(values.row.id)
                                    openDialog('delete-transit-gateway')
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
        <DialogComponent dialogId="delete-transit-gateway" title="Delete Transit Gateway" dividers={true}>
            <TransitGatewayDeleteForm closeDialog={closeDialog} transitGatewayId={transitGatewayId!} />
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
            rows={(isLoading || isFetching) ? [] : transitGateways!}
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
                noRowsOverlay: () => <EmptyPlaceholder Icon={<Router fontSize="large" />} message="You don't have any Transit Gateways" subMessage="Start creating one now" />
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnResize={true}
        />
    </>
}