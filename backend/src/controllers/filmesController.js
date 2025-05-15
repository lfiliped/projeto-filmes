const Filme = require('../models/Filme');
const Comentario = require('../models/Comentario');

// GET /api/filmes?page=x&limit=y&search=s&year=y&genre=g&minRating=r&sort=s
exports.getFilmes = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, year, genre, minRating, sort } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (year) {
      query.year = year;
    }
    if (genre) {
      query.genres = genre;
    }
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'year':
          sortOption = { year: -1 };
          break;
        case 'rating':
          sortOption = { averageRating: -1 };
          break;
        case 'title':
          sortOption = { title: 1 };
          break;
        default:
          sortOption = { year: -1 };
      }
    } else {
      sortOption = { year: -1 };
    }

    const [filmes, total] = await Promise.all([
      Filme.find(query).select('title year director poster plot averageRating').sort(sortOption).skip(skip).limit(parseInt(limit)),
      Filme.countDocuments(query)
    ]);

    res.json({ data: filmes, page, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter filmes.' });
  }
};

// GET /api/filmes/:id
exports.getFilmeById = async (req, res) => {
  try {
    const filme = await Filme.findById(req.params.id);
    if (!filme) return res.status(404).json({ message: 'Filme não encontrado.' });

    const comentarios = await Comentario.find({ movie_id: filme._id }).populate('user_id', 'name').sort({ date: -1 });
    res.json({ filme, comentarios });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter o filme.' });
  }
};

// POST /api/filmes
exports.createFilme = async (req, res) => {
  try {
    const novo = await Filme.create(req.body);
    res.status(201).json(novo);
  } catch {
    res.status(400).json({ message: 'Erro ao criar o filme.' });
  }
};

// PUT /api/filmes/:id
exports.updateFilme = async (req, res) => {
  try {
    const atualizado = await Filme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ message: 'Filme não encontrado.' });
    res.json(atualizado);
  } catch {
    res.status(400).json({ message: 'Erro ao atualizar o filme.' });
  }
};

// DELETE /api/filmes/:id
exports.deleteFilme = async (req, res) => {
  try {
    const removido = await Filme.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ message: 'Filme não encontrado.' });
    await Comentario.deleteMany({ movie_id: req.params.id });
    res.json({ message: 'Filme e comentários eliminados.' });
  } catch {
    res.status(500).json({ message: 'Erro ao eliminar o filme.' });
  }
};