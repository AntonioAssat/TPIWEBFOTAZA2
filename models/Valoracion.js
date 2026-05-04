import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Valoracion = sequelize.define("Valoracion", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    valor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default Valoracion;
//relaciones
import User from "./User.js";
import Imagen from "./Imagen.js";

// Usuario → valoraciones
Valoracion.belongsTo(User, {
    foreignKey: "usuario_id"
});

User.hasMany(Valoracion, {
    foreignKey: "usuario_id"
});

// Imagen → valoraciones
Valoracion.belongsTo(Imagen, {
    foreignKey: "imagen_id"
});

Imagen.hasMany(Valoracion, {
    foreignKey: "imagen_id"
});