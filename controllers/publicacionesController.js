import fs from "fs/promises";
//import db from "../config/db.js";
import Publicacion from "../models/Publicacion.js";
import User from "../models/User.js";
import Comentario from "../models/Comentario.js";
import Valoracion from "../models/Valoracion.js";
import Denuncia from "../models/Denuncia.js";
import Follow from "../models/Follow.js";
import Imagen from "../models/Imagen.js";
import Notificacion from "../models/Notificacion.js";
import Tag from "../models/Tag.js";
import Interes from "../models/Interes.js";
import Conversacion from "../models/Conversacion.js";
import Coleccion from "../models/Coleccion.js";
import { Op } from "sequelize";
const path = "./data/publicaciones.json";

// Mostrar formulario
export const showCreatePost = (req, res) => {
    res.render("pages/createPost");
};

// Crear publicación
export const createPost = async (req, res) => {

    const {
        titulo,
        descripcion,
        tags,
        licencia,
        watermark,
        imagenesBase64
    } = req.body;

    const usuarioId =
        req.session.usuario.id;

    try {

        // ======================
        // CREAR PUBLICACIÓN
        // ======================
        const publicacion =
            await Publicacion.create({

                titulo,

                descripcion,

                usuario_id:
                    usuarioId
            });

        // ======================
        // TAGS
        // ======================
        if (tags) {

            const listaTags =
                tags.split(",");

            for (let nombreTag of listaTags) {

                nombreTag =
                    nombreTag
                        .trim()
                        .toLowerCase();

                let tag =
                    await Tag.findOne({

                        where: {
                            nombre:
                                nombreTag
                        }
                    });

                // crear si no existe
                if (!tag) {

                    tag =
                        await Tag.create({

                            nombre:
                                nombreTag
                        });
                }

                // relacionar
                await publicacion.addTag(
                    tag
                );
            }
        }

        // ======================
        // IMÁGENES BASE64
        // ======================
        if (imagenesBase64) {

            // si viene una sola
            const listaImagenes =
                Array.isArray(
                    imagenesBase64
                )
                    ? imagenesBase64
                    : [imagenesBase64];

            for (
                const base64
                of listaImagenes
            ) {

                await Imagen.create({

                    url: base64,

                    licencia,

                    watermark,

                    estado: "activa",

                    publicacion_id:
                        publicacion.id
                });
            }
        }

        // ======================
        // REDIRECT
        // ======================
        res.redirect(
            "/publicaciones"
        );

    } catch (error) {

        console.error(error);

        res.send(
            "Error al crear publicación"
        );
    }
};
//mostrar las publicaciones mas usuario
export const showPosts = async (req, res) => {

    try {
        // BUSCADOR
        const search = req.query.search || "";

        const publicaciones = await Publicacion.findAll({

            where: {
                titulo: {
                    [Op.iLike]: `%${search}%`
                }
            },

            include: [
                // USUARIO
                {
                    model: User,
                    attributes: ["id", "username"]
                },
                // IMÁGENES

                {
                    model: Imagen,

                    // SI NO ESTÁ LOGUEADO
                    // SOLO VE IMÁGENES PÚBLICAS
                    where: {

                        estado: {
                            [Op.ne]: "eliminada"
                        },

                        ...( !req.session.usuario
                            ? {
                                licencia: {
                                    [Op.ne]: "copyright"
                                }
                            }
                            : {}
                        )
                    },

                    required: false,

                    include: [

                        // COMENTARIOS
                        {
                            model: Comentario,
                            include: [{ model: User }]
                        },

                        // VALORACIONES
                        {
                            model: Valoracion
                        }
                    ]
                },
                // TAGS
                {
                    model: Tag,

                    where: search
                        ? {
                              nombre: {
                                  [Op.iLike]: `%${search}%`
                              }
                          }
                        : undefined,

                    required: false
                }
            ]
        });

        // PROMEDIO VALORACIONES
        publicaciones.forEach(pub => {

            pub.Imagens.forEach(img => {

                if (img.Valoracions && img.Valoracions.length > 0) {

                    const suma = img.Valoracions.reduce(
                        (acc, v) => acc + v.valor,
                        0
                    );

                    img.promedio = (
                        suma / img.Valoracions.length
                    ).toFixed(1);

                } else {

                    img.promedio = 0;
                }
            });
        });
        let colecciones = [];

        if (req.session.usuario) {

            colecciones =
                await Coleccion.findAll({

                    where: {
                        usuario_id:
                            req.session.usuario.id
                    }
                });
        }
        res.render("pages/posts", {
            publicaciones,
            colecciones
        });

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
        //notificacion
        // buscar imagen
        const imagen = await Imagen.findByPk(imagenId);

        // buscar publicación
        const publicacion = await Publicacion.findByPk(imagen.publicacion_id);

        // evitar notificarse a sí mismo
        if (publicacion.usuario_id != usuarioId) {

            await Notificacion.create({
                tipo: "comentario",
                mensaje: "comentó tu publicación",
                usuario_id: publicacion.usuario_id,
                usuario_accion_id: usuarioId
            });
        }

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

    const usuarioId =
        req.session.usuario.id;

    try {

        // Buscar imagen
  
        const imagen =
            await Imagen.findByPk(
                imagenId
            );

        if (!imagen) {

            return res.send(
                "Imagen no encontrada"
            );
        }

        // Buscar publicación

        const publicacion =
            await Publicacion.findByPk(
                imagen.publicacion_id
            );

        // Bloquear si es propia
 
        if (
            publicacion.usuario_id ==
            usuarioId
        ) {

            return res.send(
                "No podés valorar tu propia imagen"
            );
        }

        // Buscar valoración existente

        const existente =
            await Valoracion.findOne({

                where: {

                    imagen_id:
                        imagenId,

                    usuario_id:
                        usuarioId
                }
            });

        // Actualizar si existe, sino crear

        if (existente) {

            existente.valor =
                valor;

            await existente.save();

        } else {

            // Crear nueva valoración

            await Valoracion.create({

                valor,

                imagen_id:
                    imagenId,

                usuario_id:
                    usuarioId
            });
        }

        // Notificación

        await Notificacion.create({

            tipo: "valoracion",

            mensaje:
                "valoró tu imagen",

            usuario_id:
                publicacion.usuario_id,

            usuario_accion_id:
                usuarioId
        });

        // ======================
        // REDIRECT
        // ======================
        res.redirect(
            "/publicaciones"
        );

    } catch (error) {

        console.error(error);

        res.send(
            "Error al valorar"
        );
    }
};
//denuncias
export const addDenuncia = async (req, res) => {
    const { motivo, descripcion } = req.body;
    const imagenId = req.params.id;
    const usuarioId = req.session.usuario.id;

    try {
        const imagen = await Imagen.findByPk(imagenId);

        if (!imagen) {
            req.session.mensaje = "Imagen no encontrada";
            return res.redirect("/publicaciones");
        }
        if (imagen.estado === "en_revision") {
            req.session.mensaje = "Esta imagen ya está en revisión";
            return res.redirect("/publicaciones");
        }
        //  no denunciar propia imagen
        if (imagen.usuario_id == usuarioId) {
            req.session.mensaje = "No podés denunciar tu propia imagen";
            return res.redirect("/publicaciones");
        }

        //  si ya está en revisión
        if (imagen.estado === "en_revision") {
            req.session.mensaje = "Esta imagen ya está en revisión";
            return res.redirect("/publicaciones");
        }

        //  evitar duplicadas
        const existente = await Denuncia.findOne({
            where: {
                imagen_id: imagenId,
                usuario_id: usuarioId
            }
        });

        if (existente) {
            req.session.mensaje = "Ya denunciaste esta imagen";
            return res.redirect("/publicaciones");
        }

        // ✔ crear denuncia
        await Denuncia.create({
            motivo,
            descripcion,
            imagen_id: imagenId,
            usuario_id: usuarioId
        });

        // contar denuncias
        const total = await Denuncia.count({
            where: { imagen_id: imagenId }
        });

        // cambiar estado
       if (total > 3) {

            imagen.estado = "en_revision";

            req.session.mensaje =
                "La imagen pasó a revisión por múltiples denuncias";

        } else {

            imagen.estado = "denunciada";

            req.session.mensaje =
                `Denuncia registrada (${total}/4)`;
        }
        await imagen.save();

        

        res.redirect("/publicaciones");

    } catch (error) {
        console.error(error);
        res.send("Error al denunciar");
    }
};

export const showFeedSeguidos = async (req, res) => {
    const usuarioId = req.session.usuario.id;

    try {
        // obtener a quién sigo
        const follows = await Follow.findAll({
            where: { seguidor_id: usuarioId }
        });

        const idsSeguidos = follows.map(f => f.seguido_id);

        // traer publicaciones solo de esos usuarios
        const publicaciones = await Publicacion.findAll({
            where: {
                usuario_id: idsSeguidos
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "username"]
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

        // promedio valoraciones (igual que ya tenías)
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
        res.send("Error al cargar feed");
    }
};
//marcar el interes en la imagen
export const marcarInteres = async (req, res) => {
    console.log("Entró a marcarInteres");
    const imagenId = req.params.id;

    const usuarioId = req.session.usuario.id;

    try {
        // BUSCAR IMAGEN
        const imagen = await Imagen.findByPk(
            imagenId,
            {
                include: [
                    {
                        model: Publicacion,
                        include: [User]
                    }
                ]
            }
        );

        if (!imagen) {

            return res.send("Imagen no encontrada");
        }
        // EVITAR DUPLICADOS
        const existe = await Interes.findOne({

            where: {
                usuario_id: usuarioId,
                imagen_id: imagenId
            }
        });

        if (existe) {

            return res.redirect("/publicaciones");
        }

        // CREAR INTERÉS
        
        await Interes.create({

            usuario_id: usuarioId,

            imagen_id: imagenId
        });


        // AUTOR
  
        const autorId =
            imagen.Publicacion.usuario_id;
        
            // Crear conversacion
      
        const conversacionExistente =
            await Conversacion.findOne({

                where: {

                    comprador_id: usuarioId,

                    autor_id: autorId,

                    imagen_id: imagenId
                }
            });

        let conversacion;

        if (!conversacionExistente) {

            conversacion =
                await Conversacion.create({

                    comprador_id: usuarioId,

                    autor_id: autorId,

                    imagen_id: imagenId
                });

        } else {
            conversacion =conversacionExistente;
            }

        // NOTIFICACIÓN
        await Notificacion.create({

            tipo: "interes",

            mensaje:
                "está interesado en adquirir tu imagen",

            usuario_id: autorId,

            usuario_accion_id: usuarioId,

            conversacion_id: conversacion.id
        });

        res.redirect(`/conversaciones/${conversacion.id}`);

    } catch (error) {

        console.error(error);

        res.send("Error al marcar interés");
    }
};