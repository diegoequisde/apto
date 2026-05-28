const validatePregunta = (req, res, next) => {

    const { enunciado } = req.body;

    if (
        !enunciado ||
        enunciado.trim() === ''
    ) {

        return res.status(400).json({
            ok: false,
            mensaje: 'O enunciado é obrigatorio'
        });

    }

    if (enunciado.length > 2000) {

        return res.status(400).json({
            ok: false,
            mensaje: 'O enunciado é demasiado longo'
        });

    }

    next();

};

module.exports = validatePregunta;