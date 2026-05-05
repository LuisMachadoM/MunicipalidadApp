const pool = require('../config/db');

async function createSolicitud({ idUsuario, idTramite, data, files }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO solicitudes (id_usuario, id_tramite, estado_actual, observacion_general)
       VALUES (?, ?, 'PENDIENTE', 'Solicitud ingresada correctamente.')`,
      [idUsuario, idTramite]
    );

    const idSolicitud = result.insertId;

    await connection.query(
      `INSERT INTO historial_estado (id_solicitud, estado_anterior, estado_nuevo, id_funcionario)
       VALUES (?, NULL, 'PENDIENTE', NULL)`,
      [idSolicitud]
    );

    for (const item of data) {
      let valorArchivo = null;
      if (item.archivoKey) {
        const foundFile = (files || []).find((f) => f.fieldname === item.archivoKey);
        if (foundFile) {
          valorArchivo = foundFile.path;
          await connection.query(
            `INSERT INTO documentos_adjuntos
             (id_solicitud, nombre_archivo, ruta_archivo, tipo_documento, cargado_por)
             VALUES (?, ?, ?, 'ANTECEDENTE', 'CIUDADANO')`,
            [idSolicitud, foundFile.originalname, foundFile.path]
          );
        }
      }

      await connection.query(
        `INSERT INTO respuestas_formulario
         (id_solicitud, id_campo, valor_texto, valor_numero, valor_fecha, valor_archivo)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          idSolicitud,
          Number(item.id_campo),
          item.valor_texto ?? null,
          item.valor_numero ?? null,
          item.valor_fecha ?? null,
          valorArchivo ?? item.valor_archivo ?? null
        ]
      );
    }

    await connection.commit();
    return { id_solicitud: idSolicitud };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getMisTramites(idUsuario) {
  const [rows] = await pool.query(
    `SELECT s.id_solicitud, s.fecha_ingreso, s.estado_actual, s.observacion_general,
            t.id_tramite, t.nombre_tramite
     FROM solicitudes s
     INNER JOIN tramites t ON t.id_tramite = s.id_tramite
     WHERE s.id_usuario = ?
     ORDER BY s.fecha_ingreso DESC`,
    [idUsuario]
  );
  return rows;
}

async function getSolicitudDetail(idSolicitud, user) {
  const params = [idSolicitud];
  let whereExtra = '';
  if (user.tipo_usuario === 'CIUDADANO') {
    whereExtra = ' AND s.id_usuario = ?';
    params.push(user.id_usuario);
  }

  const [solicitudes] = await pool.query(
    `SELECT s.id_solicitud, s.fecha_ingreso, s.estado_actual, s.observacion_general,
            t.id_tramite, t.nombre_tramite, u.id_usuario, u.nombre, u.apellido, u.correo
     FROM solicitudes s
     INNER JOIN tramites t ON t.id_tramite = s.id_tramite
     INNER JOIN usuarios u ON u.id_usuario = s.id_usuario
     WHERE s.id_solicitud = ? ${whereExtra}
     LIMIT 1`,
    params
  );
  if (solicitudes.length === 0) return null;

  const solicitud = solicitudes[0];

  const [respuestas] = await pool.query(
    `SELECT rf.id_respuesta_formulario, rf.id_campo, cf.nombre_campo, cf.etiqueta, cf.tipo_campo,
            rf.valor_texto, rf.valor_numero, rf.valor_fecha, rf.valor_archivo
     FROM respuestas_formulario rf
     INNER JOIN campos_formulario cf ON cf.id_campo = rf.id_campo
     WHERE rf.id_solicitud = ?
     ORDER BY rf.id_respuesta_formulario ASC`,
    [idSolicitud]
  );

  const [documentos] = await pool.query(
    `SELECT id_documento, nombre_archivo, ruta_archivo, tipo_documento, cargado_por, fecha_carga
     FROM documentos_adjuntos WHERE id_solicitud = ?
     ORDER BY fecha_carga ASC`,
    [idSolicitud]
  );

  const [historial] = await pool.query(
    `SELECT h.id_historial, h.estado_anterior, h.estado_nuevo, h.fecha_cambio,
            u.nombre AS funcionario_nombre, u.apellido AS funcionario_apellido
     FROM historial_estado h
     LEFT JOIN usuarios u ON u.id_usuario = h.id_funcionario
     WHERE h.id_solicitud = ?
     ORDER BY h.fecha_cambio ASC`,
    [idSolicitud]
  );

  solicitud.respuestas_formulario = respuestas;
  solicitud.documentos = documentos;
  solicitud.historial = historial;
  return solicitud;
}

async function getSolicitudesFuncionario(filters = {}) {
  const conditions = [];
  const values = [];
  if (filters.estado_actual) {
    conditions.push('s.estado_actual = ?');
    values.push(filters.estado_actual);
  }
  if (filters.id_tramite) {
    conditions.push('s.id_tramite = ?');
    values.push(filters.id_tramite);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT s.id_solicitud, s.fecha_ingreso, s.estado_actual,
            u.nombre, u.apellido, u.correo, t.nombre_tramite
     FROM solicitudes s
     INNER JOIN usuarios u ON u.id_usuario = s.id_usuario
     INNER JOIN tramites t ON t.id_tramite = s.id_tramite
     ${where}
     ORDER BY s.fecha_ingreso DESC`,
    values
  );
  return rows;
}

async function changeSolicitudStatus({ idSolicitud, idFuncionario, nuevoEstado, comentario }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT estado_actual FROM solicitudes WHERE id_solicitud = ? LIMIT 1`,
      [idSolicitud]
    );
    if (rows.length === 0) throw new Error('Solicitud no encontrada.');

    const estadoAnterior = rows[0].estado_actual;
    await connection.query(
      `UPDATE solicitudes SET estado_actual = ?, observacion_general = ? WHERE id_solicitud = ?`,
      [nuevoEstado, comentario ?? null, idSolicitud]
    );

    let accion = 'RESPUESTA';
    if (nuevoEstado === 'APROBADO') accion = 'APROBACION';
    if (nuevoEstado === 'RECHAZADO') accion = 'RECHAZO';
    if (nuevoEstado === 'OBSERVADO') accion = 'OBSERVACION';

    await connection.query(
      `INSERT INTO respuestas_solicitud
       (id_solicitud, id_funcionario, accion_realizada, comentario)
       VALUES (?, ?, ?, ?)`,
      [idSolicitud, idFuncionario, accion, comentario ?? null]
    );

    await connection.query(
      `INSERT INTO historial_estado
       (id_solicitud, estado_anterior, estado_nuevo, id_funcionario)
       VALUES (?, ?, ?, ?)`,
      [idSolicitud, estadoAnterior, nuevoEstado, idFuncionario]
    );

    await connection.commit();
    return { id_solicitud: idSolicitud, estado_anterior: estadoAnterior, estado_nuevo: nuevoEstado };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createSolicitud,
  getMisTramites,
  getSolicitudDetail,
  getSolicitudesFuncionario,
  changeSolicitudStatus
};
