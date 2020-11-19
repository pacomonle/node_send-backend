const express = require('express');
const router = express.Router();
const enlacesController = require('../controllers/enlacesController');
const archivosController = require('../controllers/archivosController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

router.post('/',
[
    check('nombre', 'sube un archivo').not().isEmpty(),
    check('nombre_original', 'sube un archivo').not().isEmpty()
],
auth,
enlacesController.nuevoEnlace
)

router.get('/:url',
enlacesController.obtenerEnlace,
archivosController.eliminarArchivo
)

module.exports = router;
