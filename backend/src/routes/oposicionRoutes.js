const express = require('express');

const validateId = require('../middlewares/validateId');
const validateRequiredFields = require('../middlewares/validateRequiredFields');

const oposicionTemaRoutes = require('./oposicionTemaRoutes');

const router = express.Router();

const {
    getOposiciones,
    getOposicionById,
    createOposicion,
    updateOposicion,
    deleteOposicion
} = require('../controllers/oposicionController');

router.get('/', getOposiciones);

router.get('/:id', validateId, getOposicionById);

router.post(
    '/',
    validateRequiredFields([
        'nome_oposicion'
    ]),
    createOposicion
);

router.put(
    '/:id',
    validateId,
    validateRequiredFields([
        'nome_oposicion'
    ]),
    updateOposicion
);

router.delete('/:id', validateId, deleteOposicion);

router.use('/:id/temas', oposicionTemaRoutes);

module.exports = router;