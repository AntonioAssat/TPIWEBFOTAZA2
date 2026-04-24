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
        const dataPub = await fs.readFile(path, "utf-8");
        const publicaciones = JSON.parse(dataPub);

        const dataImg = await fs.readFile(pathImagenes, "utf-8");
        const imagenes = JSON.parse(dataImg);

        const dataCom = await fs.readFile(pathComentarios, "utf-8");
        const comentarios = JSON.parse(dataCom);

        const dataVal = await fs.readFile(pathValoraciones, "utf-8");
        const valoraciones = JSON.parse(dataVal);

        // Unir imágenes con publicaciones
        const publicacionesConImagenes = publicaciones.map(pub => {
    const imgs = imagenes.filter(img => img.publicacion_id === pub.id);

    const imgsConComentarios = imgs.map(img => {
    const coms = comentarios.filter(c => c.imagen_id === img.id);

    const vals = valoraciones.filter(v => v.imagen_id === img.id);

    const promedio = vals.length > 0
        ? (vals.reduce((acc, v) => acc + v.valor, 0) / vals.length).toFixed(1)
        : 0;

    return {
        ...img,
        comentarios: coms,
        valoraciones: vals,
        promedio
    };
});

    return {
        ...pub,
        imagenes: imgsConComentarios
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