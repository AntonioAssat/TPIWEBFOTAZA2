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
import DenunciaComentario from "../models/DenunciaComentario.js";
import { Op } from "sequelize";
import {
    isRequired
}
from "../helpers/validations.js";

// Mostrar formulario
export const showCreatePost =(req, res) => {

        const error = req.query.error || null;

        res.render("pages/createPost",{
                error
            });
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
            if (!isRequired(titulo)) {
                return res.redirect(
                    "/publicaciones/nueva?error=El título es obligatorio"
            );
            }

            if (titulo.length < 3) {

                return res.redirect(
                    "/publicaciones/nueva?error=El título debe tener al menos 3 caracteres"
                );
            }

            if (!imagenesBase64) {

                return res.redirect(
                    "/publicaciones/nueva?error=Debés subir al menos una imagen"
                );
            }
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

        res.status(500).render("pages/error",{
        codigo: "500",
        mensaje:"Error al cargar perfil",
        descripcion:"Intentá nuevamente más tarde."
        });
    }
};
//mostrar las publicaciones mas usuario
export const showPosts = async (req, res) => {

    try {
        // BUSCADOR
        const search = req.query.search || "";
        const error =req.query.error || null;
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

                            include: [

                                {
                                    model: User
                                },

                                {
                                    model: DenunciaComentario,

                                    include: [
                                        {
                                            model: User
                                        }
                                    ]
                                }
                            ]
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

        // PREPARAR DATOS PARA LA VISTA
        publicaciones.forEach(pub => {

            pub.Imagens.forEach(img => {

                // promedio valoraciones
                if (
                    img.Valoracions &&
                    img.Valoracions.length > 0
                ) {

                    const suma =
                        img.Valoracions.reduce(
                            (acc, v) =>
                                acc + v.valor,
                            0
                        );

                    img.promedio = (
                        suma /
                        img.Valoracions.length
                    ).toFixed(1);

                } else {
                    img.promedio = 0;
                }
                img.tieneValoraciones =img.Valoracions && img.Valoracions.length > 0;
                img.tieneComentarios =img.Comentarios && img.Comentarios.length > 0;
                img.estaEnRevision =img.estado == "en_revision";
                img.esCopyright =img.licencia == "copyright";
                img.esAutor =req.session.usuario && pub.User && req.session.usuario.id == pub.User.id;
                img.puedeCerrarComentarios = img.esAutor && !img.comentarios_cerrados;
                img.puedeAbrirComentarios =img.esAutor && img.comentarios_cerrados;
                img.usuarioLogueado =!!req.session.usuario;
                img.puedeDenunciarImagen =img.usuarioLogueado && !img.esAutor;
                // puede valorar
                img.puedeValorar =
                    req.session.usuario &&
                    req.session.usuario.id !==
                    pub.usuario_id;

                // comentarios abiertos
                img.puedeComentar =
                    !img.comentarios_cerrados;

                // preparar comentarios
                if (
                    img.Comentarios
                ) {

                    img.Comentarios.forEach(c => {

                        c.puedeDenunciar =
                            req.session.usuario &&
                            req.session.usuario.id !==
                            c.usuario_id;
                    });
                }
            });
        });
        const publicacionesFiltradas =
            publicaciones.filter(

                pub =>

                    pub.Imagens &&
                    pub.Imagens.length > 0
            );
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
            publicaciones:publicacionesFiltradas,
            colecciones,
            error
        });

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error", {
            codigo: "500",
            mensaje: "Error al cargar publicaciones",
            descripcion: "Intentá nuevamente más tarde."
        });
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

        res.redirect("/publicaciones?mensaje=Imagen agregada correctamente");

    } catch (error) {
        console.error(error);
        res.status(500).render("pages/error",{
        codigo: "500",
        mensaje:"Error al guardar imagen",
        descripcion:"Intentá nuevamente más tarde."
    });
    }
};
//comentarios

export const addComment = async (req, res) => {

    const { texto } = req.body;

    const imagenId =
        req.params.id;

    const usuarioId =
        req.session.usuario.id;

    try {
                    if (!isRequired(texto)) {

                        return res.redirect(
                            "/publicaciones?error=El comentario no puede estar vacío"
                        );
                    }

                    if (texto.length > 300) {

                        return res.redirect(
                            "/publicaciones?error=Máximo 300 caracteres"
                        );
                    }
        
        // Buscar imagen de la publicación
   
        const imagen =
            await Imagen.findByPk(
                imagenId
            );

        if (!imagen) {

            res.status(404).render("pages/error",{
                codigo: "404",
                mensaje:"Imagen no encontrada",
                descripcion:"La imagen no existe."
            });
        }

      
        // Comentarios cerrados
   
        if (
            imagen.comentarios_cerrados
        ) {

            return res.redirect(
                "/publicaciones?error=Los comentarios están cerrados"
            );
        }

        // Crear comentario
   
        await Comentario.create({

            texto,

            imagen_id:
                imagenId,

            usuario_id:
                usuarioId
        });

        // Publicación
 
        const publicacion =
            await Publicacion.findByPk(
                imagen.publicacion_id
            );

        // No notificar si el autor comenta su propia publicación

        if (
            publicacion.usuario_id !=
            usuarioId
        ) {

            await Notificacion.create({

                tipo: "comentario",

                mensaje:
                    "comentó tu publicación",

                usuario_id:
                    publicacion.usuario_id,

                usuario_accion_id:
                    usuarioId
            });
        }

        // Redirect
  
        res.redirect(
            "/publicaciones"
        );

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
        codigo: "500",
        mensaje:"Error al guardar comentario",
        descripcion:"Intentá nuevamente más tarde."
    });
    }
};
//cerrar comentarios
export const closeComments = async (req, res) => {

    const imagenId =
        req.params.id;

    const usuarioId =
        req.session.usuario.id;

    try {

        // Buscar imagen de la publicación
  
        const imagen =
            await Imagen.findByPk(
                imagenId
            );

        if (!imagen) {

            res.status(404).render("pages/error",{
                codigo: "404",
                mensaje:"Imagen no encontrada",
                descripcion:"La imagen no existe."
                }
);
        }

        // Publicación

        const publicacion =
            await Publicacion.findByPk(
                imagen.publicacion_id
            );

        // Solo el autor puede cerrar comentarios

        if (publicacion.usuario_id != usuarioId) {
            return res.redirect("/publicaciones?error=No autorizado");
        }

        // Cerrar comentarios
        
        imagen.comentarios_cerrados =
            true;

        await imagen.save();

        res.redirect(
            "/publicaciones"
        );

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
        codigo: "500",
        mensaje:"Error al cerrar comentario",
        descripcion:"Intentá nuevamente más tarde."
    });
    }
};
//abrir comentarios
export const openComments = async (req, res) => {

    const imagenId =
        req.params.id;

    const usuarioId =
        req.session.usuario.id;

    try {

        const imagen =
            await Imagen.findByPk(
                imagenId
            );

        if (!imagen) {
            res.status(404).render("pages/error",{
                codigo: "404",
                mensaje:"Publicación no encontrada",
                descripcion:"La publicación no existe."
    }
);
        }

        const publicacion =
            await Publicacion.findByPk(
                imagen.publicacion_id
            );

        // solo autor
        if (publicacion.usuario_id !=usuarioId) {
            return res.redirect("/publicaciones?error=No autorizado");
        }

        imagen.comentarios_cerrados =
            false;

        await imagen.save();

        res.redirect(
            "/publicaciones"
        );

    } catch (error) {

        console.error(error);
        res.status(500).render("pages/error",{
        codigo: "500",
        mensaje:"Error al abrir comentarios",
        descripcion:"Intentá nuevamente más tarde."
        });
        
    }
};

//valoraciones

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

            res.status(404).render("pages/error",{
                codigo: "404",
                mensaje: "Imagen no encontrada",
                descripcion:"La publicación no existe."
    }
);
        }

        // Buscar publicación

        const publicacion =
            await Publicacion.findByPk(
                imagen.publicacion_id
            );

        // Bloquear si es propia
 
        if (publicacion.usuario_id == usuarioId) {

            req.session.mensaje =
                "No podés valorar tu propia imagen";

            return res.redirect(
                "/publicaciones"
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
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al valorizar",
            descripcion:"Intentá nuevamente más tarde."
        });
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

        //  crear denuncia
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
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al agregar denuncia",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};
//mostrar feed de seguidos
export const showFeedSeguidos =
async (req, res) => {

    const usuarioId =
        req.session.usuario.id;

    try {

        // ======================
        // OBTENER SEGUIDOS
        // ======================
        const follows =
            await Follow.findAll({

                where: {
                    seguidor_id:
                        usuarioId
                }
            });

        const idsSeguidos =
            follows.map(

                f => f.seguido_id
            );

        // ======================
        // PUBLICACIONES
        // ======================
        const publicaciones =
            await Publicacion.findAll({

                where: {

                    usuario_id:
                        idsSeguidos
                },

                include: [

                    {
                        model: User,

                        attributes: [
                            "id",
                            "username",
                            "avatar"
                        ]
                    },

                    {
                        model: Imagen,

                        where: {
                            estado: "activa"
                        },

                        required: false,

                        include: [

                            {
                                model: Comentario,

                                include: [
                                    {
                                        model: User
                                    }
                                ]
                            },

                            {
                                model: Valoracion
                            }
                        ]
                    },

                    {
                        model: Tag
                    }
                ],

                order: [["fecha", "DESC"]]
            });

        // ======================
        // PROMEDIOS
        // ======================
        publicaciones.forEach(pub => {

            pub.Imagens.forEach(img => {

                if (
                    img.Valoracions &&
                    img.Valoracions.length > 0
                ) {

                    const suma =
                        img.Valoracions.reduce(

                            (acc, v) =>
                                acc + v.valor,

                            0
                        );

                    img.promedio =
                        (
                            suma /
                            img.Valoracions.length
                        ).toFixed(1);

                } else {

                    img.promedio = 0;
                }
            });
        });

        const publicacionesFiltradas =
            publicaciones.filter(

                pub =>

                    pub.Imagens &&
                    pub.Imagens.length > 0
            );

        // ======================
        // COLECCIONES
        // ======================
        const colecciones =
            await Coleccion.findAll({

                where: {
                    usuario_id:
                        usuarioId
                }
            });

        // ======================
        // RENDER
        // ======================
        res.render(
            "pages/posts",

            {
                publicaciones: publicacionesFiltradas,
                colecciones
            }
        );

    } catch (error) {

        console.error(error);
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al mostrar feed seguidos",
            descripcion:"Intentá nuevamente más tarde."
        });
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
            res.status(404).render("pages/error",{
            codigo: "404",
            mensaje:"Imagen no encontrada",
            descripcion:"La imagen no existe."
    });
            
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
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al marcar interes",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

//denuncias de comentarios
export const denunciarComentario = async (req, res) => {

    const comentarioId = req.params.id;

    const usuarioId = req.session.usuario.id;

    const {motivo, descripcion} = req.body;

    try {
        // Comentario

        const comentario = await Comentario.findByPk(comentarioId);

        if (!comentario) {

            req.session.mensaje = "Comentario no encontrado";

            return res.redirect("/publicaciones");
        }

     
        // No denunciar propio comentario
 
        const existente = await DenunciaComentario.findOne({

                where: {

                    comentario_id:
                        comentarioId,

                    usuario_id:
                        usuarioId
                }
            });

        if (existente) {

            req.session.mensaje = "Ya denunciaste este comentario";

            return res.redirect("/publicaciones");
        }

        // Crear denuncia
    
        await DenunciaComentario.create({

            motivo,
            descripcion,
            comentario_id:
                comentarioId,
            usuario_id:
                usuarioId
        });

        req.session.mensaje =
            "Comentario denunciado correctamente";

        res.redirect(
            "/publicaciones"
        );

    } catch (error) {

        console.error(error);
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al denunciar comentario",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};
//eliminar comentario (solo autor de la publicación)
export const deleteComment =
async (req, res) => {

    const comentarioId =
        req.params.id;

    const usuarioId =
        req.session.usuario.id;

    try {

        // ======================
        // COMENTARIO
        // ======================
        const comentario =
            await Comentario.findByPk(
                comentarioId
            );

        if (!comentario) {

            req.session.mensaje =
                "Comentario no encontrado";

            return res.redirect(
                "/publicaciones"
            );
        }

        // ======================
        // IMAGEN
        // ======================
        const imagen =
            await Imagen.findByPk(
                comentario.imagen_id
            );

        // ======================
        // PUBLICACIÓN
        // ======================
        const publicacion =
            await Publicacion.findByPk(
                imagen.publicacion_id
            );

        // ======================
        // SOLO AUTOR
        // ======================
        if (
            publicacion.usuario_id !=
            usuarioId
        ) {

            req.session.mensaje =
                "No autorizado";

            return res.redirect(
                "/publicaciones"
            );
        }

        // ======================
        // ELIMINAR DENUNCIAS
        // ======================
        await DenunciaComentario.destroy({

            where: {

                comentario_id:
                    comentarioId
            }
        });

        // ======================
        // ELIMINAR COMENTARIO
        // ======================
        await comentario.destroy();

        req.session.mensaje ="Comentario eliminado correctamente";

        res.redirect("/publicaciones");

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error aleliminar comentario",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

export const deletePost =
async (req, res) => {

    const publicacionId =
        req.params.id;

    const usuarioId =
        req.session.usuario.id;

    try {

        // ======================
        // PUBLICACIÓN
        // ======================
        const publicacion =
            await Publicacion.findByPk(

                publicacionId,

                {
                    include: [
                        {
                            model: Imagen
                        }
                    ]
                }
            );

        if (!publicacion) {

            req.session.mensaje =
                "Publicación no encontrada";

            return res.redirect(
                "/publicaciones"
            );
        }

        // ======================
        // SOLO AUTOR
        // ======================
        if (
            publicacion.usuario_id !=
            usuarioId
        ) {

            req.session.mensaje =
                "No autorizado";

            return res.redirect(
                "/publicaciones"
            );
        }

        // ======================
        // BLOQUEAR SI HAY REVISIÓN
        // ======================
        const enRevision =
            publicacion.Imagens.some(

                img =>
                    img.estado ===
                    "en_revision"
            );

        if (enRevision) {

            req.session.mensaje =
                "No podés eliminar una publicación en revisión";

            return res.redirect(
                `/perfil/${usuarioId}`
            );
        }

        // ======================
        // ELIMINAR IMÁGENES
        // ======================
        for (
            const img
            of publicacion.Imagens
        ) {

            img.estado =
                "eliminada";

            await img.save();
        }

        req.session.mensaje =
            "Publicación eliminada correctamente";

        res.redirect(
            `/perfil/${usuarioId}`
        );

    } catch (error) {

        console.error(error);
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al eliminar publicacion",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

//editar post
export const showEditPost =
async (req, res) => {

    const publicacionId =
        req.params.id;

    const usuarioId =
        req.session.usuario.id;

    try {

        // ======================
        // PUBLICACIÓN
        // ======================
        const publicacion =
            await Publicacion.findByPk(

                publicacionId,

                {

                    include: [

                        {
                            model: Imagen
                        },

                        {
                            model: Tag
                        }
                    ]
                }
            );

        if (!publicacion) {

            return res.redirect(
                `/perfil/${usuarioId}?error=Publicación no encontrada`
            );
        }

        // ======================
        // SOLO AUTOR
        // ======================
        if ( publicacion.usuario_id != usuarioId) {
            return res.redirect(
                `/perfil/${usuarioId}?error=No autorizado`
            );
        }

        // ======================
        // BLOQUEAR REVISIÓN
        // ======================
        const enRevision =
            publicacion.Imagens.some(

                img =>
                    img.estado ===
                    "en_revision"
            );

        if (enRevision) {
            return res.redirect(
                `/perfil/${usuarioId}?error=No podés editar publicaciones en revisión`
            );
        }

        // ======================
        // TAGS STRING
        // ======================
        const tagsString =
            publicacion.Tags.map(

                t => t.nombre

            ).join(", ");

        // ======================
        // RENDER
        // ======================
        const error =req.query.error || null;

        res.render("pages/editPost",{
            publicacion,
            tagsString,
            error
            }
        );

    } catch (error) {

        console.error(error);
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al cargar edicion",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};
 
//editat post
export const editPost =
async (req, res) => {

    const publicacionId =
        req.params.id;

    const usuarioId =
        req.session.usuario.id;

    const {
        titulo,
        descripcion,
        tags
    } = req.body;

    try {
            if (!isRequired(titulo)) {

                return res.redirect(
                    `/publicaciones/${publicacionId}/editar?error=El título es obligatorio`
                );
            }

            if (titulo.length < 3) {

                return res.redirect(
                    `/publicaciones/${publicacionId}/editar?error=El título debe tener al menos 3 caracteres`
                );
            }
        // ======================
        // PUBLICACIÓN
        // ======================
        const publicacion =await Publicacion.findByPk(

                publicacionId,

                {

                    include: [

                        {
                            model: Imagen
                        },

                        {
                            model: Tag
                        }
                    ]
                }
            );

        if (!publicacion) {
            return res.redirect(
                `/perfil/${usuarioId}?error=Publicación no encontrada`
            );
        }

        // ======================
        // SOLO AUTOR
        // ======================
        if (publicacion.usuario_id != usuarioId) {
            return res.redirect(
                `/perfil/${usuarioId}?error=No autorizado`
            );
        }

        // ======================
        // BLOQUEAR REVISIÓN
        // ======================
        const enRevision =
            publicacion.Imagens.some(

                img =>
                    img.estado ===
                    "en_revision"
            );

        if (enRevision) {
            return res.redirect(
                `/perfil/${usuarioId}?error=No podés editar publicaciones en revisión`
            );
        }

        // ======================
        // ACTUALIZAR
        // ======================
        publicacion.titulo =
            titulo;

        publicacion.descripcion =
            descripcion;

        await publicacion.save();

        // ======================
        // TAGS
        // ======================
        const nuevosTags = [];

        if (tags && tags.trim() !== "") {

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

                if (!tag) {

                    tag =
                        await Tag.create({

                            nombre:
                                nombreTag
                        });
                }

                nuevosTags.push(tag);
            }
        }

        // ======================
        // REEMPLAZAR TAGS
        // ======================
        await publicacion.setTags(
            nuevosTags
        );

        res.redirect(
            `/perfil/${usuarioId}?mensaje=Publicación actualizada correctamente`
        );

    } catch (error) {

        console.error(error);
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al editar publicacion",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};