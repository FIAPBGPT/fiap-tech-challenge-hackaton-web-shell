// services/firestore/safras.ts
import { adicionar, listar, atualizar, excluir } from "../firebaseService";

// Adiciona uma nova safra
export async function adicionarSafra(dados: { nome: string; valor: string }) {
  return adicionar("safras", dados);
}

// Lista safras
export async function listarSafras() {
  return listar("safras");
}

// Atualiza uma safra
export async function atualizarSafra(
  id: string,
  dados: { nome: string; valor: string }
) {
  return atualizar("safras", id, dados);
}

// Exclui uma safra
export async function excluirSafra(id: string) {
  return excluir("safras", id);
}
