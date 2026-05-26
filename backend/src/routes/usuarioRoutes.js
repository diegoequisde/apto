const express = require('express');
const usuarioOposicionRoutes = require('./usuarioOposicionRoutes');

const router = express.Router();

const validateId = require('../middlewares/validateId');
const validateRequiredFields = require('../middlewares/validateRequiredFields');
const validateEmail = require('../middlewares/validateEmail');


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
        'password'
    ]),
    validateEmail,
    createUsuario
);

router.put('/:id', validateId, updateUsuario);

router.delete('/:id', validateId, deleteUsuario);

router.use('/:id/oposiciones', usuarioOposicionRoutes);

module.exports = router;