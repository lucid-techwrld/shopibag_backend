import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const navLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Orders', path: '/orders' },
  { label: 'Users', path: '/users' },
  { label: 'Add Product', path: '/add-product' },
];

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, { position: 'top-right' });
        navigate('/login'); // Redirect to login page
      } else {
        toast.error(data.message || 'Logout failed', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Logout Error:', error.message);
      toast.error('An error occurred. Please try again.', { position: 'top-right' });
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: 'linear-gradient(135deg, #1976d2, #1565c0)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          ShopiBag Admin
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navLinks.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.8)',
                fontWeight: isActive(item.path) ? 700 : 400,
                borderBottom: isActive(item.path) ? '2px solid #fff' : '2px solid transparent',
                borderRadius: 0,
                transition: 'all 0.2s',
                '&:hover': {
                  color: '#fff',
                  borderBottom: '2px solid #fff',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>

        {/* Mobile Menu Icon */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Mobile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {navLinks.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMenuClose}
              selected={isActive(item.path)}
            >
              {item.label}
            </MenuItem>
          ))}
          <MenuItem onClick={() => {
            handleMenuClose();
            handleLogout();
          }}>Logout</MenuItem>
        </Menu>

        {/* Profile Icon */}
        <IconButton color="inherit" sx={{ ml: 1 }}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
