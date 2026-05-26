import {
    DataTypes,
    Model
} from "sequelize";

import sequelize from "../config/database.js";

class Publicacion extends Model {}

Publicacion.init(

    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            },

        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
        },
        fecha: {
            type: DataTypes.DATE,
            defaultValue:DataTypes.NOW,
        }

    },

    {
    sequelize,
    modelName: "Publicacion",
    tableName: "Publicacions",
    timestamps: false
    }
);

export default Publicacion;

// RELACIONES

import User from "./User.js";

Publicacion.belongsTo(User,
    {
        foreignKey:"usuario_id"
    }
);

User.hasMany(Publicacion,
{
foreignKey: "usuario_id"
    }
);