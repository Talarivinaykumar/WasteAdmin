import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';

import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { useMockData, SpecField, SpecificationTemplate } from '../../../context/MockDataContext';

export default function SpecificationMaster() {
    const { categories, specificationTemplates, saveSpecificationTemplate } = useMockData();
    const [selectedSubCatId, setSelectedSubCatId] = useState<string | null>(null);
    const [fields, setFields] = useState<SpecField[]>([]);
    const [isDirty, setIsDirty] = useState(false);

    const subCategories = categories.filter(c => c.type === 'sub');

    useEffect(() => {
        if (selectedSubCatId) {
            const template = specificationTemplates.find(t => t.subCategoryId === selectedSubCatId);
            if (template) {
                setFields(template.fields);
            } else {
                setFields([]);
            }
            setIsDirty(false);
        }
    }, [selectedSubCatId, specificationTemplates]);

    const handleAddField = () => {
        const newField: SpecField = {
            id: Date.now().toString(),
            name: '',
            type: 'text',
            required: false,
            options: [],
        };
        setFields([...fields, newField]);
        setIsDirty(true);
    };

    const handleRemoveField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
        setIsDirty(true);
    };

    const handleFieldChange = (id: string, key: keyof SpecField, value: any) => {
        setFields(fields.map(f => {
            if (f.id === id) {
                if (key === 'options' && typeof value === 'string') {
                    return { ...f, [key]: value.split(',').map(s => s.trim()) };
                }
                return { ...f, [key]: value };
            }
            return f;
        }));
        setIsDirty(true);
    };

    const handleSave = () => {
        if (!selectedSubCatId) return;

        // Simple validation
        if (fields.some(f => !f.name)) {
            alert('Please fill in names for all fields');
            return;
        }

        const template: SpecificationTemplate = {
            id: specificationTemplates.find(t => t.subCategoryId === selectedSubCatId)?.id || Date.now().toString(),
            subCategoryId: selectedSubCatId,
            fields: fields,
        };

        saveSpecificationTemplate(template);
        setIsDirty(false);
        alert('Specification template saved successfully!');
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, height: 'calc(100vh - 100px)' }}>
            <Typography variant="h5" gutterBottom>
                Specification Master
            </Typography>
            <Grid container spacing={3} sx={{ height: '100%' }}>
                {/* Left Side: Sub Category List */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper sx={{ height: '100%', overflow: 'auto' }}>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Select Sub Category
                            </Typography>
                        </Box>
                        <List>
                            {subCategories.map((sub) => (
                                <ListItemButton
                                    key={sub.id}
                                    selected={selectedSubCatId === sub.id}
                                    onClick={() => {
                                        if (isDirty) {
                                            if (window.confirm('You have unsaved changes. Discard?')) {
                                                setSelectedSubCatId(sub.id);
                                            }
                                        } else {
                                            setSelectedSubCatId(sub.id);
                                        }
                                    }}
                                >
                                    <ListItemText primary={sub.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Right Side: Form Builder */}
                <Grid size={{ xs: 12, md: 9 }}>
                    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {selectedSubCatId ? (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6">
                                        Template for: {subCategories.find(c => c.id === selectedSubCatId)?.name}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSave}
                                        disabled={!isDirty && fields.length > 0}
                                    >
                                        Save Configuration
                                    </Button>
                                </Box>

                                <Box sx={{ flexGrow: 1, overflow: 'auto', pr: 2 }}>
                                    {fields.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
                                            <Typography>No fields defined yet. Click "Add Field" to start.</Typography>
                                        </Box>
                                    ) : (
                                        <Stack spacing={2}>
                                            {fields.map((field) => (
                                                <Paper key={field.id} variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                                                        <TextField
                                                            label="Field Name"
                                                            value={field.name}
                                                            onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                                                            size="small"
                                                            sx={{ flex: 2 }}
                                                        />
                                                        <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
                                                            <InputLabel>Type</InputLabel>
                                                            <Select
                                                                value={field.type}
                                                                label="Type"
                                                                onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                                                            >
                                                                <MenuItem value="text">Text</MenuItem>
                                                                <MenuItem value="number">Number</MenuItem>
                                                                <MenuItem value="select">Select</MenuItem>
                                                                <MenuItem value="date">Date</MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                        {(field.type === 'select') && (
                                                            <TextField
                                                                label="Options (comma separated)"
                                                                value={field.options?.join(', ') || ''}
                                                                onChange={(e) => handleFieldChange(field.id, 'options', e.target.value)}
                                                                size="small"
                                                                sx={{ flex: 2 }}
                                                                placeholder="e.g. Red, Blue, Green"
                                                            />
                                                        )}

                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={field.required}
                                                                    onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                                                                />
                                                            }
                                                            label="Required"
                                                        />

                                                        <IconButton color="error" onClick={() => handleRemoveField(field.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Stack>
                                                </Paper>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>

                                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddField}>
                                        Add New Field
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography variant="body1" color="text.secondary">
                                    Select a sub-category from the left to configure specifications.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
