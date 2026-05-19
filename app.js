import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
//temporal 
import sequelize from "./config/database.js";
//USO DE MODELS
import User from "./models/User.js";
import "./models/Conversacion.js";
import "./models/Mensaje.js";
import "./models/Coleccion.js";
import coleccionesRoutes from "./routes/colecciones.js";
import adminRoutes from "./routes/admin.js";
import "./models/DenunciaComentario.js";
//reinicia servidor
//await sequelize.sync();
await sequelize.sync({ alter: true });
//
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
app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

app.use(express.json({
    limit: "50mb"
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "secreto123",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,   //importante en localhost
        httpOnly: true
    }
}));

// PASAR USUARIO A TODAS LAS VISTAS
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario;
    next();
});
//mostrar mensaje de denuncias
app.use((req, res, next) => {
    res.locals.mensaje = req.session.mensaje;
    delete req.session.mensaje;
    next();
});
//colecciones
app.use(coleccionesRoutes);

// Ruta de prueba
import indexRoutes from "./routes/index.js";
app.use("/", indexRoutes);

import userRoutes from "./routes/userRoutes.js";
app.use("/", userRoutes);

import publicacionesRoutes from "./routes/publicacionesRoutes.js";
app.use("/", publicacionesRoutes);
//conversaciones
import conversacionesRoutes
from "./routes/conversaciones.js";
app.use(conversacionesRoutes);

//admin
app.use(adminRoutes);
// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//temporal sequelize
sequelize.authenticate()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch(err => console.error("Error:", err));