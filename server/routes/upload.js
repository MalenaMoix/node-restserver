const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");

//Cuando llamamos a fileUpload() todos los archivos que se carguen caen dentro de req.files
app.use(fileUpload());

app.put("/upload/:tipo/:id", (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            message: "No se ha seleccionado ningun archivo",
        });
    }

    //Si viene un archivo va a caer dentro de req.files.nombreArchivo
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split(".");
    let extensionArchivo = nombreArchivo[nombreArchivo.length - 1];
    //En este caso archivo es el nombre que se le va a colocar cuando coloquemos un input
    //Tambien seria el nombre del key que pongo en el Body de Postman, entonces lo que sea que este posteando lo agarro de req.files.archivo

    //
    //  VALIDACIONES
    //

    //Extensiones permitidas
    let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Las extensiones permitidas son " + extensionesValidas.join(", "),
            "extension subida": extensionArchivo,
        });
    }

    //Validar tipo
    let tiposValidos = ["productos", "usuarios"];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Los tipos permitidos son " + tiposValidos.join(", "),
        });
    }

    //
    //  FIN VALIDACIONES
    //

    //Vamos a cambiar el nombre del archivo
    //Debe ser unico
    //id-milisegundos.extension
    let renombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    archivo.mv(`uploads/${tipo}/${renombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                err,
            });
        }

        //  AQUI YA SE QUE LA IMAGEN SE CARGO
        switch (tipo) {
            case "usuarios":
                imagenUsuario(id, res, renombreArchivo);
                break;
            case "productos":
                imagenProducto(id, res, renombreArchivo);
                break;
        }
    });
});

function imagenUsuario(id, res, renombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            //Aca tambien la borro pq aunque suceda este error la imagen si se subio
            borrarArchivo(renombreArchivo, "usuarios");

            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!usuarioDB) {
            //Aca tambien la borro pq si el usuario no existe tengo que borrar la imagen que se subio
            borrarArchivo(renombreArchivo, "usuarios");

            return res.status(400).json({
                ok: false,
                message: "El usuario no existe",
            });
        }

        //Verificar si la ruta del archivo existe y si existe la elimino asi no se repite muchas veces
        borrarArchivo(usuarioDB.img, "usuarios");

        usuarioDB.img = renombreArchivo;
        usuarioDB.save((err, usuarioActualizado) => {
            res.json({
                ok: true,
                usuario: usuarioActualizado,
                img: renombreArchivo,
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, "productos");

            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, "productos");

            return res.status(400).json({
                ok: false,
                message: "El producto no existe",
            });
        }

        borrarArchivo(productoDB.img, "productos");

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoActualizado) => {
            res.json({
                ok: true,
                producto: productoActualizado,
                img: nombreArchivo,
            });
        });
    });
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(
        __dirname,
        `../../uploads/${tipo}/${nombreImagen}`
    );

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;