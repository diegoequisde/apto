const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES } = require('../config/jwt');
const asyncHandler = require('../middlewares/asyncHandler');
const bcrypt = require('bcryptjs');

const {
    findAllUsuarios,
    findUsuarioById,
    findUsuarioByEmail,
    loginUsuario,
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
                mensaje: 'Usuario no encontrado'
            });

        }

        res.json(usuario);

});

const login = asyncHandler(async (req,res)=>{

    const {
        email,
        password
    } = req.body;

    const usuario =
    await loginUsuario(
        email,
        password
    );

    if(usuario === null){

        return res.status(401).json({
            ok:false,
            mensaje:'Credenciales incorrectas'
        });

    }

    if(usuario === false){

        return res.status(401).json({
            ok:false,
            mensaje:'Credenciales incorrectas'
        });

    }

    if(usuario.estado_usuario !== 'activo'){

        return res.status(403).json({
            ok:false,
            mensaje:'Usuario inactivo'
        });

    }

    const token = jwt.sign(
        {
            id: usuario.id_usuario,
            tipo: usuario.tipo
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES
        }
    );

    res.json({
        ok: true,
        mensaje: 'Login correcto',
        token,
        usuario
    });

});

const createUsuario = asyncHandler(async (req, res) => {

        const {
            nome,
            email,
            password
        } = req.body;
        
        const usuarioExistente = await findUsuarioByEmail(email);
            
            if(usuarioExistente){
                return res.status(409).json({
                    ok:false,
                    mensaje:'Ya existe un usuario con ese correo.'
                });
            }

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
            email,
            tipo
        } = req.body;

        const result = await updateUsuarioById(
            id,
            nome,
            email,
            tipo
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
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
                mensaje: 'Usuario no encontrado'
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
    login,
    createUsuario,
    updateUsuario,
    deleteUsuario
};