import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Notificacion = sequelize.define("Notificacion", {

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

    usuario_accion_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

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