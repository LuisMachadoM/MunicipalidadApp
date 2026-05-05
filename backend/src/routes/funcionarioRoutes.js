const express = require('express');
const controller = require('../controllers/solicitudController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticate, authorize('FUNCIONARIO'));
router.get('/solicitudes', controller.listSolicitudesFuncionario);
router.put('/solicitudes/:id/aprobar', controller.aprobarSolicitud);
router.put('/solicitudes/:id/rechazar', controller.rechazarSolicitud);
router.put('/solicitudes/:id/observar', controller.observarSolicitud);

module.exports = router;
