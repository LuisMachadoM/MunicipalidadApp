const pool = require('../config/db');

async function getTramites() {
  const [rows] = await pool.query(
    `SELECT id_tramite, nombre_tramite, descripcion, estado_publicacion, fecha_creacion
     FROM tramites WHERE estado_publicacion = 'PUBLICADO'
     ORDER BY nombre_tramite ASC`
  );
  return rows;
}

async function getTramiteById(id) {
  const [rows] = await pool.query(
    `SELECT id_tramite, nombre_tramite, descripcion, estado_publicacion, fecha_creacion
     FROM tramites WHERE id_tramite = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getFormularioByTramite(idTramite) {
  const [formularios] = await pool.query(
    `SELECT id_formulario, id_tramite, nombre_formulario, descripcion_formulario, fecha_creacion
     FROM formularios WHERE id_tramite = ?`,
    [idTramite]
  );
  if (formularios.length === 0) return null;
  const formulario = formularios[0];
  const [campos] = await pool.query(
    `SELECT id_campo, id_formulario, nombre_campo, etiqueta, tipo_campo, obligatorio, placeholder, orden_visualizacion, activo
     FROM campos_formulario
     WHERE id_formulario = ? AND activo = TRUE
     ORDER BY orden_visualizacion ASC`,
    [formulario.id_formulario]
  );
  formulario.campos = campos;
  return formulario;
}

module.exports = { getTramites, getTramiteById, getFormularioByTramite };
