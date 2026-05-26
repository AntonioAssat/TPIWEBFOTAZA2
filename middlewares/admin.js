export const isAdmin = (req, res, next) => {

    if (
        !req.session.usuario ||
        req.session.usuario.rol != "admin"
    ) {

        return res.status(403).render(
            "pages/error",
            {
                codigo: "403",

                mensaje:
                    "Acceso denegado",

                descripcion:
                    "No tenés permisos para acceder."
            }
        );
    }

    next();
};