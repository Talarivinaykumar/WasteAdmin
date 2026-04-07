import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import { useMockData } from '../../../context/MockDataContext';

export default function ActivityLogs() {
    const { logs } = useMockData();

    const activityLogs = logs.filter(l => l.type === 'activity');

    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Timestamp', width: 180 },
        { field: 'user', headerName: 'User', width: 150 },
        { field: 'action', headerName: 'Action', width: 200 },
        { field: 'details', headerName: 'Details', flex: 1 },
        {
            field: 'type',
            headerName: 'Type',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <Chip label={params.value} size="small" variant="outlined" />
            )
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Activity Logs
            </Typography>

            <CustomDataGrid
                rows={activityLogs}
                columns={columns}
            />
        </Box>
    );
}
