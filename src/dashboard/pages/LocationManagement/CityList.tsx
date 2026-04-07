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
import MenuItem from '@mui/material/MenuItem';
import { useMockData } from '../../../context/MockDataContext';

export default function CityList() {
    const { cities, states, addCity, deleteCity } = useMockData();
    const [open, setOpen] = useState(false);
    const [newCityName, setNewCityName] = useState('');
    const [selectedStateId, setSelectedStateId] = useState('');

    const handleAdd = async () => {
        if (newCityName && selectedStateId) {
            await addCity({
                name: newCityName,
                stateId: selectedStateId,
                status: 'active'
            });
            setNewCityName('');
            setSelectedStateId('');
            setOpen(false);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this city?')) {
            deleteCity(id);
        }
    };

    const getStateName = (stateId: string) => {
        return states.find(s => s.id === stateId)?.name || 'Unknown';
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'City Name', flex: 1 },
        {
            field: 'stateId',
            headerName: 'State',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => getStateName(params.value)
        },
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
                <Typography variant="h5">City Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add City
                </Button>
            </Box>

            <CustomDataGrid
                rows={cities}
                columns={columns}
            />

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New City</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="City Name"
                        fullWidth
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="State"
                        fullWidth
                        value={selectedStateId}
                        onChange={(e) => setSelectedStateId(e.target.value)}
                    >
                        {states.map(state => (
                            <MenuItem key={state.id} value={state.id}>
                                {state.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdd} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
