import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Imagen extends Model {}

Imagen.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    licencia: {
        type: DataTypes.STRING,
    },
    watermark: {
        type: DataTypes.STRING,
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: "activa"
    },
    comentarios_cerrados: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "Imagen",
    tableName: "Imagens",
    timestamps: false
});

export default Imagen;

import Publicacion from "./Publicacion.js";

Imagen.belongsTo(Publicacion, {
    foreignKey: "publicacion_id"
});

Publicacion.hasMany(Imagen, {
    foreignKey: "publicacion_id"
});