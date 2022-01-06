const { response } = require('express')

const usuariosGet = (req, res = response) => {

    const { nombre,
        apellido = 'Sin apellido' } = req.query;

    res.json({
        msg: 'petición GET -> USERS',
        nombre,
        apellido
    })
}

const usuariosPost = (req, res = response) => {
    const { name, email } = req.body;

    res.json({
        msg: 'petición POST -> USERS',
        name,
        email
    })
}

const usuariosPut = (req, res) => {
    const id = req.params.id;

    res.json({
        msg: 'peticion PUT -> USERS',
        id
    })
};

const usuariosPatch = (req, res) => {
    res.json('peticion PATCH -> USERS')
};

const usuariosDelete = (req, res) => {
    res.json('peticion DELETE -> USERS')
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}