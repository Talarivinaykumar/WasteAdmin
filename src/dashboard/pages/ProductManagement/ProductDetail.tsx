import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductForm from './ProductForm';
import { useMockData, Product } from '../../../context/MockDataContext';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, updateProductStatus, deleteProduct, updateProduct, users } = useMockData();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [rejectReason, setRejectReason] = useState('');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            const found = products.find(p => p.id === id);
            setProduct(found);
        }
    }, [id, products]);

    if (!product) {
        return <Box sx={{ p: 3 }}>Loading...</Box>;
    }

    const getSeller = () => {
        const seller = product.sellerId;
        if (typeof seller === 'object' && seller !== null) {
            return seller as any;
        }
        return users.find(u => u.id === seller || u._id === seller);
    };

    const seller = getSeller();

    const handleStatusChange = (status: Product['status']) => {
        if (status === 'rejected') {
            setIsRejectModalOpen(true);
            return;
        }
        const productId = product.id || (product as any)._id;
        if (window.confirm(`Are you sure you want to ${status} this product?`)) {
            updateProductStatus(productId, status);
            navigate(-1);
        }
    };

    const submitReject = () => {
        const productId = product.id || (product as any)._id;
        if (rejectReason) {
            alert(`Product rejected. Reason: ${rejectReason}`);
        }
        updateProductStatus(productId, 'rejected');
        setIsRejectModalOpen(false);
        navigate(-1);
    };

    const handleEditSave = async (data: any) => {
        const productId = product.id || (product as any)._id;
        await updateProduct(productId, data);
        setIsEditModalOpen(false);
    };

    const handleDelete = async () => {
        const productId = product.id || (product as any)._id;
        if (window.confirm('Are you sure you want to delete this product?')) {
            console.log('ProductDetail: Deleting product', productId);
            await deleteProduct(productId);
            navigate(-1);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Back
            </Button>

            <Typography variant="h4" gutterBottom>
                Product Details
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="start">
                            <Box>
                                <Typography variant="h5" color="primary">{product.title}</Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {product.category} &gt; {product.subCategory}
                                </Typography>
                            </Box>
                            <Chip
                                label={product.status}
                                color={product.status === 'approved' ? 'success' : product.status === 'pending' ? 'warning' : 'error'}
                                sx={{ textTransform: 'capitalize' }}
                            />
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>Description</Typography>
                        <Typography paragraph color="text.secondary">
                            No description available in mock data (add description field to Product type if needed).
                        </Typography>

                        <Typography variant="h6" gutterBottom>Pricing & Condition</Typography>
                        <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Price</Typography>
                                <Typography variant="body1">₹{product.price}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Condition</Typography>
                                <Typography variant="body1">Used - Good</Typography>
                            </Box>
                        </Stack>

                        <Typography variant="h6" gutterBottom>Specifications</Typography>
                        {/* Dynamic specs would render here matching the category template */}
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Specifications not populated in this mock view.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Seller Information</Typography>
                        {seller ? (
                            <Stack spacing={1}>
                                <Typography variant="body1"><strong>Name:</strong> {seller.name}</Typography>
                                <Typography variant="body1"><strong>Email:</strong> {seller.email}</Typography>
                                <Typography variant="body1"><strong>Joined:</strong> {seller.joinDate}</Typography>
                                <Typography variant="body1"><strong>Status:</strong> <Chip size="small" label={seller.status} /></Typography>
                            </Stack>
                        ) : (
                            <Typography color="error">Seller not found</Typography>
                        )}
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Admin Actions</Typography>
                        <Stack spacing={2} direction="column">
                            {product.status === 'pending' && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => handleStatusChange('approved')}
                                    >
                                        Approve Listing
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleStatusChange('rejected')}
                                    >
                                        Reject Listing
                                    </Button>
                                </>
                            )}
                            {product.status === 'approved' && (
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    startIcon={<BlockIcon />}
                                    onClick={() => handleStatusChange('blocked')}
                                >
                                    Block Listing
                                </Button>
                            )}
                            {product.status === 'blocked' && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleStatusChange('approved')}
                                >
                                    Unblock & Approve
                                </Button>
                            )}

                            <Divider sx={{ my: 1 }} />

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Edit Details
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                            >
                                Delete Product
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Reject Reason Modal */}
            <Dialog open={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
                <DialogTitle>Reject Listing</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Please provide a reason for rejecting this listing. This will be sent to the seller.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Reason"
                        fullWidth
                        multiline
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
                    <Button onClick={submitReject} color="error" variant="contained">Reject</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Product Details</DialogTitle>
                <DialogContent>
                    <ProductForm
                        product={product}
                        onSave={handleEditSave}
                        onCancel={() => setIsEditModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
