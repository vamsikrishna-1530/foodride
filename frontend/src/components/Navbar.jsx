import { AppBar, Toolbar, Box, Button, IconButton, Badge, Menu, MenuItem, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircleOutlined';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const ROLE_LABEL = { customer: 'Customer', owner: 'Restaurant Owner', delivery: 'Delivery Partner', admin: 'Admin' };
const ROLE_HOME = { customer: '/restaurants', owner: '/owner', delivery: '/delivery' };

const Navbar = () => {
  const { user, logout } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/');
  };

  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar sx={{ gap: 2 }}>
        <Box component={Link} to="/" sx={{ textDecoration: 'none', flexGrow: 1 }}>
          <Logo size={34} />
        </Box>

        {user?.role === 'customer' && (
          <IconButton component={Link} to="/cart" color="primary">
            <Badge badgeContent={cart.itemCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        )}

        {user ? (
          <>
            <Chip label={ROLE_LABEL[user.role]} color="secondary" size="small" variant="outlined" />
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              startIcon={<AccountCircleIcon />}
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              {user.name.split(' ')[0]}
            </Button>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  navigate(ROLE_HOME[user.role] || '/');
                }}
              >
                My Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button component={Link} to="/login" color="inherit" sx={{ color: 'text.primary' }}>
              Login
            </Button>
            <Button component={Link} to="/register" variant="contained" color="primary">
              Sign up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
