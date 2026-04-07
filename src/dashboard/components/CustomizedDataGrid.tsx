import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useMockData } from "../../context/MockDataContext";

export default function CustomizedDataGrid() {
  const { products, bulkApproveProducts, loading } = useMockData();
  const [selectionModel, setSelectionModel] =
    React.useState<GridRowSelectionModel>({ type: "include", ids: new Set() });

  const handleBulkApprove = async () => {
    const selectedIds = Array.isArray(selectionModel)
      ? selectionModel
      : Array.from(selectionModel.ids);

    if (selectedIds.length > 0) {
      await bulkApproveProducts(selectedIds as string[]);
      setSelectionModel({ type: "include", ids: new Set() });
    }
  };

  const selectedCount = Array.isArray(selectionModel)
    ? selectionModel.length
    : selectionModel.ids.size;

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Product Title",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      valueFormatter: (params: any) => `₹${params.value || 0}`,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.row.category?.name || params.row.category || "General"}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        let color: "warning" | "success" | "error" | "default" = "default";
        switch (params.value) {
          case "pending":
            color = "warning";
            break;
          case "approved":
            color = "success";
            break;
          case "rejected":
            color = "error";
            break;
          case "blocked":
            color = "error";
            break;
        }
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      {selectedCount > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBulkApprove}
          >
            Bulk Approve ({selectedCount})
          </Button>
        </Box>
      )}
      <DataGrid
        getRowId={(row) => row._id || row.id}
        loading={loading}
        checkboxSelection
        onRowSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        rowSelectionModel={selectionModel}
        rows={products}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
      />
    </Box>
  );
}
