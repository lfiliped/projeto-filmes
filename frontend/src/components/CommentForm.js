import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function CommentForm({ movieId, onCommentAdded }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('O comentário não pode estar vazio.');
      return;
    }
    try {
      const response = await api.post('/comentarios', {
        text,
        movie_id: movieId,
      });
      setText('');
      setError('');
      onCommentAdded(response.data);
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
      setError('Erro ao adicionar comentário.');
    }
  };

  if (!user) return null;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Adicionar comentário"
        multiline
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Enviar
      </Button>
    </Box>
  );
}

export default CommentForm;
