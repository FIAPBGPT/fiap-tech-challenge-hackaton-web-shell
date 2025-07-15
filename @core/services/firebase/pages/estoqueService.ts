import {
  addDoc,
  collection,
  getDocs,
  Timestamp,
  where,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebase";

const COLLECTION = "estoque";

// Lista todas as movimentações de estoque
export async function listarEstoque() {
  const snapshot = await getDocs(collection(firestore, COLLECTION));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Adiciona uma movimentação ao estoque
export async function adicionarEstoque(movimentacao: {
  produtoId: string;
  safraId?: string | null;
  fazendaId?: string | null;
  quantidade: number;
  tipo: "Entrada" | "Saída";
  observacao?: string;
}) {
  const data = Timestamp.now();
  await addDoc(collection(firestore, COLLECTION), {
    ...movimentacao,
    quantidade: Math.abs(movimentacao.quantidade),
    data,
  });
}

// Atualiza um registro de estoque existente
export async function atualizarEstoque(id: string, dado: any) {
  const ref = doc(firestore, COLLECTION, id);
  await updateDoc(ref, dado);
}

// Exclui um registro de estoque
export async function excluirEstoque(id: string) {
  const ref = doc(firestore, COLLECTION, id);
  await deleteDoc(ref);
}

// Registra saída de estoque referente a uma venda
export async function registrarVendaEstoque(venda: {
  id: string;
  itens: Array<{
    produtoId: string;
    safraId?: string | null;
    quantidade: number;
    fazendaId?: string | null;
  }>;
}) {
  for (const item of venda.itens) {
    await adicionarEstoque({
      produtoId: item.produtoId,
      safraId: item.safraId || null,
      fazendaId: item.fazendaId || null,
      quantidade: item.quantidade,
      tipo: "Saída",
      observacao: `Venda ID: ${venda.id}`,
    });
  }
}

// Registra entrada de estoque referente a uma produção
export async function registrarProducaoEstoque(producao: {
  id: string;
  itens: Array<{
    produtoId: string;
    safraId?: string | null;
    quantidade: number;
    fazendaId?: string | null;
  }>;
}) {
  for (const item of producao.itens) {
    await adicionarEstoque({
      produtoId: item.produtoId,
      safraId: item.safraId || null,
      fazendaId: item.fazendaId || null,
      quantidade: item.quantidade,
      tipo: "Entrada",
      observacao: `Produção ID: ${producao.id}`,
    });
  }
}

// Remove estoque referente a uma produção excluída
export async function removerProducaoEstoque(producao: {
  id: string;
  itens: Array<{
    produtoId: string;
    quantidade: number;
    safraId?: string | null;
    fazendaId?: string | null;
  }>;
}) {
  for (const item of producao.itens) {
    await adicionarEstoque({
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      safraId: item.safraId || null,
      fazendaId: item.fazendaId || null,
      tipo: "Saída",
      observacao: `Remoção de produção ID: ${producao.id}`,
    });
  }
}

// Reabastece estoque ao excluir venda
export async function reabastecerEstoqueVenda(venda: {
  id: string;
  itens: Array<{
    produtoId: string;
    quantidade: number;
    safraId?: string | null;
    fazendaId?: string | null;
  }>;
}) {
  for (const item of venda.itens) {
    await adicionarEstoque({
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      safraId: item.safraId || null,
      fazendaId: item.fazendaId || null,
      tipo: "Entrada",
      observacao: `Reabastecimento por exclusão da Venda ID: ${venda.id}`,
    });
  }
}

// Consulta o saldo do estoque (com base nas movimentações)
export async function consultarSaldoEstoque(
  produtoId: string,
  safraId: string | null,
  fazendaId: string | null
): Promise<number> {
  try {
    const constraints = [where("produtoId", "==", produtoId)];
    if (safraId) constraints.push(where("safraId", "==", safraId));
    if (fazendaId) constraints.push(where("fazendaId", "==", fazendaId));

    const q = query(collection(firestore, COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    let saldo = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      const quantidade = Number(data.quantidade) || 0;
      saldo += data.tipo === "Entrada" ? quantidade : -quantidade;
    });

    return saldo;
  } catch (error) {
    console.error("Erro ao calcular saldo de estoque:", error);
    return 0;
  }
}
