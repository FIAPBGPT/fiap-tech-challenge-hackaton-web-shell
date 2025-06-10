// services/firestore/metas.ts
import { adicionar, listar, atualizar, excluir } from "../firebaseService";

// Adiciona uma nova meta
export async function adicionarMeta(meta: any) {
  return adicionar("metas", meta);
}

// Lista metas
export async function listarMetas() {
  return listar("metas");
}

// Atualiza uma meta
export async function atualizarMeta(id: string, meta: any) {
  return atualizar("metas", id, meta);
}

// Exclui uma meta
export async function excluirMeta(id: string) {
  return excluir("metas", id);
}
