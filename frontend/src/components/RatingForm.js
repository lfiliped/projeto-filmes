import React, { useState, useEffect } from 'react';
import { Rating, Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function RatingForm({ movieId, onRatingChange }) {
  const { user } = useAuth();
  const [value, setValue] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await api.get(`/ratings/movie/${movieId}`);
        setValue(response.data.userRating || null);
      } catch (err) {
        console.error('Erro ao buscar rating do usuário');
      }
    };
    if (user) fetchUserRating();
  }, [user, movieId]);

  const handleChange = async (newValue) => {
    try {
      await api.post('/ratings', { movie_id: movieId, value: newValue });
      setValue(newValue);
      setError('');
      onRatingChange();
    } catch (err) {
      setError('Erro ao enviar avaliação.');
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography component="legend">Sua avaliação</Typography>
      <Rating
        name="movie-rating"
        value={value}
        onChange={(event, newValue) => handleChange(newValue)}
        precision={1}
        max={5}
      />
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}

export default RatingForm;
