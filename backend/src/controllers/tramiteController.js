const tramiteService = require('../services/tramiteService');

async function getTramites(_req, res) {
  try {
    return res.json(await tramiteService.getTramites());
  } catch (_e) {
    return res.status(500).json({ message: 'Error al obtener trámites.' });
  }
}

async function getTramiteById(req, res) {
  try {
    const tramite = await tramiteService.getTramiteById(req.params.id);
    if (!tramite) return res.status(404).json({ message: 'Trámite no encontrado.' });
    return res.json(tramite);
  } catch (_e) {
    return res.status(500).json({ message: 'Error al obtener trámite.' });
  }
}

async function getFormularioByTramite(req, res) {
  try {
    const formulario = await tramiteService.getFormularioByTramite(req.params.idTramite);
    if (!formulario) return res.status(404).json({ message: 'Formulario no encontrado para este trámite.' });
    return res.json(formulario);
  } catch (_e) {
    return res.status(500).json({ message: 'Error al obtener formulario.' });
  }
}

module.exports = { getTramites, getTramiteById, getFormularioByTramite };
