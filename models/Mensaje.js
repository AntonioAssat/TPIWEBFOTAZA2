import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

const Mensaje = sequelize.define(
    "Mensaje",
    {

        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }
);

export default Mensaje;
// Relaciones

import User from "./User.js";

import Conversacion from "./Conversacion.js";

// emisor
User.hasMany(Mensaje, {
    foreignKey: "emisor_id"
});

Mensaje.belongsTo(User, {
    as: "Emisor",
    foreignKey: "emisor_id"
});

// conversación
Conversacion.hasMany(Mensaje, {
    foreignKey: "conversacion_id"
});

Mensaje.belongsTo(Conversacion, {
    foreignKey: "conversacion_id"
});