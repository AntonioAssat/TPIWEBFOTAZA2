//parte de base de datos
import fs from "fs/promises";
//import contraseña segura
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Follow from "../models/Follow.js";

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
        // Buscar usuario
        const usuario = await User.findOne({
            where: { email }
        });
        //vverificar si existe el usario
        if (!usuario) {
            return res.send("Usuario no encontrado");
        }

        // Comparar la contraseña
        const coincide = await bcrypt.compare(password, usuario.password);
        //si no coincide contraseña
        if (!coincide) {
            return res.send("Contraseña incorrecta");
        }

        // Guardar sesión 
        req.session.usuario = {
            id: usuario.id,
            username: usuario.username
        };

        // Redirige al feed
        res.redirect("/publicaciones");

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

//perfil
export const showPerfil = async (req, res) => {
    const userId = req.params.id;

    try {
        const usuario = await User.findByPk(userId);
        const seguidores = await Follow.count({
            where: { seguido_id: userId }
        });

        const siguiendo = await Follow.count({
            where: { seguidor_id: userId }
        });

        const yaSigue = await Follow.findOne({
            where: {
            seguido_id: userId,
            seguidor_id: req.session.usuario.id
    }
});
        res.render("pages/perfil", { usuario, usuarioLogueado: req.session.usuario, seguidores, siguiendo, yaSigue });
       

    } catch (error) {
        console.error(error);
        res.send("Error al cargar perfil");
    }
};

//mostrar formulario editar perfil
export const editPerfilForm = async (req, res) => {
    const userId = req.params.id;

    try {
        // 🔒 Solo puede editar su propio perfil
        if (req.session.usuario.id != userId) {
            return res.send("No autorizado");
        }

        const usuario = await User.findByPk(userId);

        res.render("pages/editarPerfil", { usuario });

    } catch (error) {
        console.error(error);
        res.send("Error al cargar edición");
    }
};
//guardar cambios de perfil
export const updatePerfil = async (req, res) => {
    const userId = req.params.id;
    const { bio } = req.body;

    try {
        if (req.session.usuario.id != userId) {
            return res.send("No autorizado");
        }

        const usuario = await User.findByPk(userId);

        if (!usuario) {
            return res.send("Usuario no encontrado");
        }

        usuario.bio = bio || usuario.bio;

        // 🔥 SI SUBE IMAGEN
        if (req.file) {
            usuario.avatar = "/uploads/" + req.file.filename;
        }

        await usuario.save();

        res.redirect(`/perfil/${userId}`);

    } catch (error) {
        console.error(error);
        res.send("Error al actualizar perfil");
    }
};
//seguidores
export const followUser = async (req, res) => {
    const seguidoId = req.params.id;
    const seguidorId = req.session.usuario.id;

    if (seguidoId == seguidorId) {
        return res.send("No podés seguirte a vos mismo");
    }

    try {
        const existente = await Follow.findOne({
            where: {
                seguido_id: seguidoId,
                seguidor_id: seguidorId
            }
        });

        if (existente) {
            await existente.destroy(); // unfollow
        } else {
            await Follow.create({
                seguido_id: seguidoId,
                seguidor_id: seguidorId
            });
        }

        res.redirect(`/perfil/${seguidoId}`);

    } catch (error) {
        console.error(error);
        res.send("Error en follow");
    }
};