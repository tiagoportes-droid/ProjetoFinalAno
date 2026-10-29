import cors from "cors";
import express from "express";
import "dotenv/config";
import abrirConexao from "./db.js";

function formatarDataParaBD(dataStr) {
  if (!dataStr || dataStr.trim() === "") return null;
  if (dataStr.includes("-")) return dataStr;
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
      return res.status(404).json({ msg: "Nenhum Cliente cadastrado" });
    }
    return res.json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro ao Buscar Clientes" });
  }
});

// GET - Lista o cliente pelo id
app.get("/cliente/:id", async (req, res) => {
  const id = Number(req.params.id);
  const sql = "SELECT * FROM cliente WHERE id_cliente = ?";

  try {
    const resp = await abrirConexao.query(sql, [id]);

    if (resp.length === 0) {
      return res.status(404).json({ msg: "Id inserido não existe" });
    }

    return res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
});

// POST - Adiciona um cliente
app.post("/cliente", async (req, res) => {
  const { nome, cpf_cnpj, telefone, data_nascimento } = req.body;
  const data_nascimento_formatada = formatarDataParaBD(data_nascimento);

  if (!nome || !cpf_cnpj || !telefone) {
    return res
      .status(400)
      .json({ msg: "Envie todas as informações corretamente" });
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

    return res.status(201).json({
      msg: "Cliente adicionado com sucesso",
      Id_criado: Number(resp.insertId),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro no Servidor" });
  }
});

// PUT - Atualiza o cliente
app.put("/cliente/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, cpf_cnpj, telefone, data_nascimento } = req.body;
  const data_nascimento_formatada = formatarDataParaBD(data_nascimento);
  const sql =
    "UPDATE cliente SET nome = ?, cpf_cnpj = ?, telefone = ?, data_nascimento_fundacao = ? WHERE id_cliente = ?";

  if (!nome || !cpf_cnpj || !telefone) {
    return res
      .status(400)
      .json({ msg: "Envie todas as informações corretamente" });
  }

  try {
    const resp = await abrirConexao.query(sql, [
      nome,
      cpf_cnpj,
      telefone,
      data_nascimento_formatada,
      id,
    ]);

    if (resp.affectedRows > 0) {
      return res.status(200).json({ msg: "Cliente atualizado com sucesso." });
    } else {
      return res.status(404).json({ msg: "Cliente não encontrado." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
});

// DELETE - Deleta o cliente
app.delete("/cliente/:id", async (req, res) => {
  const id = Number(req.params.id);
  const sql = "DELETE FROM cliente WHERE id_cliente = ?";

  try {
    const resp = await abrirConexao.query(sql, [id]);

    if (resp.affectedRows === 0) {
      return res.status(404).json({ msg: "Cliente não encontrado" });
    }

    return res.status(200).json({ msg: "Cliente deletado com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro no servidor" });
  }
});
//#endregion

//#region Cadastro Cliente (Endereço)

// POST - Vincula o cliente a um endereço
app.post("/cadastro", async (req, res) => {
  const { id_cliente, cep, logradouro, numero, bairro, cidade, estado } =
    req.body;
  const sql =
    "INSERT INTO cadastro (id_cliente, cep, logradouro, numero, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?)";

  if (
    !id_cliente ||
    !cep ||
    !logradouro ||
    !numero ||
    !bairro ||
    !cidade ||
    !estado
  ) {
    return res.status(400).json({ msg: "Insira os valores corretamente" });
  }

  try {
    const resp = await abrirConexao.query(sql, [
      id_cliente,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
    ]);
    return res.status(200).json({
      msg: "Endereço vinculado e cadastrado com sucesso!",
      Id_criado: Number(resp.insertId),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro no servidor." });
  }
});

// GET - Mostra todos os endereços cadastrados
app.get("/cadastro", async (req, res) => {
  const sql = "SELECT * FROM cadastro";
  try {
    const resp = await abrirConexao.query(sql);
    if (resp.length === 0) {
      return res.status(404).json({ msg: "Nenhum endereço cadastrado" });
    }
    return res.json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro no servidor." });
  }
});

// GET - Mostra um endereço cadastrado por id
app.get("/cadastro/:id", async (req, res) => {
  const id = Number(req.params.id);
  const sql = "SELECT * FROM cadastro WHERE id_cadastro = ?";

  try {
    const resp = await abrirConexao.query(sql, [id]);
    if (resp.length === 0) {
      return res
        .status(404)
        .json({ msg: "Endereço não encontrado para o ID inserido" });
    }

    return res.json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro no servidor." });
  }
});
//#endregion

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
