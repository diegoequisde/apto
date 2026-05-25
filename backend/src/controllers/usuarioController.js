const bcrypt = require('bcryptjs');

const {
    findAllUsuarios,
    findUsuarioById,
    insertUsuario,
    updateUsuarioById,
    deleteUsuarioById
} = require('../services/usuarioService');

const getUsuarios = async (req, res, next) => {

    try {

        const usuarios = await findAllUsuarios();

        res.json(usuarios);

    } catch (error) {

        next(error);

    }

};

const getUsuarioById = async (req, res, next) => {

    try {

        const { id } = req.params;

        const usuario = await findUsuarioById(id);

        if (!usuario) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario non encontrado'
            });

        }

        res.json(usuario);

    } catch (error) {

        next(error);

    }

};

const createUsuario = async (req, res, next) => {

    try {

        const {
            nome,
            email,
            password
        } = req.body;

        const contrasinal_hash = await bcrypt.hash(password, 10);

        const id_usuario = await insertUsuario(
            nome,
            email,
            contrasinal_hash
        );

        res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado correctamente',
            id_usuario
        });

    } catch (error) {

        next(error);

    }

};

const updateUsuario = async (req, res, next) => {

    try {

        const { id } = req.params;

        const {
            nome,
            email
        } = req.body;

        const result = await updateUsuarioById(
            id,
            nome,
            email
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario non encontrado'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Usuario actualizado correctamente'
        });

    } catch (error) {

        next(error);

    }

};

const deleteUsuario = async (req, res, next) => {

    try {

        const { id } = req.params;

        const result = await deleteUsuarioById(id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario non encontrado'
            });

        }

        res.json({
            ok: true,
            mensaje: 'Usuario eliminado correctamente'
        });

    } catch (error) {

        next(error);

    }

};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};