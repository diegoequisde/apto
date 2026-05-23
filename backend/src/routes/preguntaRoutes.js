const express = require('express');
const validateId = require('../middlewares/validateId');
const opcionRoutes = require('./opcionRoutes');

const router = express.Router();

const {
    getPreguntas,
    getPreguntaById,
    createPregunta,
    updatePregunta,
    deletePregunta
} = require('../controllers/preguntaController');

router.get('/', getPreguntas);

router.get('/:id', validateId, getPreguntaById);

router.post('/', createPregunta);

router.put('/:id', validateId, updatePregunta);

router.delete('/:id', validateId, deletePregunta);

router.use('/:id/opciones', opcionRoutes);

module.exports = router;