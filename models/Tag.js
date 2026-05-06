import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Tag = sequelize.define("Tag", {

    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }

});

export default Tag;

//relaciones
import Publicacion from "./Publicacion.js";

Publicacion.belongsToMany(Tag, {
    through: "PublicacionTags"
});

Tag.belongsToMany(Publicacion, {
    through: "PublicacionTags"
});