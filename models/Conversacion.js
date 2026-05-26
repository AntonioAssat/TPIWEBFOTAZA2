import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Conversacion extends Model {}

Conversacion.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
}
}, {
    sequelize,
    modelName: "Conversacion",
    tableName: "Conversacions",
    timestamps: false
});

export default Conversacion;

// relaciones
import User from "./User.js";
import Imagen from "./Imagen.js";
import Mensaje from "./Mensaje.js";

// comprador
User.hasMany(Conversacion, {
    foreignKey: "comprador_id"
});

Conversacion.belongsTo(User, {
    as: "Comprador",
    foreignKey: "comprador_id"
});

// autor
User.hasMany(Conversacion, {
    foreignKey: "autor_id"
});

Conversacion.belongsTo(User, {
    as: "Autor",
    foreignKey: "autor_id"
});

// imagen
Imagen.hasMany(Conversacion, {
    foreignKey: "imagen_id"
});

Conversacion.belongsTo(Imagen, {
    foreignKey: "imagen_id"
});

// mensajes
Conversacion.hasMany(Mensaje, {
    foreignKey: "conversacion_id"
});

Mensaje.belongsTo(Conversacion, {
    foreignKey: "conversacion_id"
});