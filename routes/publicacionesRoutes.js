import express from "express";
import { 
    showCreatePost, 
    createPost,
    showPosts
} from "../controllers/publicacionesController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/publicaciones", showPosts);
// Mostrar formulario
router.get("/publicaciones/nueva", isAuthenticated, showCreatePost);

// Crear publicación
router.post("/publicaciones", isAuthenticated, createPost);


export default router;