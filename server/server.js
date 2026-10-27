import cors from "cors";
import express from "express";
import "dotenv/config";
import abrirConexao from "./db.js";

const app = express();
const conexao = abrirConexao();

app.use(express.json());
app.use(cors());

app.get("/clientes", async (req, res) => {
  try {
    const sql = "SELECT * FROM cliente";
    const resp = await conexao.query(sql);

    if (resp.length === 0) {
      res.status(404).json({ msg: "Nenhum Cliente cadastrado" });
    }
    res.json(resp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Erro ao Buscar Clientes" });
  }
});

const PORT = process.env.DB_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
