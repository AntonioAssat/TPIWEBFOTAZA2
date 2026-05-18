import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

const Coleccion = sequelize.define(
    "Coleccion",
    {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

export default Coleccion;

// Relaciones

import User from "./User.js";

import Publicacion from "./Publicacion.js";

// usuario
User.hasMany(Coleccion, {
    foreignKey: "usuario_id"
});

Coleccion.belongsTo(User, {
    foreignKey: "usuario_id"
});

// muchas a muchas publicaciones
Coleccion.belongsToMany(
    Publicacion,
    {
        through: "ColeccionPublicaciones",
        foreignKey: "coleccion_id"
    }
);

Publicacion.belongsToMany(
    Coleccion,
    {
        through: "ColeccionPublicaciones",
        foreignKey: "publicacion_id"
    }
);