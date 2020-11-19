const {Schema, model} = require('mongoose');
const Usuario = require('./Usuario');

const enlaceSchema = new Schema({

    url : {
        type: String,
        required: true
    },
    nombre : {
        type: String,
        required: true
    },
    nombre_original : {
        type: String,
        required: true
    },
    descargas:{
        type: Number,
        default: 1
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: Usuario,
        default: null
    },
    password:{
        type: String,
        default: null
    },
    creado:{
        type: Date,
        default: Date.now()
    }

});




module.exports = model('Enlace', enlaceSchema);