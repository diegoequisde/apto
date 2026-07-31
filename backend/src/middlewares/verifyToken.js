const {
    jwt,
    JWT_SECRET
} = require('../config/jwt');

function verifyToken(
    req,
    res,
    next
){

    const authHeader =
        req.headers.authorization;

    if(
        !authHeader ||
        !authHeader.startsWith('Bearer ')
    ){

        return res.status(401).json({
            ok:false,
            mensaje:'Token requerido'
        });

    }

    const token =
        authHeader.split(' ')[1];

    try{

        const payload =
            jwt.verify(
                token,
                JWT_SECRET
            );

        req.usuario =
            payload;

        next();

    }
    catch(error){
    
        return res.status(401).json({
            ok:false,
            mensaje:'Token inválido'
        });

    }

}

module.exports =
verifyToken;