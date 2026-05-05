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
        type: DataTypes.STRING,
        defaultValue: "/img/default.png"
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

export default User;