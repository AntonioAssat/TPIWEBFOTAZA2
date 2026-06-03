import express from "express";
import {
    showDenuncias,
    showHistorial,
    aprobarImagen,
    eliminarImagen
}
from "../controllers/adminController.js";

import {
    isAuthenticated
}
from "../middlewares/auth.js";

import {
    isAdmin
}
from "../middlewares/admin.js";

const router = express.Router();

router.get(
    "/admin/denuncias",
    isAuthenticated,
    isAdmin,
    showDenuncias
);

router.get(
    "/admin/historial",
    isAuthenticated,
    isAdmin,
    showHistorial
);

router.post(
    "/admin/imagenes/:id/aprobar",
    isAuthenticated,
    isAdmin,
    aprobarImagen
);

router.post(
    "/admin/imagenes/:id/eliminar",
    isAuthenticated,
    isAdmin,
    eliminarImagen
);

export default router;