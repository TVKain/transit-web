
import { useParams } from "react-router-dom";


import { DataGrid, GridColDef } from "@mui/x-data-grid";

import EmptyPlaceholder from "../../../components/ui/EmptyPlaceholder";
import { Cloud, Delete } from "@mui/icons-material";

import { Typography, useTheme } from "@mui/material";
import { TransitGatewayPeeringAttachment } from "../../../types/Transit";
import { useGetTransitGatewayPeeringAttachment } from "../../../hooks/useTransitGatewayPeeringAttachment";
import GenericMenu from "../../../components/ui/GenericMenu";

import { useDialog } from "../../../context/DialogContext";
import TransitGatewayPeeringAttachmentDeleteForm from "./TransitGatewayPeeringAttachmentDeleteForm";
import React from "react";

export default function TransitGatewayPeeringGrid() {

    const { regionId } = useParams()

    const theme = useTheme()

    const { transitGatewayPeeringAttachments, isLoading, isFetching } = useGetTransitGatewayPeeringAttachment(regionId!)

    const { DialogComponent, openDialog, closeDialog } = useDialog()


    const [transitGatewayPeeringAttachmentId, setTransitGatewayPeeringAttachmentId] = React.useState<string | null>(null)

    const columns: GridColDef<TransitGatewayPeeringAttachment>[] = [
        { field: 'id', headerName: 'ID', flex: 0.3 },
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.1
        },
        {
            field: 'transit_gateway_id',
            headerName: 'Transit Gateway ID',
            flex: 0.25
        },
        {
            field: 'remote_transit_gateway_id',
            headerName: 'Remote Transit Gateway ID',
            flex: 0.25
        },
        {
            field: 'status',
            headerName: 'Status',

            flex: 0.1,
            cellClassName: (params) => {
                switch (params.value) {
                    case "ACTIVE":
                        return 'status-active';
                    case "BUILD": case "PENDING":
                        return 'status-build';
                    case "ERROR": case "DELETING":
                        return 'status-error';
                    default:
                        return '';
                }
            },
        },
        {
            field: 'remote_region_id',
            headerName: 'Remote Region',
            flex: 0.1
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
                                    setTransitGatewayPeeringAttachmentId(values.row.id)
                                    openDialog('delete-transit-gateway-peering-attachment')
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
        <DialogComponent dialogId="delete-transit-gateway-peering-attachment" title="Delete Transit Gateway Peering Attachment" dividers={true}>
            <TransitGatewayPeeringAttachmentDeleteForm closeDialog={closeDialog} transitGatewayPeeringAttachmentId={transitGatewayPeeringAttachmentId!} />
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
            rows={(isLoading || isFetching) ? [] : transitGatewayPeeringAttachments!}
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
                noRowsOverlay: () => <EmptyPlaceholder Icon={<Cloud fontSize="large" />} message="You don't have any Transit Gateway Peering Attachments" subMessage="Start creating one now" />
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnResize={true}
        />

    </>
}