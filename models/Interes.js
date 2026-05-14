import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

const Interes = sequelize.define("Interes", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }

});

export default Interes;
// Relaciones

import User from "./User.js";

import Imagen from "./Imagen.js";

// usuario interesado
User.hasMany(Interes, {
    foreignKey: "usuario_id"
});

Interes.belongsTo(User, {
    foreignKey: "usuario_id"
});

// imagen interesada
Imagen.hasMany(Interes, {
    foreignKey: "imagen_id"
});

Interes.belongsTo(Imagen, {
    foreignKey: "imagen_id"
});