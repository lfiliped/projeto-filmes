import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Pagination,
  Paper,
  Button,
  InputAdornment,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MovieCard from '../components/MovieCard';
import api from '../services/api';
import '../App.css';

function Home() {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    genre: '',
    sort: 'rating', // Padrão alterado para ordenar por nota
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies();
  }, [filters, page]);

  const fetchMovies = async () => {
    try {
      const response = await api.get('/filmes', {
        params: { ...filters, page, limit: 12 },
      });
      setMovies(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Erro ao buscar filmes:', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reseta a página ao mudar filtros
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const clearFilters = () => {
    setFilters({ search: '', year: '', genre: '', sort: 'rating' }); // Mantém rating como padrão
    setPage(1);
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Barra de Pesquisa */}
      <TextField
        fullWidth
        label="Pesquisar por título"
        name="search"
        value={filters.search}
        onChange={handleFilterChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Seção de Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#333333' }}>
          Filtros
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Ano"
              name="year"
              type="number"
              value={filters.year}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Gênero</InputLabel>
              <Select
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Action">Ação</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
                <MenuItem value="Comedy">Comédia</MenuItem>
                <MenuItem value="Sci-Fi">Ficção</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel
                shrink
                sx={{
                  transform: 'translate(6px, -18px) scale(0.75)',
                }}
              >
                Ordenar por
              </InputLabel>
              <Select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <MenuItem value="rating">Nota</MenuItem>
                <MenuItem value="title">Título</MenuItem>
                <MenuItem value="year">Ano</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={clearFilters}
            sx={{
              borderColor: '#0077B6',
              color: '#0077B6',
              '&:hover': { borderColor: '#005F8C', color: '#005F8C' },
            }}
          >
            Limpar Filtros
          </Button>
        </Box>
      </Paper>

      {/* Grade de Filmes */}
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {/* Paginação */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default Home;
