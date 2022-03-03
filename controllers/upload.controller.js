const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const postFile = async (req, res = response) => {

    try {
        const filename = await uploadFile(req.files, undefined, 'images')

        res.json({
            filename
        })
    } catch (error) {
        res.status(400).json({ msg: error })
    }

}

const updateImage = async (req, res = response) => {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':

            model = await User.findById(id);
            if (!model) return res.status(400).json({ msg: 'No existe un usuario con ese ID' })

            break;
        case 'products':

            model = await Product.findById(id);
            if (!model) return res.status(400).json({ msg: 'No existe un producto con ese ID' })

            break;
        default:
            return res.statusCode(500).json({ msg: 'Esta ruta no es válida.' })
    }

    // Limpiar imagenes previas
    if (model.image) {
        const filePath = path.join(__dirname, '../uploads', collection, model.image)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }


    const filename = await uploadFile(req.files, undefined, collection)
    model.image = filename;
    await model.save();


    res.json(
        model
    )

}

const updateImageCloudinary = async (req, res = response) => {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':

            model = await User.findById(id);
            if (!model) return res.status(400).json({ msg: 'No existe un usuario con ese ID' })

            break;
        case 'products':

            model = await Product.findById(id);
            if (!model) return res.status(400).json({ msg: 'No existe un producto con ese ID' })

            break;
        default:
            return res.statusCode(500).json({ msg: 'Esta ruta no es válida.' })
    }

    // Limpiar imagenes previas
    if (model.image) {
        const splittedFilepath = model.image.split('/');
        const filename = splittedFilepath[splittedFilepath.length - 1];
        const [public_id, extension] = filename.split('.')
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

    model.image = secure_url;
    await model.save();


    res.json(
        model
    )

}

const getImage = async (req, res = response) => {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':

            model = await User.findById(id);
            if (!model) return res.status(400).json({ msg: 'No existe un usuario con ese ID' })

            break;
        case 'products':

            model = await Product.findById(id);
            if (!model) return res.status(400).json({ msg: 'No existe un producto con ese ID' })

            break;
        default:
            return res.statusCode(500).json({ msg: 'Esta ruta no es válida.' })
    }

    // Limpiar imagenes previas
    if (model.image) {
        const filePath = path.join(__dirname, '../uploads', collection, model.image)
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
    }

    const placeholder = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile(placeholder)
}

module.exports = {
    postFile,
    updateImage,
    getImage,
    updateImageCloudinary
}