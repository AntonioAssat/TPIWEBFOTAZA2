//parte de base de datos
import fs from "fs/promises";
//import contraseña segura
import bcrypt from "bcrypt";
import User from "../models/User.js";

const path = "./data/usuarios.json";

// Mostrar formulario
export const showRegister = (req, res) => {
    res.render("pages/register");
};
export const showLogin = (req, res) => {
    res.render("pages/login");
};
// Registrar usuario
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        //Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        //Verificar si existe usuario
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.send("El usuario ya existe");
        }

        //Crear usuario
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.send("Usuario registrado con Sequelize");

    } catch (error) {
        console.error(error);
        res.send("Error al registrar usuario");
    }
};
//procesar login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        //Buscar usuario
        const usuario = await User.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.send("Usuario no encontrado");
        }

        //Comparar contraseña
        const coincide = await bcrypt.compare(password, usuario.password);

        if (!coincide) {
            return res.send("Contraseña incorrecta");
        }

        // Guardar sesión
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