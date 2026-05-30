const asyncHandler = require('../middlewares/asyncHandler');

const {
    findAllTests,
    findTestById,
    insertTest,
    updateTestById,
    deleteTestById
} = require('../services/testService');

const getTests = asyncHandler(async (req, res) => {

        const tests = await findAllTests();

        res.json(tests);

});

const getTestById = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const test = await findTestById(id);

        if (!test) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Test non encontrado'
            });

        }

        res.json(test);

});

const createTest = asyncHandler(async (req, res) => {

    
        const {
            id_usuario,
            duracion
        } = req.body;

        const id_test = await insertTest(
            id_usuario,
            duracion
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Test creado correctamente',
            id_test
        });

});

const updateTest = asyncHandler(async (req, res) => {

    
        const { id } = req.params;

        const {
            duracion,
            resultado,
            finalizado
        } = req.body;

        const result = await updateTestById(
            id,
            duracion,
            resultado,
            finalizado
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Test non encontrado'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Test actualizado correctamente'
        });

});

const deleteTest = asyncHandler(async (req, res) => {

    
        const { id } = req.params;

        const result = await deleteTestById(id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Test non encontrado'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Test eliminado correctamente'
        });

});

module.exports = {
    getTests,
    getTestById,
    createTest,
    updateTest,
    deleteTest
};