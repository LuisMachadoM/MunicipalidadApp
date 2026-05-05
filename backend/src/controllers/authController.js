const authService = require('../services/authService');

async function register(req, res) {
  try {
    const { nombre, apellido, rut, correo, password } = req.body;
    if (!nombre || !apellido || !rut || !correo || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }
    const result = await authService.registerCitizen({ nombre, apellido, rut, correo, password });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }
    const result = await authService.login({ correo, password });
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

module.exports = { register, login };
