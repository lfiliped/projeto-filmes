import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AverageRating from './AverageRating';

function MovieCard({ movie }) {
  return (
    <Card className="movie-card">
      <CardMedia
        component="img"
        height="300"
        image={movie.poster || 'https://placehold.co/200x300'}
        alt={movie.title}
      />
      <CardContent>
        <Typography variant="h6" component={Link} to={`/movie/${movie._id}`}>
          {movie.title} ({movie.year})
        </Typography>
        <AverageRating
          rating={movie.imdb?.rating || 0}
          numRatings={movie.imdb?.votes || 0}
        />
      </CardContent>
    </Card>
  );
}

export default MovieCard;
