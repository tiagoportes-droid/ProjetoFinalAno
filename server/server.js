import cors from "cors";
import express from "express";
import "dotenv/config";
import abrirConexao from "./db.js";

function formatarDataParaBD(dataStr) {
  if (!dataStr || dataStr.trim() === "") return null;

  if (dataStr.includes("/")) {
    const [dia, mes, ano] = dataStr.split("/");
    return `${ano}-${mes}-${dia}`;
  }
}
const app = express();

app.use(express.json());
app.use(cors());

//#region Clientes
// GET - Lista todos os clientes
app.get("/cliente", async (req, res) => {
  try {
    const sql = "SELECT * FROM cliente";
    const resp = await abrirConexao.query(sql);

    if (resp.length === 0) {
      res.status(404).json({ msg: "Nenhum Cliente cadastrado" });
    }
    res.json(resp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Erro ao Buscar Clientes" });
  }
});

// GET - Lista o clinte pelo id
app.get("/cliente/:id", async (req, res) => {
  const id = Number(req.params.id);
  const sql = "SELECT * FROM cliente WHERE id_cliente = ?";

  const resp = await abrirConexao.query(sql, [id]);

  try {
    if (resp.length === 0) {
      return res.status(404).json({ msg: "Id inserido não existe" });
    }

    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// POST - Adiciona um cliente
app.post("/cliente", async (req, res) => {
  const { nome, cpf_cnpj, telefone, data_nascimento } = req.body;
  const data_nascimento_formatada = formatarDataParaBD(data_nascimento);

  if (!nome || !cpf_cnpj || !telefone || data_nascimento === undefined) {
    return res.status(400).json({ msg: "Envie todas as informações corretamente" });
  }

  try {
    const sql =
      "INSERT INTO cliente (nome, cpf_cnpj, telefone, data_nascimento_fundacao) VALUES (?, ?, ?, ?)";

    const resp = await abrirConexao.query(sql, [
      nome,
      cpf_cnpj,
      telefone,
      data_nascimento_formatada,
    ]);

    res.status(201).json({
      msg: "Cliente adicionado com sucesso",
      Id_criado: Number(resp.insertId),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Erro no Servidor" });
  }
});

// PUT - Atualiza o cliente
app.put("/cliente/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, cpf_cnpj, telefone, data_nascimento } = req.body;
  const data_nascimento_formatada = formatarDataParaBD(data_nascimento);
  const sql =
    "UPDATE cliente SET nome = ?, cpf_cnpj = ?, telefone = ?, data_nascimento_fundacao = ? WHERE id_cliente = ?";

  if (!nome || !cpf_cnpj || !telefone || data_nascimento === undefined) {
    res.status(400).json({ msg: "Envie todas as informações corretamente" });
  }

  try {
    const resp = await abrirConexao.query(sql, [
      nome,
      cpf_cnpj,
      telefone,
      data_nascimento_formatada,
      id
    ]);

    if (resp.affectedRows > 0) {
      res.status(200).json({ msg: "Cliente atualizado com sucesso." });
    } else {
      res.status(404).json({ msg: "Cliente não encontrado." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// DELETE - Deleta o cliente
app.delete("/cliente/:id", async (req, res) => {
  const id = Number(req.params.id);
  const sql = "DELETE FROM cliente WHERE id_cliente = ?";
  const resp = await abrirConexao.query(sql, [id]);

  try {
    if (resp.affectedRows === 0) {
      return res.status(404).json({ msg: "Cliente não encontardo" });
    }

    res.status(200).json({ msg: "Cliente deletado com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});
//#endregion

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
