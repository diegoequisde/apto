const {
    findAllTemas,
    findTemaById,
    insertTema,
    updateTemaById,
    deleteTemaById
} = require('../services/temaService');

const getTemas = async (req, res, next) => {

    try {
        
        const temas = await findAllTemas();

        res.json(temas);

    } catch (error) {

    next(error);

}

};

const getTemaById = async (req, res, next) => {

    try {

        const { id } = req.params;

        const tema = await findTemaById(id);

    if (!tema) {

        return res.status(404).json({
            ok: false,
            mensaje: 'Tema non encontrado'
        });

    }

    res.json(tema);

    } catch (error) {

    next(error);

}

};

const createTema = async (req, res, next) => {

    try {

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

    } catch (error) {

    next(error);

}

};

const updateTema = async (req, res, next) => {

    try {

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

    } catch (error) {

    next(error);

}

};

const deleteTema = async (req, res, next) => {

    try {

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

    } catch (error) {

    next(error);

}

};

module.exports = {
    getTemas,
    getTemaById,
    createTema,
    updateTema,
    deleteTema
};