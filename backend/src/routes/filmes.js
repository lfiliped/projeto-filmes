const express = require('express');
const router = express.Router();
const Filme = require('../models/Filme');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

// GET /api/filmes (lista de filmes com filtros)
router.get('/', async (req, res) => {
  try {
    const { search, year, genre, minRating, sort, page = 1, limit = 12 } = req.query;
    const query = {};

    // Filtros
    if (search) query.title = { $regex: search, $options: 'i' }; // Busca por título (case-insensitive)
    if (year) query.year = parseInt(year); // Filtro por ano
    if (genre) query.genres = genre; // Filtro por gênero
    if (minRating) query['imdb.rating'] = { $gte: parseFloat(minRating) }; // Filtro por nota mínima

    // Ignorar filmes com nota 0 ou ausente quando ordenar por rating
    if (sort === 'rating') {
      query['imdb.rating'] = { $gt: 0 }; // Exclui filmes com nota 0 ou ausente
    }

    // Ignorar filmes sem ano (nulo, 0 ou ausente) quando ordenar por year
    if (sort === 'year') {
      query.year = { $gt: 0, $exists: true }; // Exclui filmes com ano 0, nulo ou ausente
    }

    const sortOption = {};
    if (sort === 'rating') sortOption['imdb.rating'] = -1; // Ordenar por nota (descendente)
    else if (sort === 'title') sortOption.title = 1; // Ordenar por título (ascendente)
    else sortOption.year = -1; // Ordenar por ano (descendente)

    console.log('Query:', query, 'Sort:', sortOption, 'Page:', page, 'Limit:', limit);

    const filmes = await Filme.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Filme.countDocuments(query);

    console.log('Filmes encontrados:', filmes.length, 'Total:', total);

    res.json({ data: filmes, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Erro ao buscar filmes:', err);
    res.status(500).json({ message: 'Erro ao buscar filmes' });
  }
});

// GET /api/filmes/:id (detalhes de um filme específico, incluindo comentários)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Buscando filme com ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('ID inválido:', id);
      return res.status(400).json({ message: 'ID inválido' });
    }

    const filme = await Filme.findById(id);
    if (!filme) {
      console.log('Filme não encontrado para ID:', id);
      return res.status(404).json({ message: 'Filme não encontrado' });
    }

    const comentarios = await Comment.find({ movie_id: id }).populate('user_id', '_id name');

    res.json({ filme, comentarios });
  } catch (err) {
    console.error('Erro ao buscar filme ou comentários:', err);
    res.status(500).json({ message: 'Erro ao buscar filme ou comentários' });
  }
});

module.exports = router;