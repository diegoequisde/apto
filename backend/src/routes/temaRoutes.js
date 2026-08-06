const express = require('express');
const router = express.Router();

const validateId = require('../middlewares/validateId');
const validateRequiredFields = require('../middlewares/validateRequiredFields');
const validateTema = require('../middlewares/validateTema');
const verifyToken = require('../middlewares/verifyToken');

const {
    getTemas,
    getTemaById,
    createTema,
    updateTema,
    deleteTema
} = require('../controllers/temaController');

router.get('/',
            verifyToken,
            getTemas
        );

router.get('/:id', verifyToken, validateId, getTemaById);

router.post(
    '/',
    verifyToken,
    validateRequiredFields([
        'nome_tema'
    ]),
    validateTema,
    createTema
);

router.put(
    '/:id',
    verifyToken,
    validateId,
    validateRequiredFields([
        'nome_tema'
    ]),
    validateTema,
    updateTema
);
 
router.delete('/:id', verifyToken, validateId, deleteTema);

module.exports = router;