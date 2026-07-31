const verifyToken = require('../middlewares/verifyToken');
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

router.get('/', verifyToken, getOpcionesByPregunta);

router.post(
    '/',
    verifyToken,
    validateRequiredFields([
        'letra_opcion',
        'texto'
    ]),
    validateOpcion,
    createOpcion
);

router.put(
    '/:letra',
    verifyToken,
    validateOpcion,
    updateOpcion
);

router.delete('/:letra', verifyToken, deleteOpcion);

module.exports = router;