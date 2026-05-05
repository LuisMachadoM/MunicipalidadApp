const express = require('express');
const controller = require('../controllers/tramiteController');
const router = express.Router();
router.get('/', controller.getTramites);
router.get('/:id', controller.getTramiteById);
module.exports = router;
