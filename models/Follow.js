import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Follow extends Model {}

Follow.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }
}, {
    sequelize,
    modelName: "Follow",
    tableName: "Follows",
    timestamps: false
});

export default Follow;

// relaciones
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