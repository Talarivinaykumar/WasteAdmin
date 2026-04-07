import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import Stack from '@mui/material/Stack';
import { useMockData, Report } from '../../../context/MockDataContext';

interface ReportListProps {
    targetType?: 'product' | 'user';
}

export default function ReportList({ targetType }: ReportListProps) {
    const { reports, updateReportStatus, users, products } = useMockData();

    const displayReports = targetType
        ? reports.filter(r => r.targetType === targetType)
        : reports;

    const getTargetName = (report: Report) => {
        if (report.targetType === 'user') {
            return users.find(u => u.id === report.targetId)?.name || 'Unknown User';
        } else {
            return products.find(p => p.id === report.targetId)?.title || 'Unknown Product';
        }
    };

    const getReporterName = (reporterId: string) => {
        return users.find(u => u.id === reporterId)?.name || 'Unknown';
    };

    const handleStatusUpdate = (id: string, status: Report['status']) => {
        if (window.confirm(`Mark this report as ${status}?`)) {
            updateReportStatus(id, status);
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'targetType',
            headerName: 'Type',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <Chip label={params.value} size="small" sx={{ textTransform: 'capitalize' }} />
            )
        },
        {
            field: 'targetId',
            headerName: 'Target',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => getTargetName(params.row)
        },
        {
            field: 'reporterId',
            headerName: 'Reported By',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => getReporterName(params.value)
        },
        { field: 'reason', headerName: 'Reason', flex: 1.5 },
        { field: 'date', headerName: 'Date', width: 120 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params: GridRenderCellParams) => {
                let color: 'default' | 'warning' | 'success' | 'error' = 'default';
                switch (params.value) {
                    case 'pending': color = 'warning'; break;
                    case 'resolved': color = 'success'; break;
                    case 'dismissed': color = 'default'; break;
                }
                return <Chip label={params.value} color={color} size="small" sx={{ textTransform: 'capitalize' }} />;
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={1}>
                    {params.row.status === 'pending' && (
                        <>
                            <>
                                <Button
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    onClick={() => handleStatusUpdate(params.row.id, 'resolved')}
                                    sx={{ minWidth: 80 }}
                                >
                                    RESOLVE
                                </Button>
                                <Button
                                    size="small"
                                    color="inherit"
                                    variant="outlined"
                                    onClick={() => handleStatusUpdate(params.row.id, 'dismissed')}
                                    sx={{ minWidth: 80 }}
                                >
                                    DISMISS
                                </Button>
                            </>
                        </>
                    )}
                </Stack>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, textTransform: 'capitalize' }}>
                {targetType ? `${targetType} Reports` : 'All Reports'}
            </Typography>

            <CustomDataGrid
                rows={displayReports}
                columns={columns}
            />
        </Box>
    );
}
