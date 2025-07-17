import { adicionar, listar, atualizar, excluir } from "../firebaseService";

// Adiciona uma nova produção
export async function adicionarProducao(dados: any) {
  return adicionar("producoes", dados);
}

// Lista produções
export async function listarProducoes() {
  return listar("producoes");
}

// Atualiza uma produção
export async function atualizarProducao(id: string, dados: any) {
  return atualizar("producoes", id, dados);
}

// Exclui uma produção
export async function excluirProducao(id: string) {
  return excluir("producoes", id);
}
