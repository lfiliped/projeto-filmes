const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Regista um novo utilizador.
 * Rota: POST /api/register
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já está em uso' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };
    return res.status(201).json({ message: 'Utilizador registado com sucesso', user: userResponse });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}

/**
 * Autentica um utilizador e devolve um token JWT.
 * Rota: POST /api/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}

/**
 * Devolve os dados do utilizador autenticado.
 * Rota: GET /api/profile  (token JWT requerido)
 */
async function profile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}

module.exports = { register, login, profile };