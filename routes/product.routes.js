const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, getProduct, createProduct, deleteProduct, updateProduct } = require('../controllers/product.controller');
const { productExists, categoryExists } = require('../helpers/db-validators');
const { validateJWT, validateFields, isAdmin } = require('../middlewares');


const router = Router();

router.get('/', getProducts)

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExists),
    validateFields
], getProduct)

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un ID válido').isMongoId(),
    check('category', 'No es un ID válido').custom(categoryExists),
    validateFields
], createProduct)

router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExists),
    validateFields
], updateProduct)

router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExists),
    validateFields
], deleteProduct)

module.exports = router