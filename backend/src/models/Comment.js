const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Filme', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);