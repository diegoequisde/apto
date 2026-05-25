const express = require('express');

const router = express.Router();

const validateId = require('../middlewares/validateId');

const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
} = require('../controllers/usuarioController');

router.get('/', getUsuarios);

router.get('/:id', validateId, getUsuarioById);

router.post('/', createUsuario);

router.put('/:id', validateId, updateUsuario);

router.delete('/:id', validateId, deleteUsuario);

module.exports = router;