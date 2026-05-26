import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Mensaje extends Model {}

Mensaje.init({
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Mensaje",
    tableName: "Mensajes",
    timestamps: false
});

export default Mensaje;

// relaciones
import User from "./User.js";

// usuario emisor
User.hasMany(Mensaje, {
    foreignKey: "emisor_id"
});

Mensaje.belongsTo(User, {
    as: "Emisor",
    foreignKey: "emisor_id"
});