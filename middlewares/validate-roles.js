const { response, request } = require("express")


const isAdmin = (req = request, res = response, next) => {

    if (!req.authUser) {
        return res.status(500).json({
            msg: 'No hay un token existente para verificar el rol'
        })
    }

    const { name, role } = req.authUser

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `El usuario ${name} no es administrador`
        })
    }

    next();
}

const hasRole = (...roles) => {

    return (req = request, res = response, next) => {

        if (!req.authUser) {
            return res.status(500).json({
                msg: 'No hay un token existente para verificar el rol'
            })
        }

        if (!roles.includes(req.authUser.role)) {
            return res.status(401).json({
                msg: 'El servicio requiere un rol de mayor nivel'
            })
        }

        next();
    }
}

module.exports = {
    isAdmin,
    hasRole
}