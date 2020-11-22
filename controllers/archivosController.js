const { response, application } = require('express');
const shortid = require('shortid');
// subida de archivos
const multer = require('multer');
const fs = require('fs');




exports.subirArchivo = async(req, res = response, next) =>{

    const configuracionMulter = {
        limits: { fileSize: req.usuario? 1024 * 1024 * 10 : 1024 * 1024  },  // 1 mega para usuarios sin cuenta
        storage: fileSotrage = multer.diskStorage({
            destination: (req, file, callback) =>{
                callback(null, __dirname + '/../uploads') // el primer parametro es el error
            },
            filename: (req, file, callback)=>{
                
               // const extension = file.mimetype.split('/')[1];
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                callback(null, `${shortid.generate()}${extension}`);
            },
            fileFilter: (req, file, callback)=>{
                if(file.mimetype === "application/pdf"){
                    return callback(null, true); //  NO aceptamos PDF
                }
            }
        })
    };


    const upload = multer(configuracionMulter).single('archivo');



    upload(req, res, async(error) =>{
        console.log(req.file)
        if(!error){
            res.json({
                ok: true,
                msg: 'archivo subido correctamente',
                archivo: req.file.filename
            })
            return next();
        }else{
            res.json({
                ok: false,
                msg: 'archivo NO se ha subido correctamente',
                error
            })
            console.log(error)
            return next();
        }
    })
    
}

exports.eliminarArchivo = async(req, res = response) =>{
   // console.log('desde eliminar archivo', req.archivo)
    try {
        fs.unlinkSync( __dirname + `/../uploads/${req.archivo}`);
        console.log('archivo eliminado');
    } catch (error) {
        console.log(error);
    }
}


