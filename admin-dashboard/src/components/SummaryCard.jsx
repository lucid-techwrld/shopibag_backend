import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

const SummaryCard = ({ icon, title, value, color }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        boxShadow: 4,
        background: theme.palette.mode === 'dark' ? '#1e1e2f' : '#fff',
        '&:hover': {
          boxShadow: 8,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
          color: '#fff',
          mr: 2,
          fontSize: 26,
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ p: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: theme.palette.text.secondary, fontSize: 14 }}
        >
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
