const { response } = require("express")
const { Product, Category } = require("../models")

const getProducts = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { estado: true }

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .limit(Number(limit))
            .skip(Number(from))
    ])

    res.json({ total, products })
}

const getProduct = async (req, res = response) => {

    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    res.json(product)
}

const createProduct = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productInDb = await Product.findOne({ name: body.name.toUpperCase() })
    if (productInDb) {
        return res.status(400).json({
            msg: 'El producto ya existe.'
        })
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.authUser._id
    }

    const product = new Product(data);
    await product.save();
    res.json(product)
}

const updateProduct = async (req, res = response) => {

    const { id } = req.params;
    const { estado, user, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }
    data.user = req.authUser._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true })
    res.json(product)
}

const deleteProduct = async (req, res = response) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json(product)
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}