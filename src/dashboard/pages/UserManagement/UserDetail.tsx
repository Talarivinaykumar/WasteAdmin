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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMockData, User } from '../../../context/MockDataContext';

export default function UserDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { users, updateUserStatus, products } = useMockData();
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const found = users.find(u => u.id === id);
            setUser(found);
        }
    }, [id, users]);

    if (!user) {
        return <Box sx={{ p: 3 }}>Loading...</Box>;
    }

    const handleStatusChange = () => {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        if (window.confirm(`Are you sure you want to ${newStatus} this user?`)) {
            updateUserStatus(user.id, newStatus);
        }
    };

    const userProducts = products.filter(p => p.sellerId === user.id);

    return (
        <Box sx={{ p: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Back
            </Button>

            <Typography variant="h4" gutterBottom>
                User Details
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="start">
                            <Box>
                                <Typography variant="h5" color="primary">{user.name}</Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label={user.role}
                                    color="info"
                                    variant="outlined"
                                    sx={{ textTransform: 'capitalize' }}
                                />
                                <Chip
                                    label={user.status}
                                    color={user.status === 'active' ? 'success' : 'error'}
                                    sx={{ textTransform: 'capitalize' }}
                                />
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>Account Information</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2" color="text.secondary">User ID</Typography>
                                <Typography variant="body1">{user.id}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2" color="text.secondary">Joined Date</Typography>
                                <Typography variant="body1">{user.joinDate}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>Stats</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2" color="text.secondary">Total Listings</Typography>
                                <Typography variant="body1">{userProducts.length}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                {/* Placeholder for order stats */}
                                <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                                <Typography variant="body1">0</Typography>
                            </Grid>
                        </Grid>

                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Admin Actions</Typography>
                        <Stack spacing={2} direction="column">
                            {user.status === 'active' ? (
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<BlockIcon />}
                                    onClick={handleStatusChange}
                                >
                                    Block User
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={handleStatusChange}
                                >
                                    Unblock User
                                </Button>
                            )}

                            <Button variant="outlined" component="a" href={`mailto:${user.email}`}>
                                Contact User
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
