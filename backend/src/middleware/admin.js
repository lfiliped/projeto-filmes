module.exports = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Necessário login' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }
    return next();
  };