import fs from "fs/promises";
import db from "../config/db.js";

const path = "./data/publicaciones.json";

// Mostrar formulario
export const showCreatePost = (req, res) => {
    res.render("pages/createPost");
};

// Crear publicación
export const createPost = async (req, res) => {
    const { titulo, descripcion } = req.body;
    const usuarioId = req.session.usuario.id;

    try {
        await db.query(
            "INSERT INTO publicaciones (titulo, descripcion, usuario_id, fecha) VALUES (?, ?, ?, NOW())",
            [titulo, descripcion, usuarioId]
        );

        res.send("Publicación guardada en MySQL");

    } catch (error) {
        console.error(error);
        res.send("Error al crear publicación");
    }
};

export const showPosts = async (req, res) => {
    try {
        const { search } = req.query;

        let query = "SELECT * FROM publicaciones";
        let params = [];

        if (search) {
            query += " WHERE titulo LIKE ?";
            params.push(`%${search}%`);
        }

        const [publicaciones] = await db.query(query, params);

        const [imagenes] = await db.query("SELECT * FROM imagenes");

        const publicacionesConImagenes = publicaciones.map(pub => {
            const imgs = imagenes.filter(img => img.publicacion_id === pub.id);

            return {
                ...pub,
                imagenes: imgs
            };
        });

        res.render("pages/posts", { publicaciones: publicacionesConImagenes });

    } catch (error) {
        console.error(error);
        res.send("Error al cargar publicaciones");
    }
};
//para las imagenes de las publicaciones
const pathImagenes = "./data/imagenes.json";

// Mostrar formulario
export const showAddImage = (req, res) => {
    const publicacionId = req.params.id;
    res.render("pages/addImage", { publicacionId });
};

// Agregar imagen
export const addImage = async (req, res) => {
    const { url, licencia, watermark } = req.body;
    const publicacionId = req.params.id;

    try {
        await db.query(
            "INSERT INTO imagenes (url, licencia, watermark, publicacion_id) VALUES (?, ?, ?, ?)",
            [url, licencia, watermark || null, publicacionId]
        );

        res.send("Imagen guardada en MySQL");

    } catch (error) {
        console.error(error);
        res.send("Error al guardar imagen");
    }
};
//comentarios
const pathComentarios = "./data/comentarios.json";

export const addComment = async (req, res) => {
    const { texto } = req.body;
    const imagenId = req.params.id;

    try {
        const data = await fs.readFile(pathComentarios, "utf-8");
        const comentarios = JSON.parse(data);

        const nuevoComentario = {
            id: comentarios.length + 1,
            texto,
            usuario_id: req.session.usuario.id,
            imagen_id: parseInt(imagenId),
            fecha: new Date()
        };

        comentarios.push(nuevoComentario);

        await fs.writeFile(pathComentarios, JSON.stringify(comentarios, null, 2));

        res.redirect("/publicaciones");

    } catch (error) {
        console.error(error);
        res.send("Error al agregar comentario");
    }
};

//valoraciones
const pathValoraciones = "./data/valoraciones.json";

export const addRating = async (req, res) => {
    const { valor } = req.body;
    const imagenId = req.params.id;
    const usuarioId = req.session.usuario.id;

    try {
        const data = await fs.readFile(pathValoraciones, "utf-8");
        const valoraciones = JSON.parse(data);

        // 🔒 evitar duplicados
        const yaValoro = valoraciones.find(v => 
            v.usuario_id === usuarioId && v.imagen_id === parseInt(imagenId)
        );

        if (yaValoro) {
            return res.send("Ya valoraste esta imagen");
        }

        const nuevaValoracion = {
            id: valoraciones.length + 1,
            valor: parseInt(valor),
            usuario_id: usuarioId,
            imagen_id: parseInt(imagenId)
        };

        valoraciones.push(nuevaValoracion);

        await fs.writeFile(pathValoraciones, JSON.stringify(valoraciones, null, 2));

        res.redirect("/publicaciones");

    } catch (error) {
        console.error(error);
        res.send("Error al valorar");
    }
};