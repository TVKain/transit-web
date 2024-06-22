
import { useParams } from "react-router-dom";


import { DataGrid, GridColDef } from "@mui/x-data-grid";

import EmptyPlaceholder from "../../../components/ui/EmptyPlaceholder";
import { Delete, ElectricalServices } from "@mui/icons-material";

import { Typography, useTheme } from "@mui/material";
import { TransitGatewayVPCAttachment } from "../../../types/Transit";
import { useGetTransitGatewayVPCAttachment } from "../../../hooks/useTransitGatewayVPCAttachment";
import GenericMenu from "../../../components/ui/GenericMenu";
import { useDialog } from "../../../context/DialogContext";
import React from "react";
import TransitGatewayVPCAttachmentDeleteForm from "./TransitGatewayVPCAttachmentDeleteForm";

export default function TransitGatewayVPCAttachmentGrid() {

    const { regionId } = useParams()

    const theme = useTheme()

    const { transitGatewayVPCAttachments, isLoading, isFetching } = useGetTransitGatewayVPCAttachment(regionId!)

    const { DialogComponent, openDialog, closeDialog } = useDialog()

    const [transitGatewayVPCAttachmentId, setTransitGatewayVPCAttachmenId] = React.useState<string | null>(null)

    const columns: GridColDef<TransitGatewayVPCAttachment>[] = [
        { field: 'id', headerName: 'ID', flex: 0.32 },
        {
            field: 'transit_gateway_id',
            headerName: 'Transit Gateway ID',
            flex: 0.28
        },
        {
            field: 'vpc_id',
            headerName: 'VPC ID',
            flex: 0.24
        },
        {
            field: 'vpc_cidr',
            headerName: 'VPC CIDR',
            flex: 0.1
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
                                    setTransitGatewayVPCAttachmenId(values.row.id)
                                    openDialog("delete-transit-gateway-vpc-attachment")
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
        <DialogComponent dialogId="delete-transit-gateway-vpc-attachment" title="Delete Transit Gateway" dividers={true}>
            <TransitGatewayVPCAttachmentDeleteForm closeDialog={closeDialog} transitGatewayVPCAttachmentId={transitGatewayVPCAttachmentId!} />
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
            rows={(isLoading || isFetching) ? [] : transitGatewayVPCAttachments!}
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
                noRowsOverlay: () => <EmptyPlaceholder Icon={<ElectricalServices fontSize="large" />} message="You don't have any Transit Gateway VPC Attachments" subMessage="Start creating one now" />
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnResize={true}
        />

    </>
}