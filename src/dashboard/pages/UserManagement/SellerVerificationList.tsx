import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import TableActionButtons from '../../components/common/TableActionButtons';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';

import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../../context/MockDataContext';

interface SellerVerificationListProps {
    status: 'pending' | 'approved' | 'rejected';
}

export default function SellerVerificationList({ status }: SellerVerificationListProps) {
    const { users } = useMockData();
    const navigate = useNavigate();

    const displayUsers = users.filter(u => u.verificationStatus === status);

    const handleView = (id: string) => {
        navigate(`/dashboard/verification/detail/${id}`);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Seller Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        {
            field: 'role',
            headerName: 'Current Role',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        },
        {
            field: 'verificationStatus',
            headerName: 'Verif. Status',
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                let color: 'default' | 'warning' | 'success' | 'error' = 'default';
                switch (params.value) {
                    case 'pending': color = 'warning'; break;
                    case 'approved': color = 'success'; break;
                    case 'rejected': color = 'error'; break;
                }
                return (
                    <Chip
                        label={params.value}
                        color={color}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                    />
                );
            }
        },
        {
            field: 'joinDate',
            headerName: 'Joined',
            width: 120,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <TableActionButtons
                    onView={() => handleView(params.row.id)}
                />
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, textTransform: 'capitalize' }}>
                {status} Verifications
            </Typography>

            <CustomDataGrid
                rows={displayUsers}
                columns={columns}
            />
        </Box>
    );
}
