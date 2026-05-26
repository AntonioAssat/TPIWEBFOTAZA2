import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import Comentario from "./Comentario.js";
import User from "./User.js";

class DenunciaComentario extends Model {}

DenunciaComentario.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "DenunciaComentario",
    tableName: "DenunciaComentarios",
    timestamps: false
});

// relaciones
Comentario.hasMany(DenunciaComentario, {
    foreignKey: "comentario_id"
});

DenunciaComentario.belongsTo(Comentario, {
    foreignKey: "comentario_id"
});

User.hasMany(DenunciaComentario, {
    foreignKey: "usuario_id"
});

DenunciaComentario.belongsTo(User, {
    foreignKey: "usuario_id"
});

export default DenunciaComentario;