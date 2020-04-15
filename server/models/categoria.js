const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, "Se debe ingresar un nombre para la categoria"],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
});

module.exports = mongoose.model("Categoria", categoriaSchema);