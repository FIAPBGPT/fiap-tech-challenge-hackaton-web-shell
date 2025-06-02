import {
  listar,
  adicionar,
  atualizar,
  excluir,
} from '../firebaseService';

const COLLECTION = 'estoque';

export async function listarEstoque() {
  return await listar(COLLECTION);
}

export async function adicionarEstoque(dado: any) {
  return await adicionar(COLLECTION, dado);
}

export async function atualizarEstoque(id: string, dado: any) {
  return await atualizar(COLLECTION, id, dado);
}

export async function excluirEstoque(id: string) {
  return await excluir(COLLECTION, id);
}
