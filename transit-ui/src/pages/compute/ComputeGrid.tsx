import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Compute } from "../../types/Compute";

import EmptyPlaceholder from "../../components/ui/EmptyPlaceholder";
import { Computer, Delete, OpenInNew } from "@mui/icons-material";

import { useGetCompute } from "../../hooks/useCompute";
import GenericMenu from "../../components/ui/GenericMenu";

import { useDialog } from "../../context/DialogContext";
import { useState } from "react";
import ComputeDeleteForm from "./ComputeDeleteForm";
import { useParams } from "react-router";


export default function ComputeGrid() {
    const theme = useTheme()


    const columns: GridColDef<Compute>[] = [
        { field: 'id', headerName: 'ID', flex: 0.25 },
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.1
        },
        {
            field: 'ip_addresses',
            headerName: 'IP Addresses',
            flex: 0.2,
            renderCell: (params) =>
                <Box
                    display="flex"
                    height="100%"
                    alignItems="flex-start"
                    justifyContent="center"
                    flexDirection="column"
                >
                    {params.value.map((ip_address: any) => (
                        <Typography key={ip_address.ip_address} variant="body2">{ip_address.ip_address} - {ip_address.subnet}</Typography>
                    ))}
                </Box>
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.1,
            cellClassName: (params) => {
                switch (params.value) {
                    case "ACTIVE":
                        return 'status-active';
                    case "BUILD":
                        return 'status-build';
                    case "ERROR":
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
                                label: "Console",
                                onClick: () => {
                                    window.open(values.row.console_url);
                                },
                                icon: <OpenInNew />
                            },
                            {
                                label: "Delete",
                                onClick: () => {
                                    setComputeId(values.row.id)
                                    openDialog('delete-compute')

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

    const { vpcId } = useParams()
    const { computes, isLoading, isFetching } = useGetCompute(vpcId!);

    const { DialogComponent, openDialog, closeDialog } = useDialog()

    const [computeId, setComputeId] = useState<string>("")

    return <>
        <DialogComponent dialogId="delete-compute" title="Delete compute" dividers={true}>
            <ComputeDeleteForm closeDialog={closeDialog} computeId={computeId} />
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
            rows={!(isLoading || isFetching) ? computes : []}
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
                noRowsOverlay: () =>
                    <EmptyPlaceholder
                        Icon={<Computer fontSize="large" />}
                        message="You don't have any computes"
                        subMessage="Start creating one now" />
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnResize={true}
        />
    </>

}