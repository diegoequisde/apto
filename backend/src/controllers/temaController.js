const asyncHandler = require('../middlewares/asyncHandler');

const {
    findAllTemas,
    findTemaById,
    insertTema,
    updateTemaById,
    deleteTemaById
} = require('../services/temaService');

const getTemas = asyncHandler(async (req, res) => {

    const temas = await findAllTemas();

    res.json(temas);

});

const getTemaById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const tema = await findTemaById(id);

    if (!tema) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Tema non encontrado'
        });

    }

    res.json(tema);

});

const createTema = asyncHandler (async (req, res) => {

        const {
            nome_tema,
            descripcion_tema
        } = req.body;

        const id_tema = await insertTema(
            nome_tema,
            descripcion_tema
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Tema creado correctamente',
            id_tema
        });

});

const updateTema = asyncHandler (async(req, res) => {

        const { id } = req.params;

        const {
            nome_tema,
            descripcion_tema
        } = req.body;

        const result = await updateTemaById(
            id,
            nome_tema,
            descripcion_tema
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Tema non encontrado'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Tema actualizado correctamente'
        });

});

const deleteTema = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const result = await deleteTemaById(id);

    if (result.affectedRows === 0) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Tema non encontrado'
        });

    }

    res.json({
        ok: true,
        mensaje: 'Tema eliminado correctamente'
    });

});

module.exports = {
    getTemas,
    getTemaById,
    createTema,
    updateTema,
    deleteTema
};