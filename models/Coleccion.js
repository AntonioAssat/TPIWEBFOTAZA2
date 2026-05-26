import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Coleccion extends Model {}

Coleccion.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Coleccion",
    tableName: "Coleccions",
    timestamps: false
});

export default Coleccion;

// relaciones
import User from "./User.js";
import Publicacion from "./Publicacion.js";

// usuario
User.hasMany(Coleccion, {
    foreignKey: "usuario_id"
});

Coleccion.belongsTo(User, {
    foreignKey: "usuario_id"
});

// muchas a muchas publicaciones
Coleccion.belongsToMany(Publicacion, {
    through: "ColeccionPublicaciones",
    foreignKey: "coleccion_id"
});

Publicacion.belongsToMany(Coleccion, {
    through: "ColeccionPublicaciones",
    foreignKey: "publicacion_id"
});