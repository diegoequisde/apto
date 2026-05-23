const errorHandler = (error, req, res, next) => {

    console.error(error);

    res.status(500).json({
        ok: false,
        mensaje: error.message
    });

};

module.exports = errorHandler;