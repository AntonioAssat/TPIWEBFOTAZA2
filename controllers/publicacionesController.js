import fs from "fs/promises";
//import db from "../config/db.js";
import Publicacion from "../models/Publicacion.js";
import User from "../models/User.js";
import Comentario from "../models/Comentario.js";


import Imagen from "../models/Imagen.js";
const path = "./data/publicaciones.json";

// Mostrar formulario
export const showCreatePost = (req, res) => {
    res.render("pages/createPost");
};

// Crear publicación
export const createPost = async (req, res) => {
    const { titulo, descripcion } = req.body;
    const usuarioId = req.session.usuario.id;

    try {
        await Publicacion.create({
            titulo,
            descripcion,
            usuario_id: usuarioId
        });

        res.send("Publicación creada con Sequelize");

    } catch (error) {
        console.error(error);
        res.send("Error al crear publicación");
    }
};
//mostrar las publicaciones mas usuario
export const showPosts = async (req, res) => {
    try {
        const publicaciones = await Publicacion.findAll({
    include: [
        {
            model: User,
            attributes: ["username"]
        },
        {
            model: Imagen,
            include: [
                {
                    model: Comentario,
                    include: [
                        {
                            model: User,
                            attributes: ["username"]
                        }
                    ]
                }
            ]
        }
    ]
});

        res.render("pages/posts", { publicaciones });

    } catch (error) {
        console.error(error);
        res.send("Error al cargar publicaciones");
    }
};

// Mostrar formulario
export const showAddImage = (req, res) => {
    const publicacionId = req.params.id;
    res.render("pages/addImage", { publicacionId });
};

// Agregar imagen
export const addImage = async (req, res) => {
    const { url, licencia, watermark } = req.body;
    const publicacionId = req.params.id;

    try {
        await Imagen.create({
            url,
            licencia,
            watermark,
            publicacion_id: publicacionId
        });

        res.send("Imagen guardada con Sequelize");

    } catch (error) {
        console.error(error);
        res.send("Error al guardar imagen");
    }
};
//comentarios
const pathComentarios = "./data/comentarios.json";

export const addComentario = async (req, res) => {
    const { texto } = req.body;
    const imagenId = req.params.id;
    const usuarioId = req.session.usuario.id;

    try {
        await Comentario.create({
            texto,
            imagen_id: imagenId,
            usuario_id: usuarioId
        });

        res.redirect("/publicaciones");

    } catch (error) {
        console.error(error);
        res.send("Error al comentar");
    }
};

//valoraciones
const pathValoraciones = "./data/valoraciones.json";

export const addRating = async (req, res) => {
    const { valor } = req.body;
    const imagenId = req.params.id;
    const usuarioId = req.session.usuario.id;

    try {
        const data = await fs.readFile(pathValoraciones, "utf-8");
        const valoraciones = JSON.parse(data);

        // 🔒 evitar duplicados
        const yaValoro = valoraciones.find(v => 
            v.usuario_id === usuarioId && v.imagen_id === parseInt(imagenId)
        );

        if (yaValoro) {
            return res.send("Ya valoraste esta imagen");
        }

        const nuevaValoracion = {
            id: valoraciones.length + 1,
            valor: parseInt(valor),
            usuario_id: usuarioId,
            imagen_id: parseInt(imagenId)
        };

        valoraciones.push(nuevaValoracion);

        await fs.writeFile(pathValoraciones, JSON.stringify(valoraciones, null, 2));

        res.redirect("/publicaciones");

    } catch (error) {
        console.error(error);
        res.send("Error al valorar");
    }
};