import Coleccion from "../models/Coleccion.js";

import Publicacion from "../models/Publicacion.js";

import Imagen from "../models/Imagen.js";
import User from "../models/User.js";
import Comentario from "../models/Comentario.js";
import Valoracion from "../models/Valoracion.js";
import Tag from "../models/Tag.js";

// Mostrar colecciones del usuario
export const showColecciones =
async (req, res) => {

    const usuarioId =
        req.session.usuario.id;

    try {

        const colecciones =
            await Coleccion.findAll({

                where: {
                    usuario_id: usuarioId
                },

                include: [
                    {
                        model: Publicacion,

                        include: [Imagen]
                    }
                ],

                
            });

        res.render(
            "pages/colecciones",
            {
                colecciones,
                usuario:
                    req.session.usuario
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al cargar colecciones",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

// Crear conexion entre publicacion y coleccion

export const crearColeccion =
async (req, res) => {

    const { nombre } = req.body;

    const usuarioId =
        req.session.usuario.id;

    try {

        await Coleccion.create({

            nombre,

            usuario_id: usuarioId
        });

        res.redirect("/colecciones");

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al crear coleccion",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

// Guardar publicación en colección

export const guardarPublicacion =
async (req, res) => {

    const { coleccion_id } = req.body;

    const publicacionId =
        req.params.id;

    const usuarioId =
        req.session.usuario.id;

    try {

        // Buscar la colección con sus publicaciones para validar propietario y evitar duplicados

        const coleccion =
            await Coleccion.findByPk(
                coleccion_id,
                {
                    include: [Publicacion]
                }
            );

        if (!coleccion) {

            return res.send(
                "Colección no encontrada"
            );
        }

        // validar el usuario propietario de la colección
 
        if (
            coleccion.usuario_id != usuarioId
        ) {

            return res.send(
                "No autorizado"
            );
        }

  
        // Evitar agregar la misma publicación varias veces a la misma colección
  
        const yaExiste =
            coleccion.Publicacions.some(
                p => p.id == publicacionId
            );

        if (yaExiste) {

            return res.redirect(
                "/publicaciones"
            );
        }

        // Agregar la publicación a la colección
      
        const publicacion =
            await Publicacion.findByPk(
                publicacionId
            );

        await coleccion.addPublicacion(
            publicacion
        );

        res.redirect("/publicaciones");

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al guardar publicacion",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

// Ver coleccion

export const showColeccion =
async (req, res) => {

    const coleccionId =
        req.params.id;

    const usuarioId =
        req.session.usuario.id;

    try {

        const coleccion =
            await Coleccion.findByPk(
                coleccionId,
                {

                    include: [

                        {
                            model: Publicacion,

                            include: [

                                {
                                    model: User,
                                    attributes: [
                                        "id",
                                        "username"
                                    ]
                                },

                                {
                                    model: Imagen,

                                    include: [

                                        {
                                            model: Comentario,

                                            include: [
                                                User
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
                            ]
                        }
                    ]
                }
            );

        if (!coleccion) {

            return res.send(
                "Colección no encontrada"
            );
        }

       
        // Validar que el usuario sea el propietario de la colección para mostrarla

        if (
            coleccion.usuario_id != usuarioId
        ) {

            return res.send(
                "No autorizado"
            );
        }

     
        // Promedio de valoraciones para cada imagen
  
        coleccion.Publicacions.forEach(
            pub => {

                pub.Imagens.forEach(
                    img => {

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
                                    img
                                    .Valoracions
                                    .length
                                ).toFixed(1);

                        } else {

                            img.promedio = 0;
                        }
                    }
                );
            }
        );

        res.render(
            "pages/posts",
            {

                publicaciones:
                    coleccion.Publicacions,

                usuario:
                    req.session.usuario,

                colecciones:
                    await Coleccion.findAll({

                        where: {
                            usuario_id:
                                usuarioId
                        }
                    }),

                mensaje:
                    `Colección: ${coleccion.nombre}`
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al cargar coleccion",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};