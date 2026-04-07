import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import TableActionButtons from '../../components/common/TableActionButtons';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';

import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../../context/MockDataContext';

interface UserListProps {
    variant: 'all' | 'buyer' | 'seller' | 'blocked';
}

export default function UserList({ variant }: UserListProps) {
    const { users } = useMockData();
    const navigate = useNavigate();

    const displayUsers = users.filter(u => {
        if (variant === 'all') return true;
        if (variant === 'blocked') return u.status === 'blocked';
        if (variant === 'buyer') return u.role === 'buyer';
        if (variant === 'seller') return u.role === 'seller';
        return true;
    });

    const handleView = (id: string) => {
        navigate(`/dashboard/users/detail/${id}`);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        {
            field: 'role',
            headerName: 'Role',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    color={params.value === 'seller' ? 'secondary' : params.value === 'buyer' ? 'info' : 'default'}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    color={params.value === 'active' ? 'success' : 'error'}
                    size="small"
                />
            )
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
                {variant} Users
            </Typography>

            <CustomDataGrid
                rows={displayUsers}
                columns={columns}
            />
        </Box>
    );
}
