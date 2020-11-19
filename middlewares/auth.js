const { response } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'variables.env'});


module.exports = (req, res = response, next)=>{
      // console.log(req.get('Authorization'));
      const authHeader = req.get('Authorization');

      if(authHeader){
          // Obtener y validar token
  
          try {
              const token = authHeader.split(' ')[1];
  
              const usuario = jwt.verify(token, process.env.SECRETA  )
              // console.log(usuario)
           
              req.usuario = usuario
              
          } catch (error) {
             console.log(error)
             console.log('token no valido')
              /* return res.status(400).json({
                  ok: false,
                  msg: 'token no valido',
                  error
              }) */
             
              
          }
          
      }
    return next();
}