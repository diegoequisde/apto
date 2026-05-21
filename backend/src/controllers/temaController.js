const {
    findAllTemas
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

        const [rows] = await pool.query(`
            SELECT
                id_tema,
                nome_tema,
                descripcion_tema,
                estado_tema
            FROM tema
            WHERE id_tema = ?
            AND estado_tema = 'activo'
        `, [id]);

        if (rows.length === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Tema non encontrado'
            });

        }

        res.json(rows[0]);

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

        const [result] = await pool.query(`
            INSERT INTO tema (
                nome_tema,
                descripcion_tema
            )
            VALUES (?, ?)
        `, [
            nome_tema,
            descripcion_tema
        ]);

        res.status(201).json({
            ok: true,
            mensaje: 'Tema creado correctamente',
            id_tema: result.insertId
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

        const [result] = await pool.query(`
            UPDATE tema
            SET
                nome_tema = ?,
                descripcion_tema = ?
            WHERE id_tema = ?
            AND estado_tema = 'activo'
        `, [
            nome_tema,
            descripcion_tema,
            id
        ]);

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

        const [result] = await pool.query(`
            UPDATE tema
            SET estado_tema = 'inactivo'
            WHERE id_tema = ?
            AND estado_tema = 'activo'
        `, [id]);

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