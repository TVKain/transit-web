import { Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { Subnet as SubnetType } from "../../types/Subnet";

import EmptyPlaceholder from "../../components/ui/EmptyPlaceholder";
import { Delete, Lan } from "@mui/icons-material";
import { useDialog } from "../../context/DialogContext";
import SubnetDeleteForm from "./SubnetDeleteForm";
import { useState } from "react";
import GenericMenu from "../../components/ui/GenericMenu";
import { useParams } from "react-router-dom";
import { useGetSubnet } from "../../hooks/useSubnet";



export default function SubnetGrid() {

    const theme = useTheme()

    const columns: GridColDef<SubnetType>[] = [
        { field: 'id', headerName: 'ID', flex: 0.25 },
        {
            field: 'network_address',
            headerName: 'Network address',
            flex: 0.2
        },
        {
            field: 'gateway_ip',
            headerName: 'Gateway IP',
            flex: 0.2
        }, {
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
                                    setSubnetId(values.row.id)
                                    openDialog('delete-subnet')
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
    const { subnets, isLoading, isFetching } = useGetSubnet(vpcId!);

    const { DialogComponent, openDialog, closeDialog } = useDialog()

    const [subnetId, setSubnetId] = useState<string>("")


    return <>
        <DialogComponent dialogId="delete-subnet" title="Delete subnet" dividers={true}>
            <SubnetDeleteForm closeDialog={closeDialog} subnetId={subnetId} />
        </DialogComponent>
        <DataGrid
            sx={{
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
            rows={(isLoading || isFetching) ? [] : subnets}
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
                noRowsOverlay: () => <EmptyPlaceholder Icon={<Lan fontSize="large" />} message="You don't have any subnets" subMessage="Start creating one now" />
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            disableColumnResize={true}
        />
    </>
}