import { Sequelize } from "sequelize";

const sequelize = new Sequelize("fotaza2", "postgres", "280302", {
    host: "localhost",
    dialect: "postgres",
});

export default sequelize;