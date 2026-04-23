import express from "express";
import { home } from "../controllers/indexController.js";

const router = express.Router();

router.get("/", home);

router.get("/perfil", (req, res) => {
    if (!req.session.usuario) {
        return res.send("No estás logueado");
    }

    res.send(`Perfil de ${req.session.usuario.username}`);
});
export default router;