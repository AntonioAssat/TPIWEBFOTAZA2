import Denuncia from "../models/Denuncia.js";
import Imagen from "../models/Imagen.js";
import User from "../models/User.js";
import Publicacion from "../models/Publicacion.js";
// Ver denuncias para administración

export const showDenuncias =async (req, res) => {

    try {
        const denuncias =await Denuncia.findAll({
            where: {

                resuelta: false
            },

                include: [

                    {
                        model: Imagen
                    },

                    {
                        model: User
                    }
                ],

                order: [
                    ["fecha", "DESC"]
                ]
            });

        res.render("pages/adminDenuncias",
            {
                denuncias,
                usuario:req.session.usuario
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al cargar denuncias",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

// Aprobar denuncia (eliminar imagen)

export const aprobarImagen =async (req, res) => {
    const imagenId =req.params.id;

    try {

        const imagen =await Imagen.findByPk(imagenId);

        if (!imagen) {

            return res.send("Imagen no encontrada");
        }

        // restaurar
        imagen.estado = "activa";

        await imagen.save();

        await Denuncia.update(
            {
                resuelta: true
            },
            {
                where: {
                    imagen_id: imagenId
                }
            }
        );
                res.redirect("/admin/denuncias");

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al aprobar imagen",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

// Eliminar imagen (marcar como eliminada)

export const eliminarImagen =async (req, res) => {

    const imagenId =req.params.id;

    try {
        // BUSCAR IMAGEN
        const imagen =await Imagen.findByPk(imagenId);

        if (!imagen) {

            req.session.mensaje ="Imagen no encontrada";

            return res.redirect("/admin/denuncias");
        }
        // ELIMINAR IMAGEN
  
        imagen.estado ="eliminada";

        await imagen.save();
        // BUSCAR PUBLICACIÓN

        const publicacion =await Publicacion.findByPk(imagen.publicacion_id);
        // BUSCAR AUTOR

        const usuario =await User.findByPk(publicacion.usuario_id);

        // SUMAR STRIKE
        usuario.publicaciones_eliminadas += 1;
        // DESACTIVAR CUENTA

        if (usuario.publicaciones_eliminadas >= 3) {

            usuario.estadoCuenta ="inactiva";

            req.session.mensaje =
                `Imagen eliminada. El usuario ${usuario.username} fue desactivado automáticamente`;

        } else {

            req.session.mensaje =
                `Imagen eliminada. Strike ${usuario.publicaciones_eliminadas}/3`;
        }

        await usuario.save();
        await Denuncia.update(
            {
                resuelta: true
            },
            {
                where: {
                    imagen_id: imagenId
                }
            }
        );
        // REDIRECT
 
        res.redirect("/admin/denuncias");

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al eliminar imagen",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};