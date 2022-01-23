const { response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user');

const usuariosGet = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query;

    const [total, users] = await Promise.all([
        User.countDocuments({ estado: true }),
        User.find({ estado: true })
            .limit(Number(limit))
            .skip(Number(from))
    ]);

    res.json({ total, users });
}

const usuariosPost = async (req, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Hashear la contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    res.json({
        user
    })
}

const usuariosPut = async (req, res) => {
    const { id } = req.params
    const { _id, password, google, ...rest } = req.body

    if (password) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest)

    res.json(user)
};

const usuariosPatch = (req, res) => {
    res.json('peticion PATCH -> USERS')
};

const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { estado: false })


    res.json(user)
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}