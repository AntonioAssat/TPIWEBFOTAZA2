import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Para usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "secreto123",
    resave: false,
    saveUninitialized: false
}));

// Ruta de prueba
import indexRoutes from "./routes/index.js";
app.use("/", indexRoutes);

import userRoutes from "./routes/userRoutes.js";
app.use("/", userRoutes);

import publicacionesRoutes from "./routes/publicacionesRoutes.js";
app.use("/", publicacionesRoutes);

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});