import React from 'react';
import { Typography } from '@mui/material';

function AverageRating({ rating, numRatings }) {
  const ratingValue = typeof rating === 'number' ? rating.toFixed(1) : 'N/A';
  const ratingClass =
    typeof rating === 'number'
      ? rating >= 4
        ? 'rating-green'
        : rating >= 3
        ? 'rating-orange'
        : 'rating-red'
      : 'rating-unknown';

  return (
    <Typography variant="body2" className={ratingClass}>
      {ratingValue} ({numRatings || 0} votos)
    </Typography>
  );
}

export default AverageRating;
