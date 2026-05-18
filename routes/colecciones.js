import express from "express";

import {
    showColecciones,
    crearColeccion,
    guardarPublicacion,
    showColeccion
}
from "../controllers/coleccionesController.js";

import {
    isAuthenticated
}
from "../middlewares/auth.js";

const router = express.Router();

// ver colecciones
router.get(
    "/colecciones",
    isAuthenticated,
    showColecciones,
    guardarPublicacion
);

router.get(
    "/colecciones/:id",
    isAuthenticated,
    showColeccion
);

// crear colección
router.post(
    "/colecciones",
    isAuthenticated,
    crearColeccion
);

router.post(
    "/publicaciones/:id/guardar",
    isAuthenticated,
    guardarPublicacion
);

export default router;