const validateUsuario = (req, res, next) => {

    const {
        nome,
        email,
        contrasinal
    } = req.body;

    if (!nome || nome.trim() === '') {

        return res.status(400).json({
            ok: false,
            mensaje: 'O nome é obrigatorio'
        });

    }

    if (nome.length > 100) {

        return res.status(400).json({
            ok: false,
            mensaje: 'O nome é demasiado longo'
        });

    }

    if (
        contrasinal &&
        contrasinal.length < 6
    ) {

        return res.status(400).json({
            ok: false,
            mensaje: 'O contrasinal debe ter mínimo 6 caracteres'
        });

    }

    next();

};

module.exports = validateUsuario;