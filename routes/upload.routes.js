const { Router } = require('express');
const { check } = require('express-validator');
const { postFile, updateImageCloudinary, getImage } = require('../controllers/upload.controller');
const { allowedCollections } = require('../helpers');
const { validateFields, validateFiles } = require('../middlewares');

const router = Router();


router.post('/', [
    validateFiles,
    validateFields
], postFile);

router.put('/:collection/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFiles,
    validateFields
], updateImageCloudinary)

router.get('/:collection/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], getImage)

module.exports = router;