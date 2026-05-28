const express = require('express');

const validateRequiredFields = require('../middlewares/validateRequiredFields');

const validateOpcion = require('../middlewares/validateOpcion');

const router = express.Router({ mergeParams: true });

const {
    getOpcionesByPregunta,
    createOpcion,
    updateOpcion,
    deleteOpcion
} = require('../controllers/opcionController');

router.get('/', getOpcionesByPregunta);

router.post(
    '/',
    validateRequiredFields([
        'letra_opcion',
        'texto'
    ]),
    validateOpcion,
    createOpcion
);

router.put(
    '/:letra',
    validateOpcion,
    updateOpcion
);

router.delete('/:letra', deleteOpcion);

module.exports = router;