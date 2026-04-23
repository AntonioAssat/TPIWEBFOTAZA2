import express from "express";
import { 
    showCreatePost, 
    createPost 
} from "../controllers/publicacionesController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Mostrar formulario
router.get("/publicaciones/nueva", isAuthenticated, showCreatePost);

// Crear publicación
router.post("/publicaciones", isAuthenticated, createPost);

export default router;