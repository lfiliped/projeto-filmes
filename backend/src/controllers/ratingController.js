const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const Filme = require('../models/Filme');

// Cria ou atualiza um rating para um filme (usuário autenticado)
exports.createOrUpdateRating = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { movie_id, value } = req.body;

    if (!movie_id || value == null) {
      return res.status(400).json({ message: 'movie_id e value são obrigatórios.' });
    }
    if (value < 1 || value > 10) {
      return res.status(400).json({ message: 'Valor de rating inválido. Deve estar entre 1 e 10.' });
    }

    let rating = await Rating.findOne({ user_id, movie_id });
    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      rating = new Rating({ user_id, movie_id, value });
      await rating.save();
    }

    const stats = await Rating.aggregate([
      { $match: { movie_id: mongoose.Types.ObjectId(movie_id) } },
      { $group: { _id: '$movie_id', avgRating: { $avg: '$value' } } }
    ]);
    const avgRating = (stats.length > 0) ? stats[0].avgRating : 0;
    await Filme.findByIdAndUpdate(movie_id, { averageRating: avgRating });

    res.json({ success: true, rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro do servidor ao criar/atualizar rating.' });
  }
};

// Calcula e retorna média e número de votos de um filme
exports.getMovieRating = async (req, res) => {
  try {
    const movie_id = req.params.id;
    const stats = await Rating.aggregate([
      { $match: { movie_id: mongoose.Types.ObjectId(movie_id) } },
      { $group: {
          _id: '$movie_id',
          averageRating: { $avg: '$value' },
          numRatings: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      res.json({
        averageRating: stats[0].averageRating,
        numRatings: stats[0].numRatings
      });
    } else {
      res.json({ averageRating: 0, numRatings: 0 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro do servidor ao obter rating.' });
  }
};