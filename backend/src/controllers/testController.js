const {
    findAllTests,
    findTestById,
    insertTest,
    updateTestById,
    deleteTestById
} = require('../services/testService');

const getTests = async (req, res, next) => {

    try {

        const tests = await findAllTests();

        res.json(tests);

    } catch (error) {

        next(error);

    }

};

const getTestById = async (req, res, next) => {

    try {

        const { id } = req.params;

        const test = await findTestById(id);

        if (!test) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Test non encontrado'
            });

        }

        res.json(test);

    } catch (error) {

        next(error);

    }

};

const createTest = async (req, res, next) => {

    try {

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

    } catch (error) {

        next(error);

    }

};

const updateTest = async (req, res, next) => {

    try {

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

    } catch (error) {

        next(error);

    }

};

const deleteTest = async (req, res, next) => {

    try {

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

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getTests,
    getTestById,
    createTest,
    updateTest,
    deleteTest
};