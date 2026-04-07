import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import TableActionButtons from '../../components/common/TableActionButtons';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useMockData } from '../../../context/MockDataContext';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ProductForm from './ProductForm';
import { useState } from 'react';

interface ProductListProps {
    status: 'pending' | 'approved' | 'rejected' | 'blocked';
}

export default function ProductList({ status }: ProductListProps) {
    const { products, users, deleteProduct, addProduct } = useMockData();
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Filter products by status
    const displayProducts = products.filter(p => p.status === status);

    const getSellerName = (seller: any) => {
        if (typeof seller === 'object' && seller !== null) {
            return seller.name || seller.email || 'Unknown';
        }
        const user = users.find(u => u.id === seller || u._id === seller);
        return user ? user.name : 'Unknown';
    };

    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleView = (id: string) => {
        if (!id) return;
        navigate(`/dashboard/products/detail/${id}`);
    };

    const handleDelete = async (id: string) => {
        if (!id || isDeleting === id) return;
        
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setIsDeleting(id);
                await deleteProduct(id);
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const handleAddProduct = async (data: any) => {
        await addProduct(data);
        setIsAddModalOpen(false);
    };

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Product Title', flex: 1.5 },
        {
            field: 'category',
            headerName: 'Category',
            flex: 1,
            valueGetter: (params: any, row: any) => row.category || '',
            renderCell: (params: GridRenderCellParams) => (
                <Stack>
                    <Typography variant="body2">{params.row.category}</Typography>
                    <Typography variant="caption" color="text.secondary">{params.row.subCategory}</Typography>
                </Stack>
            )
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 100,
            valueFormatter: (params: any) => `₹${params.value}`
        },
        {
            field: 'sellerId',
            headerName: 'Seller',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => getSellerName(params.value),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params: GridRenderCellParams) => {
                let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
                switch (params.value) {
                    case 'pending': color = 'warning'; break;
                    case 'approved': color = 'success'; break;
                    case 'rejected': color = 'error'; break;
                    case 'blocked': color = 'error'; break;
                }
                return <Chip label={params.value} color={color} size="small" />;
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <TableActionButtons
                    onView={() => handleView(params.row.id || params.row._id)}
                    onDelete={() => handleDelete(params.row.id || params.row._id)}
                />
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
                    {status} Listings
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Product
                </Button>
            </Stack>

            <Box sx={{ height: 600, width: '100%' }}>
                <CustomDataGrid
                    rows={displayProducts}
                    columns={columns}
                    onCellClick={(params) => {
                        // Only navigate if NOT clicking accurately in the actions column
                        if (params.field !== 'actions') {
                            handleView(params.row.id || params.row._id);
                        }
                    }}
                    sx={{ cursor: 'pointer' }}
                />
            </Box>

            <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <ProductForm
                        onSave={handleAddProduct}
                        onCancel={() => setIsAddModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
