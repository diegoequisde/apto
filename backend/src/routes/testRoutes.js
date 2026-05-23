const express = require('express');

const router = express.Router();

const preguntaTestRoutes = require('./preguntaTestRoutes');
const validateId = require('../middlewares/validateId');

const {
    getTests,
    getTestById,
    createTest,
    updateTest,
    deleteTest
} = require('../controllers/testController');

router.get('/', getTests);

router.get('/:id', validateId, getTestById);

router.post('/', createTest);

router.put('/:id', validateId, updateTest);

router.delete('/:id', validateId, deleteTest);

router.use('/:id/preguntas', preguntaTestRoutes);

module.exports = router;