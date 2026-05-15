import express from "express";
import upload from "../middlewares/upload.js";
import { 
    showCreatePost, 
    createPost,
    showPosts,
    showAddImage, 
    addImage,
    addComment,
    addRating,
    addDenuncia,
    showFeedSeguidos,
    marcarInteres
} from "../controllers/publicacionesController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/publicaciones", showPosts);
// Mostrar formulario
router.get("/publicaciones/nueva", isAuthenticated, showCreatePost);

// Crear publicación
router.post(
    "/publicaciones",
    isAuthenticated,
    upload.array("imagenes", 10),
    createPost
);

router.get("/publicaciones/:id/imagen", isAuthenticated, showAddImage);
router.post("/publicaciones/:id/imagen", isAuthenticated, addImage);

//comentarios
router.post("/imagenes/:id/comentario", isAuthenticated, addComment);

//valoaciones
router.post("/imagenes/:id/valorar", isAuthenticated, addRating);

//denuncias
router.post("/imagenes/:id/denunciar", isAuthenticated, addDenuncia);

router.post(
    "/imagenes/:id/interes",
    isAuthenticated,
    marcarInteres
);
router.get("/feed", isAuthenticated, showFeedSeguidos);

export default router;
