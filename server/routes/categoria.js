const express = require("express");
const app = express();

const Categoria = require("../models/categoria");
const { verificaToken, verificaRole } = require("../middlewares/autenticacion");

app.get("/categoria", verificaToken, (req, res) => {
    Categoria.find({})
        .sort("nombre")
        .populate("usuario", "nombre email")
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                categorias,
            });
        });
});

app.get("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        if (categoria === null) {
            return res.json({
                ok: false,
                message: "No se encontro la categoria",
            });
        }

        res.json({
            ok: true,
            categoria,
        });
    });
});

app.post("/categoria", verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});

app.put("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: "La categoria no existe",
            });
        }

        categoriaDB.nombre = body.nombre;

        categoriaDB.save((err, categoriaActualizada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.status(201).json({
                ok: true,
                categoria: categoriaActualizada,
            });
        });
    });
});

app.delete("/categoria/:id", [verificaToken, verificaRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        if (categoriaBorrada === null) {
            return res.json({
                ok: false,
                message: "No se encontro la categoria",
            });
        }

        res.json({
            ok: true,
            message: "Se elimino la categoria",
            categoriaBorrada,
        });
    });
});

module.exports = app;