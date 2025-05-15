const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Filme = require('../models/Filme');
const authMiddleware = require('../middleware/auth');

// POST /api/comentarios
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Rota POST /api/comentarios chamada'); // Log para depuração
    const { text, movie_id } = req.body;
    const user = req.user; // Set by authMiddleware
    if (!text || !movie_id) {
      return res.status(400).json({ message: 'Texto e movie_id são obrigatórios' });
    }
    const filme = await Filme.findById(movie_id);
    if (!filme) {
      return res.status(404).json({ message: 'Filme não encontrado' });
    }
    const comment = new Comment({
      text,
      movie_id,
      user_id: user.id,
      date: new Date(),
    });
    await comment.save();
    const populatedComment = await Comment.findById(comment._id).populate('user_id', '_id name');
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error('Erro ao criar comentário:', err);
    res.status(500).json({ message: 'Erro ao criar comentário' });
  }
});

// PUT /api/comentarios/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Rota PUT /api/comentarios/:id chamada'); // Log para depuração
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }
    if (comment.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );
    const populatedComment = await Comment.findById(updatedComment._id).populate('user_id', '_id name');
    res.json(populatedComment);
  } catch (err) {
    console.error('Erro ao editar comentário:', err);
    res.status(500).json({ message: 'Erro ao editar comentário' });
  }
});

// DELETE /api/comentarios/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Rota DELETE /api/comentarios/:id chamada'); // Log para depuração
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }
    if (comment.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    await comment.deleteOne();
    res.json({ message: 'Comentário excluído' });
  } catch (err) {
    console.error('Erro ao excluir comentário:', err);
    res.status(500).json({ message: 'Erro ao excluir comentário' });
  }
});

module.exports = router;