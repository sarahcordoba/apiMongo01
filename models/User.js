const mongoose = require('mongoose')

// model of the Users attributes
let UserSchema = new mongoose.Schema({
    id: Number,
    nombre: String,
    apellidos: String,
    correo: String,
    telefono: String,
    password: String
})


module.exports = mongoose.model('usuario', UserSchema, 'usuario');