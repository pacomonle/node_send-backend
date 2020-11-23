const { response } = require('express');
const shortid = require('shortid');
// subida de archivos
const multer = require('multer');
const fs = require('fs');
const Enlace = require('../models/Enlace');




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

// descargar un archivo
exports.descargarArchivo = async(req, res = response, next) =>{
    console.log(req.params);
    const { archivo } = req.params;
    // obtener archivo
    const enlace = await Enlace.findOne({ nombre: archivo });

    const archivoDescarga = __dirname + '/../uploads/' + archivo

    res.download(archivoDescarga);

    // Eliminar el archivo y la entrada de la BD
    // Si las descargas son iguales a 1 - Borrar la entrada y borrar el archivo
    const { descargas, nombre } = enlace;

    if(descargas === 1) {

        // Eliminar el archivo 
        req.archivo = nombre;
        
        // eliminar la entrada de la bd
        await Enlace.findOneAndRemove(enlace.id);
        next()
    } else {
         // si las descargas son > a 1 - Restar 1
         enlace.descargas--;
         await enlace.save();
    }

    
}


