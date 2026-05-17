const express = require('express');

const router = express.Router();

const {
    getTemas,
    getTemaById,
    createTema,
    updateTema,
    deleteTema
} = require('../controllers/temaController');

router.get('/', getTemas);

router.get('/:id', getTemaById);
/*
router.post('/', createTema);

router.put('/:id', updateTema);

router.delete('/:id', deleteTema);
*/
module.exports = router;