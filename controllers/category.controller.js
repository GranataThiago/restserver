const { response } = require("express");
const { Category } = require("../models");

// obtenerCategorias - paginado - total - populate
const getCategories = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { estado: true }

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .limit(Number(limit))
            .skip(Number(from))
    ]);

    res.json({ total, categories });
}

// obtenerCategoria - pupulate {}

const getCategory = async (req, res = response) => {

    const { id } = req.params;

    const category = await Category.findById(id).populate('user')

    res.json(category)
}


const createCategory = async (req, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoryInDb = await Category.findOne({ name });

    if (categoryInDb) {
        return res.status(400).json({
            msg: `La categoria ${categoryInDb.name} ya existe`
        })
    }

    const data = {
        name,
        user: req.authUser._id
    }

    const category = new Category(data);
    await category.save();

    res.status(201).json(category)
}

// actualizarCategoria
const updateCategory = async (req, res) => {

    const { estado, user, ...data } = req.body;
    data.name = data.name.toUpperCase();
    data.user = req.authUser._id;

    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, data, { new: true })

    res.json(category)
}


// borrarCategoria - cambiar estado
const deleteCategory = async (req, res) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json(category)
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}