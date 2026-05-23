const express = require('express');

const router = express.Router({ mergeParams: true });

const {
    getOpcionesByPregunta,
    createOpcion,
    updateOpcion,
    deleteOpcion
} = require('../controllers/opcionController');

router.get('/', getOpcionesByPregunta);

router.post('/', createOpcion);

router.put('/:letra', updateOpcion);

router.delete('/:letra', deleteOpcion);

module.exports = router;