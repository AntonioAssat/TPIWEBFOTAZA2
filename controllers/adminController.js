import Denuncia from "../models/Denuncia.js";
import Imagen from "../models/Imagen.js";
import User from "../models/User.js";

// Ver denuncias para administración

export const showDenuncias =
async (req, res) => {

    try {

        const denuncias =
            await Denuncia.findAll({

                include: [

                    {
                        model: Imagen
                    },

                    {
                        model: User
                    }
                ],

                order: [
                    ["createdAt", "DESC"]
                ]
            });

        res.render(
            "pages/adminDenuncias",
            {
                denuncias,
                usuario:
                    req.session.usuario
            }
        );

    } catch (error) {

        console.error(error);

        res.send(
            "Error al cargar denuncias"
        );
    }
};

// Aprobar denuncia (eliminar imagen)

export const aprobarImagen =
async (req, res) => {

    const imagenId =
        req.params.id;

    try {

        const imagen =
            await Imagen.findByPk(
                imagenId
            );

        if (!imagen) {

            return res.send(
                "Imagen no encontrada"
            );
        }

        // restaurar
        imagen.estado = "activa";

        await imagen.save();

        res.redirect(
            "/admin/denuncias"
        );

    } catch (error) {

        console.error(error);

        res.send(
            "Error al aprobar imagen"
        );
    }
};

// Eliminar imagen (marcar como eliminada)

export const eliminarImagen =
async (req, res) => {

    const imagenId =
        req.params.id;

    try {

        const imagen =
            await Imagen.findByPk(
                imagenId
            );

        if (!imagen) {

            return res.send(
                "Imagen no encontrada"
            );
        }

        imagen.estado = "eliminada";

        await imagen.save();

        res.redirect(
            "/admin/denuncias"
        );

    } catch (error) {

        console.error(error);

        res.send(
            "Error al eliminar imagen"
        );
    }
};