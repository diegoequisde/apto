const validateRequiredFields = (fields) => {

    return (req, res, next) => {

        for (const field of fields) {

            if (
                req.body[field] === undefined ||
                req.body[field] === null ||
                req.body[field] === ''
            ) {

                return res.status(400).json({
                    ok: false,
                    mensaje: `El campo ${field} es obligatorio`
                });

            }

        }

        next();

    };

};

module.exports = validateRequiredFields;