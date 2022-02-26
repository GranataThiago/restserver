const bcrypt = require("bcryptjs");
const { response } = require("express");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");
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

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { name, picture, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });
        if (!user) {

            const data = {
                name,
                email,
                password: ':)',
                picture,
                google: true,
                role: 'USER_ROLE'
            };

            user = new User(data);

            await user.save();
        }

        if (!user.estado) {
            return res.status(401).json({
                msg: 'Este usuario está bloqueado'
            })
        }

        const token = await generateJWT(user.id)

        res.json({
            user,
            token
        })
    } catch (err) {
        res.status(400).json({
            msg: 'El token no se pudo verificar',
            err
        })
    }

}

module.exports = {
    loginPost,
    googleSignIn,
}