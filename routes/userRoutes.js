import express from "express";
import { 
    showRegister, 
    registerUser, 
    showLogin, 
    loginUser,
    logout,
    showPerfil,
    editPerfilForm,
    updatePerfil,
    followUser,
    showNotifications
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
const router = express.Router();

// Registro
router.get("/registro", showRegister);
router.post("/registro", registerUser);

// Login
router.get("/login", showLogin);
router.post("/login", loginUser);
router.get("/logout", logout);
//perfil
router.get("/perfil/:id", isAuthenticated, showPerfil);
//editar perfil
router.get("/perfil/:id/editar", isAuthenticated, editPerfilForm);
router.post(
  "/perfil/:id/editar",
  isAuthenticated,
  upload.single("avatar"),
  updatePerfil
);
//seguidores
router.post("/perfil/:id/follow", isAuthenticated, followUser);
//notificaciones
router.get("/notificaciones", isAuthenticated, showNotifications);

export default router;