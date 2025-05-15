import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const auth = useAuth();
  const { user, logout } = auth || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/login');
    }
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, color: 'white', textDecoration: 'none' }}
        >
          Portal de Filmes
        </Typography>
        <Box>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin">
                  Dashboard
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Entrar
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Registar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
