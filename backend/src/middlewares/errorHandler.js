const errorHandler = (
    error,
    req,
    res,
    next
) => {

    console.error(error);

    res.status(
        error.status || 500
    ).json({

        ok: false,
        mensaje: error.message || 'Error interno del servidor'

    });

};

module.exports = errorHandler;