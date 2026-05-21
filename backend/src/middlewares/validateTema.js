const validateTema = (req, res, next) => {

    const {
        nome_tema,
        descripcion_tema
    } = req.body;

    if (!nome_tema || nome_tema.trim() === '') {

        return res.status(400).json({
            ok: false,
            mensaje: 'O nome do tema é obrigatorio'
        });

    }

    if (nome_tema.length > 150) {

        return res.status(400).json({
            ok: false,
            mensaje: 'O nome do tema é demasiado longo'
        });

    }

    if (
        descripcion_tema &&
        descripcion_tema.length > 1000
    ) {

        return res.status(400).json({
            ok: false,
            mensaje: 'A descrición é demasiado longa'
        });

    }

    next();

};

module.exports = validateTema;