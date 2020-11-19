const { response } = require("express");
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'variables.env'});
const { validationResult } = require('express-validator');

exports.autenticarUsuario = async(req, res = response, next)=>{
// validar y mensajes errores
     const errores = validationResult( req );
     if ( !errores.isEmpty() ) {
          res.status(400).json({
             ok: false,
             errors: errores.array()
         });
         return next()
     }


// Comprobar si el usuario ya esta registrado
    // console.log(req.body);
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    // console.log(usuario);
    if(!usuario){
       res.status(401).json({
            ok: true,
            msg: 'el usuario no existe',
        })
       return next();
    }
// Verificar password y autenticar al usuario   

    if(bcrypt.compareSync(password, usuario.password)){
       // crear JWT
        const token =  jwt.sign({
            id: usuario._id,
            nombre : usuario.nombre,
            email: usuario.email
        }, process.env.SECRETA , {
            expiresIn : '8h'
        } )
        res.json({
            ok: true,
            msg: 'autenticar usuario',
            token
        })
        return next();
    }else{
        res.status(401).json({
            ok: true,
            msg: 'fallo en tu autenticacion',
        });
        return next();
    }
  
}

exports.usuarioAutenticado = async(req , res = response, next)=>{

    const usuario = req.usuario;
    res.json({
        usuario
    })
  
}