import fs from "fs/promises";
//import db from "../config/db.js";
import Publicacion from "../models/Publicacion.js";
import User from "../models/User.js";
import Comentario from "../models/Comentario.js";
import Valoracion from "../models/Valoracion.js";
import Denuncia from "../models/Denuncia.js";

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
                    include: [{ model: User }]
                },
                {
                    model: Valoracion
                }
            ]
        }
    ]
});
     // calculo del promedio de valoraciones para cada imagen
        publicaciones.forEach(pub => {
            pub.Imagens.forEach(img => {
                if (img.Valoracions && img.Valoracions.length > 0) {
                    const suma = img.Valoracions.reduce((acc, v) => acc + v.valor, 0);
                    img.promedio = (suma / img.Valoracions.length).toFixed(1);
                } else {
                    img.promedio = 0;
                }
            });
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

export const addComment = async (req, res) => {
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
        // Buscar si ya votó
        const existente = await Valoracion.findOne({
            where: {
                imagen_id: imagenId,
                usuario_id: usuarioId
            }
        });

        if (existente) {
            // actualizar voto
            existente.valor = valor;
            await existente.save();
        } else {
            // crear voto
            await Valoracion.create({
                valor,
                imagen_id: imagenId,
                usuario_id: usuarioId
            });
        }

        res.redirect("/publicaciones");

    } catch (error) {
        console.error(error);
        res.send("Error al valorar");
    }
};

//denuncias
export const addDenuncia = async (req, res) => {
    const { motivo, descripcion } = req.body;
    const imagenId = req.params.id;
    const usuarioId = req.session.usuario.id;

    try {
        const existente = await Denuncia.findOne({
            where: {
                imagen_id: imagenId,
                usuario_id: usuarioId
            }
        });

        if (existente) {
            // muestra mensaje y redirecciona
            req.session.mensaje = "Ya denunciaste esta imagen";
            return res.redirect("/publicaciones");
        }

        await Denuncia.create({
            motivo,
            descripcion,
            imagen_id: imagenId,
            usuario_id: usuarioId
        });

        req.session.mensaje = "Denuncia enviada correctamente";
        res.redirect("/publicaciones");

    } catch (error) {
        console.error(error);
        req.session.mensaje = "Error al denunciar";
        res.redirect("/publicaciones");
    }
};