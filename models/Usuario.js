const { request } = require("express");
const { Mongoose } = require("mongoose");

const {Schema, model} = require('mongoose');

const usuarioSchema = Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    nombre : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

module.exports = model('Usuario', usuarioSchema);
