import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  TextField,
} from '@mui/material';
import api from '../services/api';
import AverageRating from '../components/AverageRating';
import RatingForm from '../components/RatingForm';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState({
    averageRating: 0,
    numRatings: 0,
    userRating: null,
  });
  const [imageSrc, setImageSrc] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/filmes/${id}`);
        setMovie(response.data.filme);
        setComments(response.data.comentarios || []);
        setImageSrc(
          response.data.filme.poster || 'https://placehold.co/300x450'
        );
        const ratingResponse = await api.get(`/ratings/movie/${id}`);
        setRating(ratingResponse.data);
      } catch (err) {
        console.error('Erro ao buscar filme ou rating:', err.message);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    console.log('User:', user);
    console.log('Comments:', comments);
  }, [user, comments]);

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleRatingChange = async () => {
    try {
      const response = await api.get(`/ratings/movie/${id}`);
      setRating(response.data);
    } catch (err) {
      console.error('Erro ao atualizar rating:', err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comentarios/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Erro ao excluir comentário:', err.message);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const response = await api.put(`/comentarios/${commentId}`, {
        text: editText,
      });
      setComments(
        comments.map((c) =>
          c._id === commentId
            ? { ...c, text: response.data.text || editText }
            : c
        )
      );
      setEditingCommentId(null);
      setEditText('');
    } catch (err) {
      console.error('Erro ao editar comentário:', err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const handleImageError = () => {
    setImageSrc('https://placehold.co/300x450');
  };

  if (!movie) return <Typography>Carregando...</Typography>;

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #E0E0E0' }}>
        <Box
          sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}
        >
          <CardMedia
            component="img"
            sx={{
              width: { xs: '100%', md: 300 },
              height: { xs: 450, md: 'auto' },
              objectFit: 'cover',
            }}
            image={imageSrc}
            alt={`${movie.title} poster`}
            onError={handleImageError}
          />
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" sx={{ color: '#333333', mb: 1 }}>
              {movie.title} ({movie.year})
            </Typography>
            {movie.directors?.length > 0 && (
              <Typography variant="subtitle1" sx={{ color: '#666666', mb: 2 }}>
                Diretor: {movie.directors.join(', ')}
              </Typography>
            )}
            <Typography variant="body1" sx={{ color: '#333333', mb: 2 }}>
              {movie.plot}
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                <strong>Gêneros:</strong> {movie.genres?.join(', ') || 'N/A'}
              </Typography>
              {movie.runtime && (
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  <strong>Duração:</strong> {movie.runtime} minutos
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: '#666666' }}>
                <strong>Elenco:</strong> {movie.cast?.join(', ') || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                <strong>Idiomas:</strong> {movie.languages?.join(', ') || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                <strong>Lançamento:</strong>{' '}
                {movie.released
                  ? new Date(movie.released).toLocaleDateString()
                  : 'N/A'}
              </Typography>
              {movie.rated && (
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  <strong>Classificação:</strong> {movie.rated}
                </Typography>
              )}
              {movie.countries?.length > 0 && (
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  <strong>Países:</strong> {movie.countries.join(', ')}
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: '#666666' }}>
                <strong>Prêmios:</strong> {movie.awards?.text || 'Nenhum'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                <strong>IMDb:</strong> {movie.imdb?.rating || 'N/A'} (
                {movie.imdb?.votes || 0} votos)
              </Typography>
              {movie.tomatoes?.critic && (
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  <strong>Tomatoes (Críticos):</strong>{' '}
                  {movie.tomatoes.critic.rating || 'N/A'} (
                  {movie.tomatoes.critic.meter || 0}% fresco)
                </Typography>
              )}
              {movie.tomatoes?.viewer && (
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  <strong>Tomatoes (Espectadores):</strong>{' '}
                  {movie.tomatoes.viewer.rating || 'N/A'} (
                  {movie.tomatoes.viewer.numReviews || 0} avaliações)
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: '#666666' }}>
                <strong>Última Atualização:</strong>{' '}
                {movie.lastupdated || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                <strong>Tipo:</strong> {movie.type || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                <strong>Sinopse Completa:</strong>{' '}
                {movie.fullplot || movie.plot}
              </Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            {rating.numRatings > 0 && (
              <AverageRating
                rating={rating.averageRating}
                numRatings={rating.numRatings}
              />
            )}
            <RatingForm movieId={id} onRatingChange={handleRatingChange} />
          </CardContent>
        </Box>
      </Card>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ color: '#333333', mb: 2 }}>
          Comentários
        </Typography>
        <CommentForm movieId={id} onCommentAdded={handleCommentAdded} />
        <List sx={{ bgcolor: '#FFFFFF', borderRadius: 2, boxShadow: 3 }}>
          {comments.map((comment) => (
            <ListItem key={comment._id} divider sx={{ py: 2 }}>
              {editingCommentId === comment._id ? (
                <Box sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    sx={{ mb: 1, bgcolor: '#F5F5F5' }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: '#0077B6',
                        '&:hover': { bgcolor: '#005F8C' },
                      }}
                      onClick={() => handleSaveEdit(comment._id)}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ color: '#666666', borderColor: '#E0E0E0' }}
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <ListItemText
                    primary={comment.text}
                    secondary={`Por ${
                      comment.user_id?.name || 'Utilizador Desconhecido'
                    } em ${new Date(comment.date).toLocaleDateString()}`}
                    primaryTypographyProps={{ color: '#333333' }}
                    secondaryTypographyProps={{ color: '#666666' }}
                  />
                  {user &&
                    (user.role === 'admin' ||
                      (comment.user_id &&
                        comment.user_id._id === user._id)) && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          sx={{ color: '#0077B6', borderColor: '#0077B6' }}
                          onClick={() => handleEditComment(comment)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{ color: '#DC143C', borderColor: '#DC143C' }}
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Excluir
                        </Button>
                      </Box>
                    )}
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default MovieDetail;
