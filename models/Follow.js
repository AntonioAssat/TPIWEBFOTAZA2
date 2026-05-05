import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Follow = sequelize.define("Follow", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }
});

export default Follow;
// Relaciones
import User from "./User.js";

User.belongsToMany(User, {
    as: "Seguidores",
    through: Follow,
    foreignKey: "seguido_id"
});

User.belongsToMany(User, {
    as: "Siguiendo",
    through: Follow,
    foreignKey: "seguidor_id"
});