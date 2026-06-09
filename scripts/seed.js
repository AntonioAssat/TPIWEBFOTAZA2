import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function ejecutarSeed() {

    console.log("Ejecutando seed...");

    // Admin

    const adminExiste = await User.findOne({
        where: {
            email: "ignacioOrellano@gmail.com"
        }
    });

    if (!adminExiste) {

        const passwordAdmin =
            await bcrypt.hash(
                "12345678",
                10
            );

        await User.create({
            username: "IgnacioOrellano",
            email: "ignacioOrellano@gmail.com",
            password: passwordAdmin,
            rol: "admin"
        });

        console.log("Admin creado");
    }

    // USUARIO 1

    const usuario1Existe = await User.findOne({
        where: {
            email: "mariano@gmail.com"
        }
    });

    if (!usuario1Existe) {

        const passwordUsuario =
            await bcrypt.hash(
                "12345678",
                10
            );

        await User.create({
            username: "Mariano",
            email: "mariano@gmail.com",
            password: passwordUsuario
        });

        console.log("Usuario1 creado");
    }

    // USUARIO 2

    /*const usuario2Existe = await User.findOne({
        where: {
            email: "usuario2@fotaza.com"
        }
    });

    if (!usuario2Existe) {

        const passwordUsuario =
            await bcrypt.hash(
                "usuario123",
                10
            );

        await User.create({
            username: "Usuario2",
            email: "usuario2@fotaza.com",
            password: passwordUsuario
        });

        console.log("Usuario2 creado");
    }*/

    console.log("Seed completado");
}