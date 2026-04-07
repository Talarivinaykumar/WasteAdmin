import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useMockData, Product, Category } from '../../../context/MockDataContext';

interface ProductFormProps {
    product?: Product;
    onSave: (product: Partial<Product>) => void;
    onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
    const { categories } = useMockData();
    const [formData, setFormData] = useState<Partial<Product>>({
        title: '',
        description: '',
        price: 0,
        category: '',
        subCategory: '',
        location: 'Mumbai', // Default location
        status: 'pending',
    });

    const mainCategories = categories.filter(c => c.type === 'main');
    const [subCategories, setSubCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title,
                description: product.description || '',
                price: product.price,
                category: product.category,
                subCategory: product.subCategory,
                location: product.location || 'Mumbai',
                status: product.status,
            });
            
            const mainCat = categories.find(c => (c.name === product.category || c._id === product.category) && c.type === 'main');
            if (mainCat) {
                setSubCategories(categories.filter(c => c.type === 'sub' && c.parentId === mainCat._id));
            }
        }
    }, [product, categories]);

    const handleMainCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const catId = e.target.value;
        const mainCat = categories.find(c => c._id === catId);
        setFormData({ ...formData, category: catId, subCategory: '' });
        
        if (mainCat) {
            setSubCategories(categories.filter(c => c.type === 'sub' && c.parentId === mainCat._id));
        } else {
            setSubCategories([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // The backend expects description and location which were missing
        if (!formData.description || !formData.location) {
            alert('Description and Location are required');
            return;
        }
        onSave(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required
                        fullWidth
                        label="Product Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        required
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        required
                        fullWidth
                        label="Price (₹)"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        required
                        fullWidth
                        label="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        required
                        fullWidth
                        label="Status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="blocked">Blocked</MenuItem>
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        required
                        fullWidth
                        label="Main Category"
                        value={formData.category}
                        onChange={handleMainCategoryChange}
                    >
                        {mainCategories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select
                        required
                        fullWidth
                        label="Sub Category"
                        value={formData.subCategory}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        disabled={subCategories.length === 0}
                    >
                        {subCategories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {product ? 'Update Product' : 'Add Product'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
