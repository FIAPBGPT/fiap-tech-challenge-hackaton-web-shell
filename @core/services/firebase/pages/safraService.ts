import {
  listar,
  adicionar,
  atualizar,
  excluir,
} from '../firebaseService';

const COLLECTION = 'safras';

export async function listarSafra() {
  return await listar(COLLECTION);
}

export async function adicionarSafra(dado: any) {
  return await adicionar(COLLECTION, dado);
}

export async function atualizarSafra(id: string, dado: any) {
  return await atualizar(COLLECTION, id, dado);
}

export async function excluirSafra(id: string) {
  return await excluir(COLLECTION, id);
}
