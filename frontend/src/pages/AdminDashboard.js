import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import api from '../services/api';

function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    year: '',
    director: '',
    genres: '',
    poster: '',
    plot: '',
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const response = await api.get('/filmes');
    setMovies(response.data.data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({
      title: '',
      year: '',
      director: '',
      genres: '',
      poster: '',
      plot: '',
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/filmes', {
        ...form,
        genres: form.genres.split(',').map((g) => g.trim()),
      });
      fetchMovies();
      handleClose();
    } catch (err) {
      console.error('Erro ao criar filme');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/filmes/${id}`);
      fetchMovies();
    } catch (err) {
      console.error('Erro ao excluir filme');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Adicionar Filme
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Ano</TableCell>
            <TableCell>Diretor</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie._id}>
              <TableCell>{movie.title}</TableCell>
              <TableCell>{movie.year}</TableCell>
              <TableCell>{movie.director}</TableCell>
              <TableCell>
                <Button color="error" onClick={() => handleDelete(movie._id)}>
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adicionar Novo Filme</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Título"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Ano"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Diretor"
            name="director"
            value={form.director}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Gêneros (separados por vírgula)"
            name="genres"
            value={form.genres}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="URL do Poster"
            name="poster"
            value={form.poster}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Sinopse"
            name="plot"
            multiline
            rows={4}
            value={form.plot}
            onChange={handleChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard;
