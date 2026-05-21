const express = require('express');
const validateId = require('../middlewares/validateId');

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

module.exports = router;