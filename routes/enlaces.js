const express = require('express');
const router = express.Router();
const enlacesController = require('../controllers/enlacesController');
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
enlacesController.tienePassword,
enlacesController.obtenerEnlace
)

// listado de enlaces disponibles
router.get('/',
enlacesController.listarEnlaces
)

// verificar password
router.post('/:url', 
    enlacesController.verificarPassword,
    enlacesController.obtenerEnlace
);

module.exports = router;
