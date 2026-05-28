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
    showNotifications,
    markNotificationRead
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {isOwner} from "../middlewares/owner.js";
const router = express.Router();

// Registro
router.get("/registro", showRegister);
router.post("/registro", registerUser);

// Login
router.get("/login", showLogin);
router.post("/login", loginUser);
//cerrar sesion
router.get("/logout", logout);
//perfil
router.get("/perfil/:id", isAuthenticated, showPerfil);
//editar perfil
router.get("/perfil/:id/editar", isAuthenticated, isOwner, editPerfilForm);
router.post(
  "/perfil/:id/editar",
  isOwner,
  isAuthenticated,
  updatePerfil
);

//seguidores
router.post("/perfil/:id/follow", isAuthenticated, followUser);
//notificaciones
router.get("/notificaciones", isAuthenticated, showNotifications);

//leido
router.post("/notificaciones/:id/leida", isAuthenticated, markNotificationRead);

export default router;