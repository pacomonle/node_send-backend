const mongoose = require('mongoose');
require('dotenv').config({path:'variables.env'});

// conexion data base
const conectarDB = async() =>{
    
    try {
        await mongoose.connect(process.env.DB_ENV, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('DB conectada');
    } catch (error) {
        console.log('Error en el servidor');
        console.log(error);
        process.exit(1); // detener el servidor
    }
}

module.exports = conectarDB;
