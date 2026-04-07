import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface TableActionButtonsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
}

export default function TableActionButtons({ onEdit, onDelete, onView }: TableActionButtonsProps) {
    return (
        <Stack direction="row" spacing={1}>
            {onView && (
                <Button
                    variant="outlined"
                    size="small"
                    color="info"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView();
                    }}
                    sx={{ minWidth: 60 }}
                >
                    VIEW
                </Button>
            )}
            {onEdit && (
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    sx={{ minWidth: 60 }}
                >
                    EDIT
                </Button>
            )}
            {onDelete && (
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    sx={{ minWidth: 70 }}
                >
                    DELETE
                </Button>
            )}
        </Stack>
    );
}
