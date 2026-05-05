import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Denuncia = sequelize.define("Denuncia", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
    }
});

export default Denuncia;

//relaciones

import User from "./User.js";
import Imagen from "./Imagen.js";

Denuncia.belongsTo(User, {
    foreignKey: "usuario_id"
});

User.hasMany(Denuncia, {
    foreignKey: "usuario_id"
});

Denuncia.belongsTo(Imagen, {
    foreignKey: "imagen_id"
});

Imagen.hasMany(Denuncia, {
    foreignKey: "imagen_id"
});