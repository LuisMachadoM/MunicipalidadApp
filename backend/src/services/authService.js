const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { signToken } = require('../utils/jwt');

async function registerCitizen({ nombre, apellido, rut, correo, password }) {
  const [existing] = await pool.query(
    'SELECT id_usuario FROM usuarios WHERE correo = ? OR rut = ? LIMIT 1',
    [correo, rut]
  );
  if (existing.length > 0) throw new Error('Ya existe un usuario con ese correo o RUT.');

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO usuarios
      (nombre, apellido, rut, correo, password_hash, tipo_usuario, estado_usuario)
     VALUES (?, ?, ?, ?, ?, 'CIUDADANO', 'ACTIVO')`,
    [nombre, apellido, rut, correo, passwordHash]
  );

  return {
    user: { id_usuario: result.insertId, nombre, apellido, correo, tipo_usuario: 'CIUDADANO' },
    token: signToken({ id_usuario: result.insertId, tipo_usuario: 'CIUDADANO', correo })
  };
}

async function login({ correo, password }) {
  const [rows] = await pool.query(
    `SELECT id_usuario, nombre, apellido, correo, password_hash, tipo_usuario, estado_usuario
     FROM usuarios WHERE correo = ? LIMIT 1`,
    [correo]
  );
  if (rows.length === 0) throw new Error('Credenciales inválidas.');
  const user = rows[0];
  if (user.estado_usuario !== 'ACTIVO') throw new Error('Usuario no activo.');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('Credenciales inválidas.');

  return {
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      tipo_usuario: user.tipo_usuario
    },
    token: signToken({ id_usuario: user.id_usuario, tipo_usuario: user.tipo_usuario, correo: user.correo })
  };
}

module.exports = { registerCitizen, login };
