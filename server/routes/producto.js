const express = require("express");
const app = express();

const Producto = require("../models/producto");
const { verificaToken } = require("../middlewares/autenticacion");

app.get("/productos", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("precioUni")
        .populate("usuario", "nombre")
        .populate("categoria", "nombre")
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                productos,
            });
        });
});

app.get("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate("usuario", "nombre")
        .populate("categoria", "nombre")
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                producto: productoDB,
            });
        });
});

//
//  Buscar Productos
//
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regularExp = RegExp(termino, "i");

    Producto.find({ nombre: regularExp })
        .populate("categoria", "nombre")
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                productos,
            });
        });
});

app.post("/productos", verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        precioUni: body.precioUni,
        nombre: body.nombre,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB,
        });
    });
});

app.put("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: "El producto no existe",
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;

        productoDB.save((err, productoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.status(201).json({
                ok: true,
                producto: productoActualizado,
            });
        });
    });
});

app.delete("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: "El producto no existe",
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoEliminado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.status(201).json({
                ok: true,
                message: "Producto borrado",
                producto: productoEliminado,
            });
        });
    });
});

module.exports = app;