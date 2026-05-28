const express = require('express');

const validateId = require('../middlewares/validateId');
const validateRequiredFields = require('../middlewares/validateRequiredFields');
const validatePregunta = require('../middlewares/validatePregunta');

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

router.post(
    '/',
    validateRequiredFields([
        'enunciado',
        'id_tema'
    ]),
    validatePregunta,
    createPregunta
);

router.put(
    '/:id',
    validateId,
    validateRequiredFields([
        'enunciado',
        'id_tema'
    ]),
    validatePregunta,
    updatePregunta
);

router.delete('/:id', validateId, deletePregunta);

router.use('/:id/opciones', opcionRoutes);

module.exports = router;