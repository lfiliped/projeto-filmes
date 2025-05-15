const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Filme', required: true },
  value: { type: Number, required: true, min: 1, max: 5 }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

ratingSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);