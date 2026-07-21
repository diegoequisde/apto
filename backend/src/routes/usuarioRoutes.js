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
    getUsuarioByEmail,
    login,
    createUsuario,
    updateUsuario,
    deleteUsuario
} = require('../controllers/usuarioController');

router.get('/', getUsuarios);

router.get('/email', getUsuarioByEmail);

router.post('/login', login);

router.post(
    '/',
    validateRequiredFields([
        'nome',
        'email',
        'password'
    ]),
    validateEmail,
    validateUsuario,
    createUsuario
);

router.get('/:id', validateId, getUsuarioById);

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

router.delete(
    '/:id',
    validateId,
    deleteUsuario
);

router.use('/:id/oposiciones', usuarioOposicionRoutes);

module.exports = router;