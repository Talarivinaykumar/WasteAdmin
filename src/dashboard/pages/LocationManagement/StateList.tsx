import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomDataGrid from '../../components/common/CustomDataGrid';
import TableActionButtons from '../../components/common/TableActionButtons';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useMockData } from '../../../context/MockDataContext';

export default function StateList() {
    const { states, addState, deleteState } = useMockData();
    const [open, setOpen] = useState(false);
    const [newStateName, setNewStateName] = useState('');

    const handleAdd = async () => {
        if (newStateName) {
            await addState({
                name: newStateName,
                country: 'India',
                status: 'active'
            });
            setNewStateName('');
            setOpen(false);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this state?')) {
            deleteState(id);
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'State Name', flex: 1 },
        { field: 'country', headerName: 'Country', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <TableActionButtons
                    onDelete={() => handleDelete(params.row.id)}
                />
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">State Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add State
                </Button>
            </Box>

            <CustomDataGrid
                rows={states}
                columns={columns}
            />

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New State</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="State Name"
                        fullWidth
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
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
