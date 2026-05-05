const express = require('express');
const controller = require('../controllers/solicitudController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/', authenticate, authorize('CIUDADANO'), upload.any(), controller.createSolicitud);
router.get('/mis-tramites', authenticate, authorize('CIUDADANO'), controller.getMisTramites);
router.get('/:id', authenticate, controller.getSolicitudDetail);

module.exports = router;
