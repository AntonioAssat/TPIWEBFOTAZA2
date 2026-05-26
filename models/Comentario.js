import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Comentario extends Model {}

Comentario.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "Comentario",
    tableName: "Comentarios",
    timestamps: false
});

export default Comentario;

// relaciones
import User from "./User.js";
import Imagen from "./Imagen.js";

Comentario.belongsTo(User, {
    foreignKey: "usuario_id"
});

User.hasMany(Comentario, {
    foreignKey: "usuario_id"
});

Comentario.belongsTo(Imagen, {
    foreignKey: "imagen_id"
});

Imagen.hasMany(Comentario, {
    foreignKey: "imagen_id"
});