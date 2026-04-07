import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useMockData } from '../../../context/MockDataContext';

export default function BannerManagement() {
    const { banners, createBanner, deleteBanner, loading } = useMockData();
    const [open, setOpen] = useState(false);
    const [newBanner, setNewBanner] = useState({ title: '', imageUrl: '', link: '', priority: 0 });

    const handleAdd = async () => {
        if (newBanner.title && newBanner.imageUrl) {
            await createBanner(newBanner);
            setOpen(false);
            setNewBanner({ title: '', imageUrl: '', link: '', priority: 0 });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this banner?')) {
            await deleteBanner(id);
        }
    };

    if (loading && banners.length === 0) return <Typography>Loading Banners...</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Banner Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add Banner
                </Button>
            </Box>

            <Grid container spacing={3}>
                {banners.map((banner: any) => (
                    <Grid item xs={12} md={6} key={banner._id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={banner.imageUrl}
                                alt={banner.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    {banner.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Link: {banner.link || 'None'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton color="error" onClick={() => handleDelete(banner._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Banner</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newBanner.title}
                        onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Image URL"
                        fullWidth
                        value={newBanner.imageUrl}
                        onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Link (Optional)"
                        fullWidth
                        value={newBanner.link}
                        onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Priority"
                        type="number"
                        fullWidth
                        value={newBanner.priority}
                        onChange={(e) => setNewBanner({ ...newBanner, priority: parseInt(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdd} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
