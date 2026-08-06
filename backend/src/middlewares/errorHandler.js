const errorHandler = (error, req, res, next) => {

    console.error(error);

    res.status(error.status || 500).json({
        ok: false,
        mensaje: error.message || 'Erro interno do servidor'
    });

};

module.exports = errorHandler;