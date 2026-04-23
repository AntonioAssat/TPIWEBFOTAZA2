import fs from "fs/promises";

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
        // Leer archivo
        const data = await fs.readFile(path, "utf-8");
        const usuarios = JSON.parse(data);

        // 🔒 Validar si ya existe el email
        const existe = usuarios.find(u => u.email === email);
        if (existe) {
            return res.send("El usuario ya existe");
        }

        // Crear usuario nuevo
        const nuevoUsuario = {
            id: usuarios.length + 1,
            username,
            email,
            password
        };

        // Agregar al array
        usuarios.push(nuevoUsuario);

        // Guardar archivo
        await fs.writeFile(path, JSON.stringify(usuarios, null, 2));

        console.log("Usuarios guardados:", usuarios);

        res.send("Usuario registrado correctamente");

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

        if (usuario.password !== password) {
            return res.send("Contraseña incorrecta");
        }

        res.send(`Bienvenido ${usuario.username}`);

    } catch (error) {
        console.error(error);
        res.send("Error en login");
    }
};