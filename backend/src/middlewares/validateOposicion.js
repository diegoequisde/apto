const validateOposicion = (req, res, next) => {

    const {
        nome_oposicion,
        descripcion_oposicion
    } = req.body;

    if (!nome_oposicion || nome_oposicion.trim() === '') {

        return res.status(400).json({
            ok: false,
            mensaje: 'O nome da oposición é obrigatorio'
        });

    }

    if (nome_oposicion.length > 150) {

        return res.status(400).json({
            ok: false,
            mensaje: 'O nome da oposición é demasiado longo'
        });

    }

    if (
        descripcion_oposicion &&
        descripcion_oposicion.length > 1000
    ) {

        return res.status(400).json({
            ok: false,
            mensaje: 'A descrición é demasiado longa'
        });

    }

    next();

};

module.exports = validateOposicion;