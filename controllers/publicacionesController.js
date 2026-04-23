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