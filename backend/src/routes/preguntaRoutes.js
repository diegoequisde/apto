const express = require('express');

const router = express.Router();

const {
    getPreguntas,
    getPreguntaById,
    createPregunta,
    updatePregunta,
    deletePregunta
} = require('../controllers/preguntaController');

router.get('/', getPreguntas);

router.get('/:id', getPreguntaById);

router.post('/', createPregunta);

router.put('/:id', updatePregunta);

router.delete('/:id', deletePregunta);

module.exports = router;