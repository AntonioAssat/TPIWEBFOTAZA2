import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Tag extends Model {}

Tag.init({
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: "Tag",
    tableName: "Tags",
    timestamps: false
});

export default Tag;

// relaciones
import Publicacion from "./Publicacion.js";

Publicacion.belongsToMany(Tag, {
    through: "PublicacionTags"
});

Tag.belongsToMany(Publicacion, {
    through: "PublicacionTags"
});