const validateFiles = (req, res, next) => {
    if (!req.files || !req.files.archivo || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: 'No se envió ningún archivo en la petición. Intenta subiendo algún archivo' });
    }

    next();
}

module.exports = {
    validateFiles
}