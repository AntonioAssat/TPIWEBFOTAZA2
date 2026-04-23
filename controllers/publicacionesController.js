import fs from "fs/promises";

const path = "./data/publicaciones.json";

// Mostrar formulario
export const showCreatePost = (req, res) => {
    res.render("pages/createPost");
};

// Crear publicación
export const createPost = async (req, res) => {
    const { titulo, descripcion } = req.body;

    try {
        const data = await fs.readFile(path, "utf-8");
        const publicaciones = JSON.parse(data);

        const nuevaPublicacion = {
            id: publicaciones.length + 1,
            titulo,
            descripcion,
            usuario_id: req.session.usuario.id,
            fecha: new Date()
        };

        publicaciones.push(nuevaPublicacion);

        await fs.writeFile(path, JSON.stringify(publicaciones, null, 2));

        res.send("Publicación creada");

    } catch (error) {
        console.error(error);
        res.send("Error al crear publicación");
    }
};

export const showPosts = async (req, res) => {
    try {
        const data = await fs.readFile(path, "utf-8");
        const publicaciones = JSON.parse(data);

        res.render("pages/posts", { publicaciones });

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
        const data = await fs.readFile(pathImagenes, "utf-8");
        const imagenes = JSON.parse(data);

        const nuevaImagen = {
            id: imagenes.length + 1,
            url,
            licencia,
            watermark: watermark || null,
            publicacion_id: parseInt(publicacionId)
        };

        imagenes.push(nuevaImagen);

        await fs.writeFile(pathImagenes, JSON.stringify(imagenes, null, 2));

        res.send("Imagen agregada");

    } catch (error) {
        console.error(error);
        res.send("Error al agregar imagen");
    }
};