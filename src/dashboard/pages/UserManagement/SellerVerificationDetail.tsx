import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useMockData, User } from '../../../context/MockDataContext';

export default function SellerVerificationDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { users, updateSellerVerification } = useMockData();
    const [user, setUser] = useState<User | undefined>(undefined);
    const [rejectReason, setRejectReason] = useState('');
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            const found = users.find(u => u.id === id);
            setUser(found);
        }
    }, [id, users]);

    if (!user) {
        return <Box sx={{ p: 3 }}>Loading...</Box>;
    }

    const handleApprove = () => {
        if (window.confirm('Are you sure you want to approve this seller?')) {
            updateSellerVerification(user.id, 'approved');
            navigate(-1);
        }
    };

    const handleSubmitReject = () => {
        updateSellerVerification(user.id, 'rejected', rejectReason);
        setIsRejectModalOpen(false);
        navigate(-1);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Back
            </Button>

            <Typography variant="h4" gutterBottom>
                Verification Request: {user.name}
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Submitted Documents</Typography>
                        {user.documents && user.documents.length > 0 ? (
                            <Grid container spacing={2}>
                                {user.documents.map((doc, index) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                        <Card variant="outlined">
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={doc.url}
                                                alt={doc.type}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent>
                                                <Typography variant="subtitle1" fontWeight="bold">{doc.type}</Typography>
                                                <Typography variant="caption" color="text.secondary">Status: {doc.status}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography color="text.secondary">No documents submitted.</Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Admin Actions</Typography>
                        <Stack spacing={2}>
                            {user.verificationStatus === 'pending' && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={handleApprove}
                                    >
                                        Approve Request
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => setIsRejectModalOpen(true)}
                                    >
                                        Reject Request
                                    </Button>
                                </>
                            )}
                            {user.verificationStatus === 'approved' && (
                                <Button variant="outlined" disabled>Already Approved</Button>
                            )}
                            {user.verificationStatus === 'rejected' && (
                                <Button variant="outlined" color="error" disabled>Rejected</Button>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Reject Reason Modal */}
            <Dialog open={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
                <DialogTitle>Reject Verification</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Please provide a reason for rejecting the verification documents.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason"
                        fullWidth
                        multiline
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmitReject} color="error" variant="contained">Reject</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
