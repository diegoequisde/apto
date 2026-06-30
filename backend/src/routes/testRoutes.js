const express = require('express');

const validateId = require('../middlewares/validateId');
const validateRequiredFields = require('../middlewares/validateRequiredFields');
const validateTest = require('../middlewares/validateTest');

const preguntaTestRoutes = require('./preguntaTestRoutes');

const router = express.Router();

const {
    getTests,
    getHistorial,
    getTestById,
    createTest,
    updateTest,
    deleteTest,
    getRevisionTest
} = require('../controllers/testController');

router.get('/', getTests);

router.get('/historial', getHistorial);

router.get('/:id/revision', validateId, getRevisionTest);

router.get('/:id', validateId, getTestById);

router.post('/', validateRequiredFields(['id_usuario']), validateTest, createTest);

router.put('/:id', validateId, validateTest, updateTest);

router.delete('/:id', validateId, deleteTest);

router.use('/:id/preguntas', preguntaTestRoutes);

module.exports = router;