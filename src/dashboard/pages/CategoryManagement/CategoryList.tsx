import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import TableActionButtons from '../../components/common/TableActionButtons';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import { useMockData, Category } from '../../../context/MockDataContext';
import CategoryForm from './CategoryForm';

interface CategoryListProps {
    type: 'main' | 'sub';
}

export default function CategoryList({ type }: CategoryListProps) {
    const { categories, deleteCategory } = useMockData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Filter categories based on type
    const displayCategories = categories.filter(c => c.type === type);

    const handleAdd = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(id);
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    color={params.value === 'active' ? 'success' : 'default'}
                    size="small"
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

    if (type === 'sub') {
        columns.splice(1, 0, {
            field: 'parentId',
            headerName: 'Parent Category',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                const pId = params.row.parentId;
                const parentIdStr = pId ? String(pId) : null;
                const parent = categories.find(c => {
                    const cId = c._id || c.id;
                    const cIdStr = cId ? String(cId) : null;
                    return cIdStr === parentIdStr;
                });
                return parent ? parent.name : '-';
            }
        });
    }

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5">
                    {type === 'main' ? 'Main Categories' : 'Sub Categories'}
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
                    Add Category
                </Button>
            </Stack>

            <Box sx={{ height: 600, width: '100%' }}>
                <CustomDataGrid
                    rows={displayCategories}
                    columns={columns}
                />
            </Box>

            <CategoryForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                categoryToEdit={editingCategory}
                type={type}
            />
        </Box>
    );
}
