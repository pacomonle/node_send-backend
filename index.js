const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');



// crear servidor
const app = express();

// conectar a la Data Base
conectarDB();



// puerto de la app
const port = process.env.PORT || 4000;

/* 
const www = process.env.WWW || './';
app.use(express.static(www));
console.log(`serving ${www}`);
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});
 */

// CORS
const opcionesCors = {
    origin: process.env.FRONTEND_URL
};
app.use(cors(opcionesCors));

// leer y parseo valores del body
app.use(express.json());


 // Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));


// arrancar la app
console.log(`arrancando NodeSend: servidor en el puerto ${port}`);
app.listen(port,  () => console.log(`server listening on http://localhost:${port}`));
