import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

const Conversacion = sequelize.define(
    "Conversacion",
    {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }
);

export default Conversacion;

// RELACIONES

import User from "./User.js";

import Imagen from "./Imagen.js";

import Mensaje from "./Mensaje.js";

// comprador
User.hasMany(Conversacion, {
    foreignKey: "comprador_id"
});

Conversacion.belongsTo(User, {
    as: "Comprador",
    foreignKey: "comprador_id"
});

// autor
User.hasMany(Conversacion, {
    foreignKey: "autor_id"
});

Conversacion.belongsTo(User, {
    as: "Autor",
    foreignKey: "autor_id"
});

// imagen
Imagen.hasMany(Conversacion, {
    foreignKey: "imagen_id"
});

Conversacion.belongsTo(Imagen, {
    foreignKey: "imagen_id"
});

// mensajes
Conversacion.hasMany(Mensaje, {
    foreignKey: "conversacion_id"
});

Mensaje.belongsTo(Conversacion, {
    foreignKey: "conversacion_id"
});