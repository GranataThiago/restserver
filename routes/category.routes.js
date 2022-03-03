const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { validateJWT, validateFields, isAdmin } = require('../middlewares');
const { categoryExists } = require('../helpers/db-validators');

const router = Router();

// Validar ID con middleware personalizado

// Obtener todas las categorias - Publico.
router.get('/', getCategories)

// Obtener UNA categoria por ID - Publico.
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], getCategory)

// Crear categoria - privado (cualquiera con token)
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], createCategory)

// Actualizar - privado (cualquiera con token)
router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryExists),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], updateCategory)

// Borrar una ctegoria - Admin (estado)
router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], deleteCategory)

module.exports = router