import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Interes extends Model {}

Interes.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, {
    sequelize,
    modelName: "Interes",
    tableName: "Intereses",
    timestamps: false
});

export default Interes;

// relaciones
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