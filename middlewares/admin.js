export const isAdmin = (req, res, next) => {

    if (
        !req.session.usuario ||
        req.session.usuario.rol != "admin"
    ) {

        return res.send(
            "Acceso denegado"
        );
    }

    next();
};