const { response } = require('express');
const Enlace = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async(req, res=response, next)=>{
// revisar errores
    const errores = validationResult( req );
    if ( !errores.isEmpty() ) {
        res.status(400).json({
            ok: false,
            errors: errores.array()
        });
        return next()
    }

// crear un objeto del model Enlace
    // console.log(req.body);
    const { nombre_original, nombre } = req.body;

    const enlace = new Enlace();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;
   

// si el usuario esta autenticado
    if(req.usuario){
        const {descargas, password} = req.body;

        // asignar un password a enlace
        if(password){
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        // asignar a enlace el numero de descargas
        if(descargas){
            enlace.descargas= descargas;
        }

        // asignar author a enlace
        enlace.author = req.usuario.id;
    } 

// Guardar enlace en la base de datos
    try {
        await enlace.save();
        res.json({
            ok: true,
            msg:`${enlace.url}`,
            enlace
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg:'no se ha podido crear el enlace, hable con el administrador'
        })
    }
  
}

// Obtener el enelace
exports.obtenerEnlace = async(req, res = response, next)=> {
   // console.log(req.params.url)
    const { url } = req.params;
// verificar si existe en enlace
    const enlace = await Enlace.findOne({ url });

   // console.log(enlace)
   if(!enlace){
       res.status(404).json({
           ok: false,
           msg: 'no hay ningun enlace con esa url'
       })
       return next();
   }

// si existe en enlace
   res.json({
       ok: true,
       archivo: enlace.nombre,
       password: false
   })

 
}

// listar enlaces
exports.listarEnlaces = async(req, res = response, next) => {
    try {
        const enlaces = await Enlace.find({}).select('url -_id');
        res.json({
            ok: true,
            msg:'Listado de enlaces',
            enlaces
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg:'no se ha podido crear el listado de enlaces, hable con el administrador'
        })
    }
}

// retorna si el enlace tiene password o no
exports.tienePassword = async(req, res = response, next) =>{
 // console.log(req.params.url)
 const { url } = req.params;
 // verificar si existe en enlace
     const enlace = await Enlace.findOne({ url });
    // console.log(enlace)

 // comprobar si existe en enlace 
    if(!enlace){
        res.status(404).json({
            ok: false,
            msg: 'no hay ningun enlace con esa url'
        })
        return next();
    }
 
 // comprobar si exite password

    if(enlace.password){
       return res.json({
            ok: true,
            archivo: enlace.nombre,
            password: true
           }) 
    }

    next();
    
 }

 // verificar si el password es correcto
 exports.verificarPassword = async(req, res = response, next) => {
    const { url } = req.params;
    const { password} = req.body;
    // console.log(url, password)

    // Consultar por el enlace
    const enlace = await Enlace.findOne({ url });
    // console.log(enlace)
   
        // Verificar el password
        if(bcrypt.compareSync( password, enlace.password )) {
            // Permitirle al usuario descargar el archivo
            next();
        } else {
            return res.status(401).json({
                ok: false,
                msg: 'Password Incorrecto'
            })
        }
 }
