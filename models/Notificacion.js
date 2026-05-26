import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Notificacion extends Model {}

Notificacion.init({
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mensaje: {
        type: DataTypes.STRING,
        allowNull: false
    },
    leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
    },
    usuario_accion_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    conversacion_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    modelName: "Notificacion",
    tableName: "Notificacions",
    timestamps: false
});

export default Notificacion;

import User from "./User.js";

// usuario que recibe la notificación
User.hasMany(Notificacion, {
    foreignKey: "usuario_id"
});

Notificacion.belongsTo(User, {
    foreignKey: "usuario_id"
});

// usuario que genera la acción
Notificacion.belongsTo(User, {
    as: "UsuarioAccion",
    foreignKey: "usuario_accion_id"
});