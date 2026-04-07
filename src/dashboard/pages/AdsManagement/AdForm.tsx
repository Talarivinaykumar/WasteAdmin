import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useMockData, Advertisement } from '../../../context/MockDataContext';

interface AdFormProps {
    open: boolean;
    onClose: () => void;
    adToEdit: Advertisement | null;
}

export default function AdForm({ open, onClose, adToEdit }: AdFormProps) {
    const { addAd, updateAd } = useMockData();
    const [formData, setFormData] = useState<Partial<Advertisement>>({
        title: '',
        imageUrl: '',
        linkUrl: '',
        startDate: '',
        endDate: '',
        status: 'active',
        position: 'home_banner'
    });

    useEffect(() => {
        if (adToEdit) {
            setFormData(adToEdit);
        } else {
            setFormData({
                title: '',
                imageUrl: '',
                linkUrl: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                status: 'active',
                position: 'home_banner'
            });
        }
    }, [adToEdit, open]);

    const handleSubmit = async () => {
        if (!formData.title || !formData.imageUrl) {
            alert('Please fill required fields');
            return;
        }

        if (adToEdit) {
            await updateAd(adToEdit.id, formData);
        } else {
            await addAd(formData);
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{adToEdit ? 'Edit Campaign' : 'New Ad Campaign'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Campaign Title"
                        fullWidth
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <TextField
                        select
                        label="Position"
                        fullWidth
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    >
                        <MenuItem value="home_banner">Home Banner</MenuItem>
                        <MenuItem value="sidebar">Sidebar</MenuItem>
                        <MenuItem value="listing_page">Listing Page</MenuItem>
                    </TextField>
                    <TextField
                        label="Image URL"
                        fullWidth
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        required
                    />
                    <TextField
                        label="Link URL"
                        fullWidth
                        value={formData.linkUrl}
                        onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Start Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </Stack>
                    <TextField
                        select
                        label="Status"
                        fullWidth
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
