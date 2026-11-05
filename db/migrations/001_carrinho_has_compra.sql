USE projeto_integrador;

CREATE TABLE IF NOT EXISTS carrinho_has_compra (
    id_carrinho INT NOT NULL,
    id_compra INT NOT NULL,
    qtd_item INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id_carrinho, id_compra),
    CONSTRAINT chk_carrinho_qtd_item CHECK (qtd_item > 0),
    FOREIGN KEY (id_carrinho)
        REFERENCES carrinho_de_compra(id_carrinho)
        ON DELETE CASCADE,
    FOREIGN KEY (id_compra)
        REFERENCES compra(id_compra)
);
