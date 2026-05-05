const express = require('express');
const controller = require('../controllers/tramiteController');
const router = express.Router();
router.get('/tramite/:idTramite', controller.getFormularioByTramite);
module.exports = router;
