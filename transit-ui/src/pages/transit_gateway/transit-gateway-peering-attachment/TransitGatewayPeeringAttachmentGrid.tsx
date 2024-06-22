
import { useParams } from "react-router-dom";


import { DataGrid, GridColDef } from "@mui/x-data-grid";

import EmptyPlaceholder from "../../../components/ui/EmptyPlaceholder";
import { Cloud } from "@mui/icons-material";
import { useGetTransitGateway } from "../../../hooks/useTransitGateway";
import { useTheme } from "@mui/material";
import { TransitGateway } from "../../../types/Transit";

export default function VPCGrid() {

    const { regionId } = useParams()

    const theme = useTheme()

    const { transitGateways, isLoading, isFetching } = useGetTransitGateway(regionId!)

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
                    case "ERROR":
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
        }
    ];

    return <DataGrid
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
            noRowsOverlay: () => <EmptyPlaceholder Icon={<Cloud fontSize="large" />} message="You don't have any Transit Gateway Peering Attachments" subMessage="Start creating one now" />
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        disableColumnResize={true}
    />
}