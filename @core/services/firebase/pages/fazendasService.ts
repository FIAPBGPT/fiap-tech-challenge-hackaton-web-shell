import { adicionar, listar, atualizar, excluir } from "../firebaseService";

// Adiciona uma nova fazenda
export async function adicionarFazenda(fazenda: {
  nome: string;
  estado: string;
}) {
  return adicionar("fazendas", fazenda);
}

// Lista fazendas
export async function listarFazendas() {
  return listar("fazendas");
}

// Atualiza uma fazenda
export async function atualizarFazenda(
  id: string,
  dados: { nome: string; estado: string }
) {
  return atualizar("fazendas", id, dados);
}

// Exclui uma fazenda
export async function excluirFazenda(id: string) {
  return excluir("fazendas", id);
}
