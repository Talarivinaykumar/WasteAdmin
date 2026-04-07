import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

import Select, { SelectChangeEvent } from '@mui/material/Select';

import { styled } from '@mui/material/styles';

import wtwLogo from './wtw.png';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent({ mini = false }: { mini?: boolean }) {
  const [company, setCompany] = React.useState('1');

  const handleChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value as string);
  };

  return (
    <Select
      labelId="company-select-label"
      id="company-select"
      value={company}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select company' }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: company === '' ? { xs: '100%', md: 'fit-content' } : '100%',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pl: 1,
        },
      }}
    >
      <MenuItem value="1">
        <ListItemAvatar sx={{ minWidth: mini ? 0 : 40 }}>
          <Avatar alt="Waste to Wonder" src={wtwLogo} />
        </ListItemAvatar>
        {!mini && <ListItemText primary="Waste to Wonder" secondary="Admin Panel" />}
      </MenuItem>
    </Select>
  );
}
