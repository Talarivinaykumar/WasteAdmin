import * as React from 'react';
import Button from '@mui/material/Button';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';


export default function LogoutButton() {
  const handleLogout = () => {
    // Mock Logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleLogout}
      startIcon={<LogoutRoundedIcon />}
    >
      Logout
    </Button>
  );
}