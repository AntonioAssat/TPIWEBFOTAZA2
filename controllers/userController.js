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
import { Op } from "sequelize";
import Comentario from "../models/Comentario.js";
import Valoracion from "../models/Valoracion.js";
import {
    isEmail,
    isRequired,
    isPasswordValid,
    passwordsMatch
}
from "../helpers/validations.js";

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
                if (
            !isRequired(username) ||
            !isRequired(email) ||
            !isRequired(password) ||
            !isRequired(confirmPassword)
        ) {

            return res.render("pages/register",{
                    error:"Completá todos los campos"
                }
            );
        }

        if (!isEmail(email)) {
            return res.render("pages/register",{
                    error:"Ingresá un email válido"
                }
            );
        }

        if (!isPasswordValid(password)) {

            return res.render("pages/register",{
                    error:"La contraseña debe tener al menos 6 caracteres"
                }
            );
        }

        if (!passwordsMatch(
                password,
                confirmPassword
            )
        ) {

            return res.render("pages/register",{
                    error:"Las contraseñas no coinciden"
                }
            );
        }
        //Encriptar contraseña
        
        const hashedPassword = await bcrypt.hash(password, 10);

        //Verificar si existe usuario
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.render("pages/register",{
                error:"El usuario ya existe"
        });
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
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al registar usuario",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};
//procesar login
export const loginUser = async (req, res) => {

    const {email, password} = req.body;

    try {
        if (
            !isRequired(email) ||
            !isRequired(password)
        ) {

            return res.render("pages/login",{
                    error:"Completá todos los campos"
                }
            );
        }

        if (!isEmail(email)) {

            return res.render("pages/login",{
                    error:"Ingresá un email válido"
                }
            );
        }
        // Buscar usuario por email
    
        const usuario = await User.findOne({
            where: { email }
            });

        // No existe usuario

        if (!usuario) {
            return res.render("pages/login",{
                error:"Usuario no encontrado"
            }
        );
        }

        // Cuenta inactiva
       
        if (usuario.estadoCuenta ==="inactiva") {
            return res.render("pages/login",{
                    error:"Tu cuenta fue desactivada"
                }
            );
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
            return res.render("pages/login", {
            error:"Contraseña incorrecta"
        }
);
        }

        // ======================
        // SESIÓN
        // ======================
        req.session.usuario = {
            id: usuario.id,
            username: usuario.username,
            rol: usuario.rol,
            avatar: usuario.avatar
        };

        req.session.save((err) => {

            if (err) {
                console.error(err);

                return res.status(500).render("pages/error", {
                    codigo: "500",
                    mensaje: "Error al iniciar sesión",
                    descripcion: "Intentá nuevamente más tarde."
                });
            }

    res.redirect("/publicaciones");
});
        
    } catch (error) {

        console.error(error);
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error en login",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};
//cerrar sesion
export const logout = (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            console.log(error);
            res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al cerrara sesion",
            descripcion:"Intentá nuevamente más tarde."
        });
        }

        res.redirect("/");

    });
};
//perfil
export const showPerfil = async (req, res) => {

    const userId = req.params.id;
    const mensaje = req.query.mensaje || null;

    const error = req.query.error || null;
    try {

        // ======================
        // USUARIO
        // ======================
        const usuario =
            await User.findByPk(

                userId,

                {

                    include: [

                        {
                            model: Publicacion,

                            include: [

                                // ======================
                                // IMÁGENES
                                // ======================
                                {
                                    model: Imagen,

                                    where: {

                                        estado: {

                                            [Op.ne]:
                                                "eliminada"
                                        }
                                    },

                                    required: false,

                                    include: [

                                        // ======================
                                        // COMENTARIOS
                                        // ======================
                                        {
                                            model:
                                                Comentario,

                                            include: [
                                                {
                                                    model:
                                                        User
                                                }
                                            ]
                                        },

                                        // ======================
                                        // VALORACIONES
                                        // ======================
                                        {
                                            model:
                                                Valoracion
                                        }
                                    ]
                                },

                                // ======================
                                // TAGS
                                // ======================
                                {
                                    model:
                                        Tag
                                }
                            ],

                            order: [
                                ["createdAt", "DESC"]
                            ]
                        }
                    ]
                }
            );

        // ======================
        // FECHA
        // ======================
        usuario.fechaFormateada =
            new Date(

                usuario.fechaRegistro

            ).toLocaleString(

                "es-AR",

                {

                    year:
                        "numeric",

                    month:
                        "2-digit",

                    day:
                        "2-digit"
                }
            );

        // ======================
        // SEGUIDORES
        // ======================
        const seguidores =
            await Follow.count({

                where: {

                    seguido_id:
                        userId
                }
            });

        // ======================
        // SIGUIENDO
        // ======================
        const siguiendo =
            await Follow.count({

                where: {

                    seguidor_id:
                        userId
                }
            });

        // ======================
        // YA SIGUE
        // ======================
        let yaSigue = false;

        if (req.session.usuario) {

            yaSigue =
                await Follow.findOne({

                    where: {

                        seguido_id:
                            userId,

                        seguidor_id:
                            req.session.usuario.id
                    }
                });
        }
        usuario.Publicacions =
            usuario.Publicacions.filter(

                pub =>

                    pub.Imagens &&
                    pub.Imagens.length > 0
            );
        // ======================
        // RENDER
        // ======================
        res.render("pages/perfil",{
            usuario,
            usuarioLogueado: req.session.usuario,
            seguidores,
            siguiendo,
            yaSigue,
            mensaje,
            error
        });

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error alcargar perfil",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

//mostrar formulario editar perfil
export const editPerfilForm = async (req, res) => {
    const userId = req.params.id;

    try {
        //  Solo puede editar su propio perfil

        const usuario = await User.findByPk(userId);

        res.render("pages/editarPerfil", { usuario });

    } catch (error) {
        console.error(error);
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al cargar edicion",
            descripcion:"Intentá nuevamente más tarde."
        });
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
        // SEGURIDAD


        // ======================
        // BUSCAR USUARIO
        // ======================
        const usuario = await User.findByPk(userId);

        if (!usuario) {

            return res.status(404).render("pages/error",{
                codigo: "404",
                mensaje:"Usuario no encontrado",
                descripcion:"El perfil no existe."
            });
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

                return res.status(400).render("pages/error",{
                    codigo: "400",
                    mensaje:"Nombre de usuario en uso",
                    descripcion:"Elegí otro nombre."
    }
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

                return res.status(400).render("pages/error",{
                    codigo: "400",
                    mensaje:"Las contraseñas no coinciden",
                    descripcion:"Verificá los datos ingresados."
                }
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
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al actualizar perfil",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};
//seguidores
export const followUser = async (req, res) => {
    const seguidoId = req.params.id;
    const seguidorId = req.session.usuario.id;

    if (seguidoId == seguidorId) {
        return res.redirect(`/perfil/${seguidoId}?error=No podés seguirte a vos mismo`);   
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
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error en follow",
            descripcion:"Intentá nuevamente más tarde."
        });
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

            order: [["fecha", "DESC NULLS LAST"]]
        });
        // FORMATEAR FECHAS
        
        notificaciones.forEach(n => {

            n.fechaFormateada = new Date(n.fecha)
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
        res.status(500).render("pages/error",{
            codigo: "500",
            mensaje:"Error al cargar notificaciones",
            descripcion:"Intentá nuevamente más tarde."
        });
    }
};

export const markNotificationRead = async (req, res) => {

    const notificationId =req.params.id;
    const usuarioId =req.session.usuario.id;

    try {

        const notificacion =await Notificacion.findByPk(notificationId);

        if (!notificacion) {
            return res.redirect("/notificaciones");
        }

        // seguridad
        if (notificacion.usuario_id != usuarioId) {
            return res.redirect("/notificaciones");
        }

        notificacion.leida = true;

        await notificacion.save();

        res.redirect("/notificaciones");

    } catch (error) {

        console.error(error);

        res.status(500).render("pages/error",{
                codigo: "500",
                mensaje:"Error al actualizar notificación",
                descripcion:"Intentá nuevamente más tarde."
            }
        );
    }
};