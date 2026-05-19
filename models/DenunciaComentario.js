import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Comentario from "./Comentario.js";
import User from "./User.js";

const DenunciaComentario = sequelize.define("DenunciaComentario", {
    id: {
        type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    motivo: {
        type: DataTypes.STRING,
        allowNull: false
        },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
        }
    }
);

// Relaciones


Comentario.hasMany( DenunciaComentario, {
        foreignKey: "comentario_id"
    }
);

DenunciaComentario.belongsTo( Comentario, {
        foreignKey: "comentario_id"
    }
);

User.hasMany( DenunciaComentario, {
        foreignKey: "usuario_id"
    }
);

DenunciaComentario.belongsTo( User, {
        foreignKey: "usuario_id"
    }
);

export default DenunciaComentario;