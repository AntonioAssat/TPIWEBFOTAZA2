import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.TEXT("long"),
        defaultValue: "/img/default.png"
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estadoCuenta: {
    type: DataTypes.STRING,
    defaultValue: "activa"
    },
    rol: {
    type: DataTypes.STRING,
    defaultValue: "usuario"
   }, 
    fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
    },
    publicaciones_eliminadas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
    }
});

export default User;