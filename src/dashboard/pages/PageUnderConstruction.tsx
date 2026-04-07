import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PageUnderConstruction = ({ title }: { title: string }) => {
    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                This module is currently under development.
            </Typography>
        </Box>
    );
};

export default PageUnderConstruction;
