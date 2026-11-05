import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import app from "./app.js";

let server;
let apiUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  apiUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("a API informa que está funcionando", async () => {
  const response = await fetch(`${apiUrl}/api/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("a página inicial é servida vazia", async () => {
  const response = await fetch(`${apiUrl}/`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("o login rejeita dados inválidos", async () => {
  const response = await fetch(`${apiUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
  assert.ok((await response.json()).erro);
});

test("uma consulta rejeita dados inválidos", async () => {
  const response = await fetch(`${apiUrl}/api/consultas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
  assert.ok((await response.json()).erro);
});

test("o carrinho rejeita um id de cliente inválido", async () => {
  const response = await fetch(`${apiUrl}/api/carrinho/abc`);

  assert.equal(response.status, 400);
  assert.ok((await response.json()).erro);
});

test("uma rota desconhecida retorna 404", async () => {
  const response = await fetch(`${apiUrl}/api/rota-que-nao-existe`);

  assert.equal(response.status, 404);
  assert.ok((await response.json()).erro);
});
