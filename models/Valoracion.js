import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Valoracion extends Model {}

Valoracion.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    valor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "Valoracion",
    tableName: "Valoracions",
    timestamps: false
});

export default Valoracion;

// relaciones
import User from "./User.js";
import Imagen from "./Imagen.js";

Valoracion.belongsTo(User, {
    foreignKey: "usuario_id"
});

User.hasMany(Valoracion, {
    foreignKey: "usuario_id"
});

Valoracion.belongsTo(Imagen, {
    foreignKey: "imagen_id"
});

Imagen.hasMany(Valoracion, {
    foreignKey: "imagen_id"
});