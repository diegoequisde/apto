const express = require('express');

const router = express.Router();
const oposicionTemaRoutes = require('./oposicionTemaRoutes');
const validateId = require('../middlewares/validateId');



const {
    getOposiciones,
    getOposicionById,
    createOposicion,
    updateOposicion,
    deleteOposicion
} = require('../controllers/oposicionController');

router.get('/', getOposiciones);

router.get('/:id', validateId, getOposicionById);

router.post('/', createOposicion);

router.put('/:id', validateId, updateOposicion);

router.delete('/:id', validateId, deleteOposicion);

router.use('/:id/temas', oposicionTemaRoutes);

module.exports = router;