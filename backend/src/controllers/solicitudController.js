const solicitudService = require('../services/solicitudService');

async function createSolicitud(req, res) {
  try {
    const { id_tramite, data } = req.body;
    if (!id_tramite || !data) {
      return res.status(400).json({ message: 'id_tramite y data son obligatorios.' });
    }
    let parsedData;
    try {
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return res.status(400).json({ message: 'El campo data debe ser un JSON válido.' });
    }

    const result = await solicitudService.createSolicitud({
      idUsuario: req.user.id_usuario,
      idTramite: Number(id_tramite),
      data: parsedData,
      files: req.files || []
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error al crear solicitud.' });
  }
}

async function getMisTramites(req, res) {
  try {
    return res.json(await solicitudService.getMisTramites(req.user.id_usuario));
  } catch (_e) {
    return res.status(500).json({ message: 'Error al obtener trámites del usuario.' });
  }
}

async function getSolicitudDetail(req, res) {
  try {
    const detail = await solicitudService.getSolicitudDetail(Number(req.params.id), req.user);
    if (!detail) return res.status(404).json({ message: 'Solicitud no encontrada.' });
    return res.json(detail);
  } catch (_e) {
    return res.status(500).json({ message: 'Error al obtener detalle de la solicitud.' });
  }
}

async function listSolicitudesFuncionario(req, res) {
  try {
    return res.json(await solicitudService.getSolicitudesFuncionario(req.query));
  } catch (_e) {
    return res.status(500).json({ message: 'Error al listar solicitudes.' });
  }
}

async function aprobarSolicitud(req, res) {
  try {
    return res.json(await solicitudService.changeSolicitudStatus({
      idSolicitud: Number(req.params.id),
      idFuncionario: req.user.id_usuario,
      nuevoEstado: 'APROBADO',
      comentario: req.body.comentario || 'Solicitud aprobada.'
    }));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function rechazarSolicitud(req, res) {
  try {
    return res.json(await solicitudService.changeSolicitudStatus({
      idSolicitud: Number(req.params.id),
      idFuncionario: req.user.id_usuario,
      nuevoEstado: 'RECHAZADO',
      comentario: req.body.comentario || 'Solicitud rechazada.'
    }));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function observarSolicitud(req, res) {
  try {
    return res.json(await solicitudService.changeSolicitudStatus({
      idSolicitud: Number(req.params.id),
      idFuncionario: req.user.id_usuario,
      nuevoEstado: 'OBSERVADO',
      comentario: req.body.comentario || 'Solicitud observada.'
    }));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createSolicitud,
  getMisTramites,
  getSolicitudDetail,
  listSolicitudesFuncionario,
  aprobarSolicitud,
  rechazarSolicitud,
  observarSolicitud
};
