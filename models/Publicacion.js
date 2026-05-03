import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Publicacion = sequelize.define("Publicacion", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
});

export default Publicacion;

import User from "./User.js";

Publicacion.belongsTo(User, {
    foreignKey: "usuario_id"
});

User.hasMany(Publicacion, {
    foreignKey: "usuario_id"
});