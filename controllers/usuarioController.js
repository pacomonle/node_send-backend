const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoUsuario = async(req, res = response)=>{
    // validaciones : mensajes de error
    const errores = validationResult( req );
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.array()
        });
    }

// Verificar si el usuario ya esta registrado
   // console.log(req.body);
    const { email, password } = req.body;
    
    let usuario = await Usuario.findOne({email});
    
    if(usuario){
        return res.status(400).json({
            ok: true,
            msg:'el usuario ya esta registrado'
        })
    }

   // crear nuevo usuario 
   usuario = new Usuario(req.body);
   
   // hashear el password antes de hacer el save
   const salt = await bcrypt.genSalt(10);
   usuario.password = await bcrypt.hash(password, salt);

   try {
    await usuario.save();

    res.json({
        ok: true,
        usuario,
        msg: 'usuario creado correctamente' 
    })
   } catch (error) {

    res.json({
        ok: false,
        error,
        msg: 'No ha podido crearse el usuario, hable ocn el administrador' 
    })
   }
    
}