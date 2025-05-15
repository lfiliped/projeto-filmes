import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/login');
    } catch (err) {
      setError('Erro ao registrar. E-mail pode estar em uso.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Registar
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nome"
          name="name"
          value={form.name}
          onChange={handleChange}
          margin="normal"
          required
        />
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
          Registar
        </Button>
        <Typography sx={{ mt: 2 }}>
          Já tem conta? <Link to="/login">Entre</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;
