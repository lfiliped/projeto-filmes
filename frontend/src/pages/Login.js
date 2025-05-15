import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas ou erro no servidor.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Entrar
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Senha"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Entrar
        </Button>
        <Typography sx={{ mt: 2 }}>
          Não tem conta? <Link to="/register">Registre-se</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
