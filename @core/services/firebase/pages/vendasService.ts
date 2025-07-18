import { adicionar, listar, atualizar, excluir } from "../firebaseService";

// Adiciona uma nova venda
export async function adicionarVenda(venda: any) {
  return adicionar("vendas", venda);
}

// Lista vendas de todos os usuários logados
export async function listarVendas() {
  return listar("vendas");
}

// Atualiza uma venda
export async function atualizarVenda(id: string, dados: any) {
  return atualizar("vendas", id, dados);
}

// Exclui uma venda
export async function excluirVenda(id: string) {
  return excluir("vendas", id);
}
