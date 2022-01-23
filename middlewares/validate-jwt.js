const { request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No existe un token válido en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.PRIVATEKEY);

        const authUser = await User.findById(uid);

        if (!authUser) {
            return res.status(401).json({
                msg: 'No existe un token válido en la petición'
            })
        }

        // Verificar que el usuario esté activo
        if (!authUser.estado) {
            return res.status(401).json({
                msg: 'No existe un token válido en la petición'
            })
        }

        req.authUser = authUser;

        next();

    } catch (error) {

        res.status(401).json({
            msg: 'No existe un token válido en la petición'
        })

    }

}

module.exports = {
    validateJWT
}