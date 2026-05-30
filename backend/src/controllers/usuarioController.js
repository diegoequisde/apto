const asyncHandler = require('../middlewares/asyncHandler');
const bcrypt = require('bcryptjs');

const {
    findAllUsuarios,
    findUsuarioById,
    insertUsuario,
    updateUsuarioById,
    deleteUsuarioById
} = require('../services/usuarioService');

const getUsuarios = asyncHandler(async (req, res) => {

        const usuarios = await findAllUsuarios();

        res.json(usuarios);

    });

const getUsuarioById = asyncHandler(async (req, res) => {

        const { id } = req.params;

        const usuario = await findUsuarioById(id);

        if (!usuario) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario non encontrado'
            });

        }

        res.json(usuario);

});

const createUsuario = asyncHandler(async (req, res) => {

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

});

const updateUsuario = asyncHandler(async (req, res) => {
    
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

});

const deleteUsuario = asyncHandler(async (req, res) => {

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

});

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};