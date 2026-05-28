const express = require('express');

const validateId = require('../middlewares/validateId');
const validateRequiredFields = require('../middlewares/validateRequiredFields');
const validateEmail = require('../middlewares/validateEmail');
const validateUsuario = require('../middlewares/validateUsuario');

const usuarioOposicionRoutes = require('./usuarioOposicionRoutes');

const router = express.Router();


const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
} = require('../controllers/usuarioController');

router.get('/', getUsuarios);

router.get('/:id', validateId, getUsuarioById);

router.post(
    '/',
    validateRequiredFields([
        'nome',
        'email',
        'contrasinal_hash'
    ]),
    validateEmail,
    validateUsuario,
    createUsuario
);

router.put(
    '/:id',
    validateId,
    validateRequiredFields([
        'nome',
        'email'
    ]),
    validateEmail,
    validateUsuario,
    updateUsuario
);

router.use('/:id/oposiciones', usuarioOposicionRoutes);

module.exports = router;