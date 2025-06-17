// services/firestore/produtos.ts
import { adicionar, listar, atualizar, excluir } from "../firebaseService";

// Adiciona um novo produto
export async function adicionarProduto(dados: { nome: string; categoria?: string; preco?: number; ativo?: boolean }) {
  return adicionar("produtos", {
    ...dados,
    ativo: dados.ativo ?? true,
  });
}

// Lista produtos
export async function listarProdutos() {
  return listar("produtos");
}

// Atualiza um produto
export async function atualizarProduto(id: string, dados: any) {
  return atualizar("produtos", id, dados);
}

// Exclui um produto
export async function excluirProduto(id: string) {
  return excluir("produtos", id);
}
