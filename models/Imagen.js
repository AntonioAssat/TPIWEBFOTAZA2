import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Imagen = sequelize.define("Imagen", {
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
});

export default Imagen;

import Publicacion from "./Publicacion.js";

Imagen.belongsTo(Publicacion, {
    foreignKey: "publicacion_id"
});

Publicacion.hasMany(Imagen, {
    foreignKey: "publicacion_id"
});