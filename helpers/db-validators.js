const { Category, Product } = require('../models')
const Role = require('../models/role')
const User = require('../models/user')

const isRoleValid = async (role = '') => {
    const roleExists = await Role.findOne({ role })
    if (!roleExists) {
        throw new Error(`El rol ${role} no está registrado en la base de datos`)
    }
}

const isEmailRegistered = async (email = '') => {
    const isEmailTaken = await User.findOne({ email });
    if (isEmailTaken) {
        throw new Error('El mail ya está tomado')
    }
}

const isUserValid = async (id) => {
    const userExists = await User.findById(id);
    if (!userExists) {
        throw new Error('El usuario no existe')
    }
}

const categoryExists = async (id) => {

    const categoryExists = await Category.findById(id);
    if (!categoryExists) {
        throw new Error('La categoria no existe')
    }

}

const productExists = async (id) => {

    const productExists = await Product.findById(id);
    if (!productExists) {
        throw new Error('El producto no existe')
    }

}

module.exports = {
    isRoleValid,
    isEmailRegistered,
    isUserValid,
    categoryExists,
    productExists
}