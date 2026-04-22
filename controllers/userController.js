let usuarios = []; // almacenamiento temporal

export const showRegister = (req, res) => {
    res.render("pages/register");
};

export const registerUser = (req, res) => {
    const { username, email, password } = req.body;

    const nuevoUsuario = {
        id: usuarios.length + 1,
        username,
        email,
        password
    };

    usuarios.push(nuevoUsuario);

    console.log(usuarios);

    res.send("Usuario registrado correctamente");
};