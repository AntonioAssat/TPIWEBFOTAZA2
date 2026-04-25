//parte de base de datos
import db from "../config/db.js";
import fs from "fs/promises";
//import contraseña segura
import bcrypt from "bcrypt";

const path = "./data/usuarios.json";

// Mostrar formulario
export const showRegister = async (req, res) => {
    const [rows] = await db.query("SELECT 1");
    console.log("CONEXION OK:", rows);

    res.render("pages/register");
};
export const showLogin = (req, res) => {
    res.render("pages/login");
};
// Registrar usuario
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Verificar si ya existe
        const [existing] = await db.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.send("El usuario ya existe");
        }

        // Insertar usuario
        await db.query(
            "INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        res.send("Usuario registrado en MySQL");

    } catch (error) {
        console.error(error);
        res.send("Error al registrar usuario");
    }
};
//procesar login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const data = await fs.readFile(path, "utf-8");
        const usuarios = JSON.parse(data);

        const usuario = usuarios.find(u => u.email === email);

        if (!usuario) {
            return res.send("Usuario no encontrado");
        }

        const coincide = await bcrypt.compare(password, usuario.password);

        if (!coincide) {
            return res.send("Contraseña incorrecta");
        }

        req.session.usuario = usuario;

        res.send(`Bienvenido ${usuario.username}`);

    } catch (error) {
        console.error(error);
        res.send("Error en login");
    }
};

export const logout = (req, res) => {
    req.session.destroy(() => {
        res.send("Sesión cerrada");
    });
};