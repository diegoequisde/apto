const express = require('express');

const router = express.Router({ mergeParams: true });

const {
    getPreguntasByTest,
    addPreguntaToTest,
    answerPreguntaTest,
    deletePreguntaFromTest
} = require('../controllers/preguntaTestController');

router.get('/', getPreguntasByTest);

router.post('/', addPreguntaToTest);

router.put('/:idPregunta', answerPreguntaTest);

router.delete('/:idPregunta', deletePreguntaFromTest);

module.exports = router;