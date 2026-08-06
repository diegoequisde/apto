const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const validateId = require('../middlewares/validateId');
const validateRequiredFields = require('../middlewares/validateRequiredFields');
const validateTest = require('../middlewares/validateTest');

const preguntaTestRoutes = require('./preguntaTestRoutes');

const {
    getTests,
    getEstadisticas,
    getHistorial,
    getResultadoTest,
    getRevisionTest,
    getTestById,
    createTest,
    createTestOficial,
    updateTest,
    deleteTest
} = require('../controllers/testController');

router.get('/', verifyToken, getTests);

router.get('/estadisticas', verifyToken, getEstadisticas);

router.get('/historial', verifyToken, getHistorial);

router.post('/oficial', verifyToken, validateRequiredFields(['id_oposicion']), createTestOficial);

router.get('/:id/resultado', verifyToken, getResultadoTest);

router.get('/:id/revision', verifyToken, validateId, getRevisionTest);

router.get('/:id', verifyToken, validateId, getTestById);

router.post('/', verifyToken, validateTest, createTest);

router.put('/:id', verifyToken, validateId, validateTest, updateTest);

router.delete('/:id', verifyToken, validateId, deleteTest);

router.use('/:id/preguntas', preguntaTestRoutes);

module.exports = router;