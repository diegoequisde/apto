const express = require('express');

const router = express.Router({ mergeParams: true });

const {
    getTemasByOposicion,
    addTemaToOposicion,
    deleteTemaFromOposicion
} = require('../controllers/oposicionTemaController');

router.get('/', getTemasByOposicion);

router.post('/', addTemaToOposicion);

router.delete('/:idTema', deleteTemaFromOposicion);

module.exports = router;