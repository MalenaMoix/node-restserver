//Aqui dentro vamos a declarar cosas de forma global
//El process es un objeto global que esta corriendo a lo largo de toda la aplicacion de node, y tambien es actualizado dependiendo del environment donde esta corriendo

//
//  Puerto
//
process.env.PORT = process.env.PORT || 8080;

//
//  Entorno
//
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//
//  Base de datos
//
let urlDB;
if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URI;
}
//urlDB = "mongodb+srv://taylor:0toprMg0FzwW46nt@cluster0-0lcnt.mongodb.net/cafe";
process.env.URLDB = urlDB;

//
//  Fecha de expiracion del Token
//  60 segundos
//  60minutos
//  24 horas
//  30 dias
//
process.env.CADUCIDAD_TOKEN = "48h";

//
//  SEED de autenticacion
//
process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";

//
//  Google Client ID
//
process.env.CLIENT_ID =
    process.env.CLIENT_ID ||
    "915984044443-ihojuakdp8qddobisqoad88c581h022b.apps.googleusercontent.com";