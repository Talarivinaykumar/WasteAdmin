import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useMockData } from '../../../context/MockDataContext';

export default function ProfileSettings() {
    const { users } = useMockData();
    const adminUser = users.find(u => u.role === 'admin'); // Assuming current user is admin

    const [name, setName] = useState(adminUser?.name || '');
    const [email] = useState(adminUser?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdateProfile = () => {
        // Mock update
        alert('Profile updated successfully (Mock)');
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // Mock update
        alert('Password changed successfully (Mock)');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Profile Settings
            </Typography>

            <Paper sx={{ p: 4, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar sx={{ width: 80, height: 80 }} />
                    <Button variant="outlined">Change Photo</Button>
                </Stack>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Full Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Email Address"
                            fullWidth
                            value={email}
                            disabled
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Button variant="contained" onClick={handleUpdateProfile}>
                            Save Changes
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>Security</Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Current Password"
                            type="password"
                            fullWidth
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Button variant="contained" color="warning" onClick={handleChangePassword}>
                            Change Password
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
