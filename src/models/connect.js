import { Sequelize } from "sequelize";
//tao obj sequelize để connect tới db
const sequelize = new Sequelize(
  "node47_youtube", // tên db
  "root", // tên user
  "1234", //password
  {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
  }
);
export default sequelize;
