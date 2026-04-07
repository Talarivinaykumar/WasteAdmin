import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import { useMockData } from '../../../context/MockDataContext';

export default function NotificationHistory() {
    const { notifications } = useMockData();

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'message', headerName: 'Message', flex: 2 },
        {
            field: 'target',
            headerName: 'Target Audience',
            width: 150,
            renderCell: (params) => <Chip label={params.value} size="small" sx={{ textTransform: 'capitalize' }} />
        },
        { field: 'date', headerName: 'Date Sent', width: 120 },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color="success"
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Notification History
            </Typography>

            <CustomDataGrid
                rows={notifications}
                columns={columns}
            />
        </Box>
    );
}
