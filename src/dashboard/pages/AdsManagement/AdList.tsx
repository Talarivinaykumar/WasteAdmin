import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import TableActionButtons from '../../components/common/TableActionButtons';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import { useMockData, Advertisement } from '../../../context/MockDataContext';
import AdForm from './AdForm';

export default function AdList() {
    const { ads, deleteAd } = useMockData();
    const [open, setOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

    const handleAdd = () => {
        setEditingAd(null);
        setOpen(true);
    };

    const handleEdit = (ad: Advertisement) => {
        setEditingAd(ad);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this ad?')) {
            await deleteAd(id);
        }
    };

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Campaign Title', flex: 1.5 },
        {
            field: 'position',
            headerName: 'Position',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Chip label={params.value} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
            )
        },
        { field: 'startDate', headerName: 'Start Date', width: 120 },
        { field: 'endDate', headerName: 'End Date', width: 120 },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    color={params.value === 'active' ? 'success' : 'default'}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <TableActionButtons
                    onEdit={() => handleEdit(params.row)}
                    onDelete={() => handleDelete(params.row.id)}
                />
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Ads Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
                    New Campaign
                </Button>
            </Box>

            <CustomDataGrid
                rows={ads}
                columns={columns}
            />

            <AdForm
                open={open}
                onClose={() => setOpen(false)}
                adToEdit={editingAd}
            />
        </Box>
    );
}
