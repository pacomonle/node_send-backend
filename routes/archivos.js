const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivosController');
const auth = require('../middlewares/auth');

/* // subida de archivos
const multer = require('multer');
// donde guardar los archivos
const upload = multer({dest: './uploads/'}); */

router.post('/',
auth,
// upload.single('archivo'), // sinlge - solo un archivo
archivosController.subirArchivo);

// No es necesario se le llama desde el router de enlaces ( se comunica con un next )
/* router.delete('/:id',
archivosController.eliminarArchivo
); */






module.exports = router;