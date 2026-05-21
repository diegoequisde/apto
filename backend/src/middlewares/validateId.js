const validateId = (req, res, next) => {

    const { id } = req.params;

    if (isNaN(id)) {

        return res.status(400).json({
            ok: false,
            mensaje: 'ID inválida'
        });

    }

    next();

};

module.exports = validateId;