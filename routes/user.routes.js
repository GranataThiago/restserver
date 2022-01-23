const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/user.controller');
const { isRoleValid, isEmailRegistered, isUserValid } = require('../helpers/db-validators');

const { validateFields, validateJWT, hasRole } = require('../middlewares')

const router = Router();

router.get('/', usuariosGet)

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'El password debe tener mas de 6 caracteres').isLength({ min: 6 }),
    check('role').custom(isRoleValid),
    check('email').custom(isEmailRegistered),
    validateFields
], usuariosPost)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isUserValid),
    check('role').custom(isRoleValid),
    validateFields
], usuariosPut)

router.patch('/', usuariosPatch)

router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(isUserValid),
    validateFields
], usuariosDelete)


module.exports = router;