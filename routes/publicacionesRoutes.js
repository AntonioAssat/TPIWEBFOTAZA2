import express from "express";
import { 
    showCreatePost, 
    createPost,
    showPosts,
    showAddImage, 
    addImage
} from "../controllers/publicacionesController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/publicaciones", showPosts);
// Mostrar formulario
router.get("/publicaciones/nueva", isAuthenticated, showCreatePost);

// Crear publicación
router.post("/publicaciones", isAuthenticated, createPost);

router.get("/publicaciones/:id/imagen", isAuthenticated, showAddImage);
router.post("/publicaciones/:id/imagen", isAuthenticated, addImage);


export default router;