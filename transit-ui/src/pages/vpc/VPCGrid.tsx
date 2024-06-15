import { useLocalStorage } from "@uidotdev/usehooks";
import { useParams } from "react-router-dom";

import { VPC } from "../../types/VPC";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetVPC } from "../../hooks/useVPC";
import EmptyPlaceholder from "../../components/ui/EmptyPlaceholder";
import { Cloud } from "@mui/icons-material";

export default function VPCGrid() {
    const [userId] = useLocalStorage<string | null>("user_id", null)

    const { regionId } = useParams()

    const { vpcs, isLoading, isFetching } = useGetVPC(userId!, regionId!)

    const columns: GridColDef<VPC>[] = [
        { field: 'id', headerName: 'ID', flex: 0.25 },
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.2
        },
        {
            field: 'cidr',
            headerName: 'CIDR block',
            flex: 0.2
        }
    ];

    return <DataGrid
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
        rows={(isLoading || isFetching) ? [] : vpcs}
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
            noRowsOverlay: () => <EmptyPlaceholder Icon={<Cloud fontSize="large" />} message="You don't have any VPCs" subMessage="Start creating one now" />
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        disableColumnResize={true}
    />
}