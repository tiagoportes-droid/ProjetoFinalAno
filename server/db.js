import mariadb from "mariadb";
import "dotenv/config"

const abrirConexao = () => {
  return mariadb.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};


export default abrirConexao;
