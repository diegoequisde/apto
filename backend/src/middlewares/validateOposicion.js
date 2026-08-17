const validateOposicion = (req, res, next) => {

    const {
        nome_oposicion,
        descripcion_oposicion
    } = req.body;

    if (!nome_oposicion || nome_oposicion.trim() === '') {

        return res.status(400).json({
            ok: false,
            mensaje: 'El nombre de la oposición es obligatorio'
        });

    }

    if (nome_oposicion.length > 150) {

        return res.status(400).json({
            ok: false,
            mensaje: 'El nombre de la oposición es demasiado largo'
        });

    }

    if (
        descripcion_oposicion &&
        descripcion_oposicion.length > 1000
    ) {

        return res.status(400).json({
            ok: false,
            mensaje: 'La descripción es demasiado larga'
        });

    }

    next();

};

module.exports = validateOposicion;