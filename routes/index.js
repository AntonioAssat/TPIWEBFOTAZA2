import express from "express";
import { showHome } from "../controllers/indexController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", showHome);

//ruta protegida
router.get("/perfil", isAuthenticated, (req, res) => {
    res.send(`Perfil de ${req.session.usuario.username}`);
});

export default router;