const Comentario = require('../models/Comentario');
const Filme = require('../models/Filme');

// POST /api/comentarios   → criar novo comentário
exports.createComentario = async (req, res) => {
  try {
    const { text, movie_id } = req.body;
    const user_id = req.user.id;

    const filme = await Filme.findById(movie_id);
    if (!filme) {
      return res.status(404).json({ message: 'Filme não encontrado.' });
    }

    const novoComentario = new Comentario({ user_id, text, movie_id });
    const salvo = await novoComentario.save();
    const populated = await Comentario.findById(salvo._id).populate('user_id', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar comentário.' });
  }
};

// GET /api/comentarios                → todos comentários
exports.getComentarios = async (_req, res) => {
  try {
    const comentarios = await Comentario.find().limit(100).sort({ date: -1 }).populate('user_id', 'name');
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter comentários.' });
  }
};

// GET /api/comentarios/:id            → comentário por ID
exports.getComentarioById = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id).populate('user_id', 'name');
    if (!comentario) {
      return res.status(404).json({ message: 'Comentário não encontrado.' });
    }
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter comentário.' });
  }
};

// GET /api/comentarios/filme/:filmeId → comentários de um filme
exports.getComentariosByFilme = async (req, res) => {
  try {
    const comentarios = await Comentario.find({ movie_id: req.params.filmeId })
      .populate('user_id', 'name')
      .sort({ date: -1 });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter comentários do filme.' });
  }
};

// PUT /api/comentarios/:id            → actualizar
exports.updateComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentário não encontrado.' });
    }
    if (req.user.role !== 'admin' && comentario.user_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    const actualizado = await Comentario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao actualizar comentário.' });
  }
};

// DELETE /api/comentarios/:id         → apagar
exports.deleteComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentário não encontrado.' });
    }
    if (req.user.role !== 'admin' && comentario.user_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    await Comentario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comentário eliminado.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao eliminar comentário.' });
  }
};