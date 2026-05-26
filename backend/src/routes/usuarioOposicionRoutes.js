const express = require('express');

const router = express.Router({ mergeParams: true });

const {
    getOposicionesByUsuario,
    addOposicionToUsuario,
    deleteOposicionFromUsuario
} = require('../controllers/usuarioOposicionController');

router.get('/', getOposicionesByUsuario);

router.post('/', addOposicionToUsuario);

router.delete('/:idOposicion', deleteOposicionFromUsuario);

module.exports = router;