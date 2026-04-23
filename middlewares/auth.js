export const isAuthenticated = (req, res, next) => {
    if (!req.session.usuario) {
        return res.send("Acceso denegado. Debes iniciar sesión.");
    }

    next();
};