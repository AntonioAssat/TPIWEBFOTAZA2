import Conversacion from "../models/Conversacion.js";
import Mensaje from "../models/Mensaje.js";
import User from "../models/User.js";
import Imagen from "../models/Imagen.js";
import { Op } from "sequelize";

// Listar conversaciones

export const showConversaciones =
async (req, res) => {

    const usuarioId =
        req.session.usuario.id;

    try {

        const conversaciones =
            await Conversacion.findAll({

                where: {

                    [Op.or]: [

                        {
                            comprador_id:
                                usuarioId
                        },

                        {
                            autor_id:
                                usuarioId
                        }
                    ]
                },

                include: [

                    {
                        model: User,
                        as: "Comprador"
                    },

                    {
                        model: User,
                        as: "Autor"
                    },

                    {
                        model: Imagen
                    }
                ],

                order: [["createdAt", "DESC"]]
            });

        res.render(
            "pages/conversaciones",
            {
                conversaciones,
                usuario:
                    req.session.usuario
            }
        );

    } catch (error) {

        console.error(error);

        res.send(
            "Error al cargar conversaciones"
        );
    }
};

// Ver el chat

export const showChat =
async (req, res) => {

    const conversacionId =
        req.params.id;

    try {

        const conversacion =
            await Conversacion.findByPk(
                conversacionId,
                {

                    include: [

                        {
                            model: User,
                            as: "Comprador"
                        },

                        {
                            model: User,
                            as: "Autor"
                        },

                        {
                            model: Imagen
                        },

                        {
                            model: Mensaje,

                            include: [
                                {
                                    model: User,
                                    as: "Emisor"
                                }
                            ],

                            order: [
                                ["createdAt", "ASC"]
                            ]
                        }
                    ]
                }
            );

        if (!conversacion) {

            return res.send(
                "Conversación no encontrada"
            );
        }
        // Validar el acceso a la conversación

        const usuarioId =
            req.session.usuario.id;

        if (

            conversacion.autor_id != usuarioId &&

            conversacion.comprador_id != usuarioId
        ) {

            return res.send(
                "No autorizado"
            );
        }

        res.render(
            "pages/chat",
            {
                conversacion,
                usuario:
                    req.session.usuario
            }
        );

    } catch (error) {

        console.error(error);

        res.send(
            "Error al cargar chat"
        );
    }
};
// Enviar mensajes

export const enviarMensaje =
async (req, res) => {

    const conversacionId =
        req.params.id;

    const { texto } = req.body;

    const usuarioId =
        req.session.usuario.id;

    try {
            const conversacion =
            await Conversacion.findByPk(
                conversacionId
            );

            if (!conversacion) {

                return res.send(
                    "Conversación no encontrada"
            );
        }

        if (

            conversacion.autor_id != usuarioId &&

            conversacion.comprador_id != usuarioId
        ) {

            return res.send(
                "No autorizado"
            );
        }
        await Mensaje.create({

            texto,

            emisor_id: usuarioId,

            conversacion_id:
                conversacionId
        });

        res.redirect(
            `/conversaciones/${conversacionId}`
        );

    } catch (error) {

        console.error(error);

        res.send(
            "Error al enviar mensaje"
        );
    }
};