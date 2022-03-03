const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { User, Category, Product } = require("../models");

const collections = [
    'users',
    'categories',
    'products',
];

const searchUsers = async (query = '', res = response) => {

    const isMongoId = isValidObjectId(query);

    if (isMongoId) {
        const user = await User.findById(query);
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regex = new RegExp(query, 'i')
    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: users
    })

}

const searchCategories = async (query, res) => {

    const isMongoId = isValidObjectId(query);

    if (isMongoId) {
        const category = await Category.findById(query);
        return res.json({
            results: (category) ? [category] : []
        })
    }

    const regex = new RegExp(query, 'i');
    const categories = await Category.find({ name: regex, estado: true })

    res.json({
        results: categories
    })
}

const searchProducts = async (query, res) => {
    const isMongoId = isValidObjectId(query);

    if (isMongoId) {
        const product = await Product.findById(query).populate('category', 'name');
        return res.json({
            results: (product) ? [product] : []
        })
    }

    const regex = new RegExp(query, 'i');
    const products = await Product.find({ name: regex }).populate('category', 'name')

    res.json({
        results: products
    })
}

const search = (req, res = response) => {

    const { collection, query } = req.params;

    if (!collections.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${collections}`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers(query, res);
            break;
        case 'categories':
            searchCategories(query, res);
            break;
        case 'products':
            searchProducts(query, res);
            break;
        default:
            res.status(500).json({
                msg: 'Esta busqueda no está disponible.'
            })
    }

}

module.exports = {
    search
}