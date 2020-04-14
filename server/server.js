require("./config/config");

//Libreria de node para resolver correctamente los path
const path = require("path");

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

//Configuracion global de rutas
app.use(require("./routes/index"));

mongoose.connect(
    process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;

        console.log("Base de datos ONLINE");
    }
);

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto 8080`);
});