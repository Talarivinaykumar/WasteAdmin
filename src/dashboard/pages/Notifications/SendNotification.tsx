import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'; // v6 Grid
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { useMockData, Notification } from '../../../context/MockDataContext';

export default function SendNotification() {
    const { sendNotification } = useMockData();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState<Notification['target']>('all');

    const handleSend = async () => {
        if (!title || !message) {
            alert('Please fill in all fields');
            return;
        }

        await sendNotification({
            title,
            message,
            target,
        });

        alert('Notification sent successfully!');
        setTitle('');
        setMessage('');
        setTarget('all');
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Send Notification
            </Typography>

            <Paper sx={{ p: 4 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Notification Title"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Recipients"
                            select
                            fullWidth
                            value={target}
                            onChange={(e) => setTarget(e.target.value as Notification['target'])}
                        >
                            <MenuItem value="all">All Users</MenuItem>
                            <MenuItem value="buyers">Buyers</MenuItem>
                            <MenuItem value="sellers">Sellers</MenuItem>
                            {/* Feature to select specific user can be added later */}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Message"
                            fullWidth
                            multiline
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<SendIcon />}
                            onClick={handleSend}
                            fullWidth
                        >
                            Send Notification
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
