export const isOwner =
    (req, res, next) => {

        const userId =
            req.params.id;

        if (
            req.session.usuario.id != userId
        ) {

            return res.status(403).render(
                "pages/error",
                {
                    codigo: "403",

                    mensaje:
                        "Acceso denegado",

                    descripcion:
                        "No podés modificar este perfil."
                }
            );
        }

        next();
    };