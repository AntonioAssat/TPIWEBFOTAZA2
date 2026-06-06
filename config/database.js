import pg from "pg";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {

    console.log("Usando Neon");

    sequelize = new Sequelize(
        process.env.DATABASE_URL,
        {
            dialect: "postgres",
            dialectModule: pg,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: false
        }
    );

} else {

    console.log("Usando PostgreSQL local");

    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: "postgres",
            logging: false
        }
    );
}

export default sequelize;