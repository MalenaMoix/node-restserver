require("./config/config");
//Al ser este el primer archivo, cuando empiece a ejecutar la aplicacion va a leer el config.js, lo va a ejecutar y al hacerlo va a configurar todo lo que el contenga

//LOS APP.USE SON MIDDLEWARES ES DECIR QUE SE VAN A DISPARAR CADA VEZ QUE EL CODIGO PASE POR AHI
//ES DECIR QUE SE EJECUTAN CADA VEZ QUE SE ENVIA UN REQUEST AL SERVIDOR

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Servicio que esta escuchando el get
app.get("/usuario", (req, res) => {
    //El send envia html
    //res.send('Hello World!');

    //Si quiero trabajar con json
    res.json("get Usuario");
});

app.post("/usuario", (req, res) => {
    //este body es el que va a aparecer cuando el bodyParser procese cualquier payload que reciban las peticiones
    let body = req.body;

    //Codigo de error http
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario",
        });
    }

    res.json({
        body,
    });
});

//id seria el parametro que quiero recibir
app.put("/usuario/:id", (req, res) => {
    //Para obtener el parametro
    let id = req.params.id;

    res.json({
        id,
    });
});

app.delete("/usuario", (req, res) => {
    res.json("delete Usuario");
});

//Recordemos que el process es global
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto 8080`);
});