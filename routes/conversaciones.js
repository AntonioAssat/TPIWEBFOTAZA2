import express from "express";

import {
    showConversaciones,
    showChat,
    enviarMensaje
}
from "../controllers/conversacionesController.js";

import {
    isAuthenticated
}
from "../middlewares/auth.js";

const router = express.Router();

// listar conversaciones
router.get(
    "/conversaciones",
    isAuthenticated,
    showConversaciones
);

// abrir chat
router.get(
    "/conversaciones/:id",
    isAuthenticated,
    showChat
);

// enviar mensaje
router.post(
    "/conversaciones/:id/mensaje",
    isAuthenticated,
    enviarMensaje
);

export default router;