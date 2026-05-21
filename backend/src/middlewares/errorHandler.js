const errorHandler = (error, req, res, next) => {

    console.error(error);

    res.status(500).json({
        ok: false,
        mensaje: 'Erro interno do servidor'
    });

};

module.exports = errorHandler;