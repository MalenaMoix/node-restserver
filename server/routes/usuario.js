const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const app = express();

const Usuario = require("../models/usuario");
const { verificaToken, verificaRole } = require("../middlewares/autenticacion");

//verificaToken es el middleware que se va a disparar cuando se quiera acceder a la ruta especificada
app.get("/usuario", verificaToken, (req, res) => {
    //Asi obtengo el usuario, es decir, el payload, que ya paso por el verifica token, donde alli setee esta propiedad por eso ahora puedo acceder a ella
    //let usuario = req.usuario;

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Con find({}) me trae todos los registros de la coleccion
    //Y si solo quiero que se muestre el nombre mando "nombre" como argumento
    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            //En el count va la misma condicion que puse en el find
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                //Regresamos la respuesta al servicio
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo,
                });
            });
        });
});

app.post("/usuario", [verificaToken, verificaRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    });
});

app.put("/usuario/:id", [verificaToken, verificaRole], (req, res) => {
    let id = req.params.id;
    //Con el pick elijo los atributos que si se van a poder actualizar
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);
    Usuario.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB,
            });
        }
    );
});

app.delete("/usuario/:id", [verificaToken, verificaRole], (req, res) => {
    let id = req.params.id;

    //Eliminar el registro fisicamente
    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
                                                      if (err) {
                                                          return res.status(400).json({
                                                              ok: false,
                                                              err,
                                                          });
                                                      }

                                                      if (usuarioBorrado === null) {
                                                          return res.status(400).json({
                                                              ok: false,
                                                              err: {
                                                                  message: "Usuario no encontrado",
                                                              },
                                                          });
                                                      }

                                                      res.json({
                                                          ok: true,
                                                          usuario: usuarioBorrado,
                                                      });
                                                  });*/

    let cambiarEstado = {
        estado: false,
    };

    Usuario.findByIdAndUpdate(
        id,
        cambiarEstado, { new: true },
        (err, usuarioBorrado) => {
            if (usuarioBorrado === null) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario no encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBorrado,
            });
        }
    );
});

module.exports = app;