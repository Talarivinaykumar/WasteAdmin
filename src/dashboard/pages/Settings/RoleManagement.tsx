import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface Role {
    id: string;
    name: string;
    permissions: string[];
}

const initialRoles: Role[] = [
    { id: '1', name: 'Super Admin', permissions: ['all'] },
    { id: '2', name: 'Manager', permissions: ['view_users', 'manage_products', 'view_reports'] },
    { id: '3', name: 'Support', permissions: ['view_users', 'view_reports'] },
];

const availablePermissions = [
    'view_users', 'manage_users',
    'view_products', 'manage_products',
    'view_reports', 'manage_reports',
    'manage_settings',
];

export default function RoleManagement() {
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [open, setOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setRoleName(role.name);
        setSelectedPermissions(role.permissions);
        setOpen(true);
    };

    const handleNew = () => {
        setEditingRole(null);
        setRoleName('');
        setSelectedPermissions([]);
        setOpen(true);
    };

    const handleSave = () => {
        if (editingRole) {
            setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, name: roleName, permissions: selectedPermissions } : r));
        } else {
            setRoles([...roles, { id: Date.now().toString(), name: roleName, permissions: selectedPermissions }]);
        }
        setOpen(false);
    };

    const togglePermission = (perm: string) => {
        if (selectedPermissions.includes(perm)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
        } else {
            setSelectedPermissions([...selectedPermissions, perm]);
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Role Name', flex: 1 },
        {
            field: 'permissions',
            headerName: 'Permissions',
            flex: 2,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {params.value.slice(0, 3).map((p: string) => (
                        <Chip key={p} label={p} size="small" />
                    ))}
                    {params.value.length > 3 && <Chip label={`+${params.value.length - 3}`} size="small" />}
                </Box>
            )
        },
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Role & Permission Management</Typography>
                <Button variant="contained" onClick={handleNew}>Create Role</Button>
            </Box>

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={roles}
                    columns={columns}
                    hideFooter
                />
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Role Name"
                        fullWidth
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="subtitle2" gutterBottom>Permissions</Typography>
                    <FormGroup>
                        {availablePermissions.map(perm => (
                            <FormControlLabel
                                key={perm}
                                control={
                                    <Checkbox
                                        checked={selectedPermissions.includes(perm)}
                                        onChange={() => togglePermission(perm)}
                                    />
                                }
                                label={perm.replace('_', ' ')}
                            />
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
