const { Router } = require('express');
const { check } = require('express-validator');
const { loginPost, googleSignIn } = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], loginPost)

router.post('/google', [
    check('id_token', 'id_token es obligatorio').not().isEmpty(),
    validateFields
], googleSignIn)

module.exports = router