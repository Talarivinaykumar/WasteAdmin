import React from 'react';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { Box, styled } from '@mui/material';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: '#fafafa',
    },
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e0e0e0',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 600,
        color: theme.palette.text.secondary,
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        letterSpacing: '0.5px',
    },
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: 'none',
    },
    '& .MuiDataGrid-row': {
        borderBottom: '1px solid #e0e0e0',
    },
    '& .MuiDataGrid-cell': {
        color: theme.palette.text.primary,
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 4,
    },
}));

interface CustomDataGridProps extends DataGridProps {
    height?: number | string;
}

export default function CustomDataGrid({ height = 600, ...props }: CustomDataGridProps) {
    return (
        <Box sx={{ height: height, width: '100%', boxShadow: 2, borderRadius: 2, bgcolor: 'background.paper', overflow: 'hidden' }}>
            <StyledDataGrid
                {...props}
                getRowId={(row) => String(row.id || row._id || '')}
                density="comfortable"
                disableRowSelectionOnClick
                checkboxSelection={false}
                disableVirtualization={true}
                initialState={{
                    ...props.initialState,
                    pagination: {
                        ...props.initialState?.pagination,
                        paginationModel: { pageSize: 10, page: 0 }
                    }
                }}
                pageSizeOptions={[10, 25, 50]}
                sx={{
                    ...props.sx,
                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                        bgcolor: (theme) => theme.palette.action.hover,
                    }
                }}
            />
        </Box>
    );
}
