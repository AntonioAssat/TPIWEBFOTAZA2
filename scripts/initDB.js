import dotenv from "dotenv";

dotenv.config();

import sequelize from "../config/database.js";


import "../models/User.js";
import "../models/Publicacion.js";
import "../models/Imagen.js";
import "../models/Comentario.js";
import "../models/Valoracion.js";
import "../models/Tag.js";
import "../models/Notificacion.js";
import "../models/Coleccion.js";
import "../models/Denuncia.js";
import "../models/DenunciaComentario.js";
import "../models/Follow.js";
import "../models/Interes.js";
import "../models/Conversacion.js";
import "../models/Mensaje.js";

try {

    await sequelize.sync({
        alter: true
    });

    console.log("Base de datos inicializada correctamente");

    process.exit();

} catch (error) {

    console.error("Error al inicializar la base de datos:", error);

    process.exit(1);
}