const bcrypt = require("bcryptjs");
const { response } = require("express");
const { generateJWT } = require("../helpers/generate-jwt");
const User = require("../models/user");

const loginPost = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                msg: 'El usuario o contraseña no es correcto'
            })
        }

        if (!user.estado) {
            return res.status(400).json({
                msg: 'El usuario o contraseña no es correcto'
            })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                msg: 'El usuario o contraseña no es correcto - contraseña'
            })
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Ups, algo salió mal...'
        })
    }
}

module.exports = {
    loginPost
}