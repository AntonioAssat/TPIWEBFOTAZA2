import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comentario = sequelize.define("Comentario", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

export default Comentario;
//relaciones
import User from "./User.js";
import Imagen from "./Imagen.js";

// Un comentario pertenece a un usuario
Comentario.belongsTo(User, {
    foreignKey: "usuario_id"
});

User.hasMany(Comentario, {
    foreignKey: "usuario_id"
});

// Un comentario pertenece a una imagen
Comentario.belongsTo(Imagen, {
    foreignKey: "imagen_id"
});

Imagen.hasMany(Comentario, {
    foreignKey: "imagen_id"
});