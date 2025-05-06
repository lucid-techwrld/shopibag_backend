import React from 'react';
import LoginForm from '../components/LoginForm';
import { Box, Typography } from '@mui/material';

const LoginPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        p: 3,
      }}
    >
      <Typography variant="h3" fontWeight="bold" mb={3} color="primary">
        ShopiBag Admin
      </Typography>
      <LoginForm />
    </Box>
  );
};

export default LoginPage;