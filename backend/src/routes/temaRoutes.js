const express = require('express');
const validateId = require('../middlewares/validateId');
const validateTema = require('../middlewares/validateTema');

const router = express.Router();

const {
    getTemas,
    getTemaById,
    createTema,
    updateTema,
    deleteTema
} = require('../controllers/temaController');

router.get('/', getTemas);

router.get('/:id', validateId, getTemaById);

router.post('/', validateTema, createTema);

router.put('/:id', validateId, validateTema, updateTema);
 
router.delete('/:id', validateId, deleteTema);

module.exports = router;