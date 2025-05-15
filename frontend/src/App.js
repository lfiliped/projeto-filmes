import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import { CssBaseline, Container, Typography, Box } from '@mui/material'; // Added Box import

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Algo deu errado: {this.state.error.message}
          </Typography>
          <Typography>
            Por favor, recarregue a página ou tente novamente.
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CssBaseline />
        <Navbar />
        <Container>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/releases" element={<Home />} />{' '}
              {/* Placeholder route */}
              <Route path="/popular" element={<Home />} />{' '}
              {/* Placeholder route */}
              <Route path="/lists" element={<Home />} />{' '}
              {/* Placeholder route */}
              <Route path="/sports" element={<Home />} />{' '}
              {/* Placeholder route */}
              <Route path="/search" element={<Home />} />{' '}
              {/* Placeholder route */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
