const jwt = require("jsonwebtoken");

//
//  Verificar token
//

let verificaToken = (req, res, next) => {
    //Asi obtengo los Headers, token es el nombre que le puse a mi Header personalizado
    let token = req.get("token");

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: "Token no valido",
            });
        }

        //El decoded es el payload
        req.usuario = decoded.usuario;

        //Si no llamo al next jamas se va a ejecutar todo lo que siga despues de la llamada al verificaToken
        next();
    });
};

//
// Verifica ADMIN_ROLE
//
let verificaRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "El usuario no es administrador",
            },
        });
    }
};

//
// Verifica Token por URL
//
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: "Token no valido",
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    verificaRole,
    verificaTokenImg,
};