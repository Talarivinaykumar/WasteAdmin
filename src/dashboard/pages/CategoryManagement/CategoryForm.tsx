import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { useMockData, Category } from '../../../context/MockDataContext';

interface CategoryFormProps {
    open: boolean;
    onClose: () => void;
    categoryToEdit?: Category | null;
    type?: 'main' | 'sub';
}

export default function CategoryForm({ open, onClose, categoryToEdit, type = 'main' }: CategoryFormProps) {
    const { categories, addCategory, updateCategory } = useMockData();
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');

    const mainCategories = categories.filter(c => c.type === 'main');

    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name);
            setParentId(categoryToEdit.parentId || '');
            setStatus(categoryToEdit.status);
        } else {
            setName('');
            setParentId('');
            setStatus('active');
        }
    }, [categoryToEdit, open]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert('Please enter a category name');
            return;
        }

        if (type === 'sub' && !parentId) {
            alert('Please select a parent category for the sub-category');
            return;
        }

        try {
            if (categoryToEdit) {
                await updateCategory(categoryToEdit._id, {
                    name,
                    parentId: type === 'sub' ? parentId : undefined,
                    status
                });
            } else {
                const newCategory: Partial<Category> = {
                    name,
                    type,
                    parentId: type === 'sub' ? parentId : undefined,
                    status,
                };
                await addCategory(newCategory);
            }
            onClose();
        } catch (error: any) {
            console.error('Submit error:', error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{categoryToEdit ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Category Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {type === 'sub' && (
                        <FormControl fullWidth>
                            <InputLabel>Parent Category</InputLabel>
                            <Select
                                value={parentId}
                                label="Parent Category"
                                onChange={(e) => setParentId(e.target.value as string)}
                            >
                                {mainCategories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {categoryToEdit ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
