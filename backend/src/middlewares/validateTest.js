const validateTest = (req, res, next) => {

    const { duracion } = req.body;

    if (
        duracion !== undefined &&
        duracion < 0
    ) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Duración inválida'
        });

    }

    next();

};

module.exports = validateTest;