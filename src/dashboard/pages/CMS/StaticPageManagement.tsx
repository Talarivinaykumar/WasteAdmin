import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface StaticPage {
    id: string;
    slug: string;
    title: string;
    content: string;
    lastUpdated: string;
}

const initialPages: StaticPage[] = [
    { id: '1', slug: 'about-us', title: 'About Us', content: 'Welcome to our platform...', lastUpdated: '2023-10-01' },
    { id: '2', slug: 'terms', title: 'Terms & Conditions', content: 'These terms govern...', lastUpdated: '2023-09-15' },
    { id: '3', slug: 'privacy', title: 'Privacy Policy', content: 'Your privacy is important...', lastUpdated: '2023-09-15' },
];

export default function StaticPageManagement() {
    const [pages, setPages] = useState<StaticPage[]>(initialPages);
    const [open, setOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<StaticPage | null>(null);

    const handleEdit = (page: StaticPage) => {
        setEditingPage({ ...page });
        setOpen(true);
    };

    const handleSave = () => {
        if (editingPage) {
            setPages(pages.map(p => p.id === editingPage.id ? { ...editingPage, lastUpdated: new Date().toISOString().split('T')[0] } : p));
            setOpen(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Page Title', flex: 1 },
        { field: 'slug', headerName: 'Slug', flex: 1 },
        { field: 'lastUpdated', headerName: 'Last Updated', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton size="small" onClick={() => handleEdit(params.row)}>
                    <EditIcon fontSize="small" />
                </IconButton>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Static Pages Management
            </Typography>

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={pages}
                    columns={columns}
                    hideFooter
                />
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Page: {editingPage?.title}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Page Title"
                        fullWidth
                        value={editingPage?.title || ''}
                        onChange={(e) => setEditingPage(editingPage ? { ...editingPage, title: e.target.value } : null)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Page Content"
                        fullWidth
                        multiline
                        rows={10}
                        value={editingPage?.content || ''}
                        onChange={(e) => setEditingPage(editingPage ? { ...editingPage, content: e.target.value } : null)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
