//parte de base de datos
import fs from "fs/promises";
//import contraseña segura
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Notificacion from "../models/Notificacion.js";
import Publicacion from "../models/Publicacion.js";
import Imagen from "../models/Imagen.js";
import Tag from "../models/Tag.js";

const path = "./data/usuarios.json";

// Mostrar formulario
export const showRegister = (req, res) => {
    res.render("pages/register");
};
export const showLogin = (req, res) => {
    res.render("pages/login", {
    registro: req.query.registro
});
};
// Registrar usuario
export const registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        //Encriptar contraseña
        if (password !== confirmPassword) {
       return res.send("Las contraseñas no coinciden");
       }
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

        res.redirect("/login?registro=ok");

    } catch (error) {
        console.error(error);
        res.send("Error al registrar usuario");
    }
};
//procesar login
export const loginUser = async (
    req,
    res
) => {

    const {
        email,
        password
    } = req.body;

    try {

        // ======================
        // BUSCAR USUARIO
        // ======================
        const usuario =
            await User.findOne({

                where: { email }
            });

        // ======================
        // NO EXISTE
        // ======================
        if (!usuario) {

            req.session.mensaje =
                "Usuario no encontrado";

            return res.redirect("/login");
        }

        // ======================
        // CUENTA INACTIVA
        // ======================
        if (
            usuario.estadoCuenta ===
            "inactiva"
        ) {

            req.session.mensaje =
                "Tu cuenta fue desactivada por múltiples publicaciones eliminadas";

            return res.redirect("/login");
        }

        // ======================
        // PASSWORD
        // ======================
        const coincide =
            await bcrypt.compare(

                password,

                usuario.password
            );

        // ======================
        // PASSWORD INCORRECTA
        // ======================
        if (!coincide) {

            req.session.mensaje =
                "Contraseña incorrecta";

            return res.redirect("/login");
        }

        // ======================
        // SESIÓN
        // ======================
        req.session.usuario = {

            id:
                usuario.id,

            username:
                usuario.username,

            rol:
                usuario.rol,

            avatar:
                usuario.avatar
        };

        // ======================
        // REDIRECT
        // ======================
        res.redirect(
            "/publicaciones"
        );

    } catch (error) {

        console.error(error);

        res.send(
            "Error en login"
        );
    }
};
//cerrar sesion
export const logout = (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            console.log(error);
            return res.send("Error al cerrar sesión");
        }

        res.redirect("/");

    });
};
//perfil
export const showPerfil = async (req, res) => {
    const userId = req.params.id;

    try {
        const usuario = await User.findByPk(req.params.id, {

            include: [
                {
                    model: Publicacion,

                    include: [
                        {
                            model: Imagen
                        },
                        {
                            model: Tag
                        }
                    ]
                }
            ]
});
        usuario.fechaFormateada = new Date(usuario.fechaRegistro)
            .toLocaleString("es-AR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
    });
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
        //  Solo puede editar su propio perfil
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

    const {
        username,
        bio,
        fechaNacimiento,
        password,
        confirmPassword,
        avatarBase64
    } = req.body;

    try {

        // ======================
        // SEGURIDAD
        // ======================
        if (req.session.usuario.id != userId) {

            return res.send("No autorizado");
        }

        // ======================
        // BUSCAR USUARIO
        // ======================
        const usuario = await User.findByPk(userId);

        if (!usuario) {

            return res.send("Usuario no encontrado");
        }

        // ======================
        // VALIDAR USERNAME
        // ======================
        if (username && username !== usuario.username) {

            const existe = await User.findOne({
                where: {
                    username
                }
            });

            if (existe) {

                return res.send(
                    "Ese nombre de usuario ya existe"
                );
            }

            usuario.username = username;
        }

        // ======================
        // BIO
        // ======================
        usuario.bio = bio || usuario.bio;

        // ======================
        // FECHA NACIMIENTO
        // ======================
        usuario.fechaNacimiento =
            fechaNacimiento || usuario.fechaNacimiento;

        // ======================
        // CAMBIAR PASSWORD
        // ======================
        if (password && password.trim() !== "") {

            if (password !== confirmPassword) {

                return res.send(
                    "Las contraseñas no coinciden"
                );
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            usuario.password = hashedPassword;
        }

        // ======================
        // AVATAR BASE64
        // ======================
        if (avatarBase64) {

            usuario.avatar = avatarBase64;
        }

        // ======================
        // GUARDAR
        // ======================
        await usuario.save();

        // ======================
        // ACTUALIZAR SESIÓN
        // ======================
        req.session.usuario = {

            id: usuario.id,

            username: usuario.username,

            rol: usuario.rol,

            avatar: usuario.avatar
        };

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
        await Notificacion.create({
            tipo: "follow",
            mensaje: "comenzó a seguirte",
            usuario_id: seguidoId,
            usuario_accion_id: seguidorId
        });

        res.redirect(`/perfil/${seguidoId}`);

    } catch (error) {
        console.error(error);
        res.send("Error en follow");
    }
};

//mostrar notificaciones
export const showNotifications = async (req, res) => {

    const usuarioId = req.session.usuario.id;

    try {

        const notificaciones = await Notificacion.findAll({

            where: {
                usuario_id: usuarioId
            },

            include: [
                {
                    model: User,
                    as: "UsuarioAccion",
                    attributes: ["id", "username"]
                }
            ],

            order: [["createdAt", "DESC"]]
        });
        // FORMATEAR FECHAS
        
        notificaciones.forEach(n => {

            n.fechaFormateada = new Date(n.createdAt)
                .toLocaleString("es-AR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                });

        });

        res.render("pages/notificaciones", {
            notificaciones
        });

    } catch (error) {
        console.error(error);
        res.send("Error al cargar notificaciones");
    }
};
