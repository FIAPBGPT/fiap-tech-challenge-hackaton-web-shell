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

// Função para listar movimentações de estoque
export async function listarEstoque() {
  const snapshot = await getDocs(collection(firestore, COLLECTION));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Adicionar uma nova movimentação de estoque (entrada ou saída)
export async function adicionarEstoque(movimentacao: {
  produtoId: string;
  safraId?: string | null;
  fazendaId?: string | null;
  quantidade: number;
  tipo: "entrada" | "saida";
  observacao?: string;
}) {
  const data = Timestamp.now();

  await addDoc(collection(firestore, COLLECTION), {
    ...movimentacao,
    quantidade: Math.abs(movimentacao.quantidade),
    data,
  });
}

// Atualizar uma movimentação existente
export async function atualizarEstoque(id: string, dado: any) {
  const ref = doc(firestore, COLLECTION, id);
  await updateDoc(ref, dado);
}

// Excluir uma movimentação
export async function excluirEstoque(id: string) {
  const ref = doc(firestore, COLLECTION, id);
  await deleteDoc(ref);
}

// Registrar VENDA no estoque (saida)
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
      tipo: "saida",
      observacao: `Venda ID: ${venda.id}`,
    });
  }
}

// Registrar PRODUÇÃO no estoque (entrada)
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
      tipo: "entrada",
      observacao: `Produção ID: ${producao.id}`,
    });
  }
}

// Registrar ENTRADA genérica (entrada)
export async function registrarEntradaEstoque(movimentacao: {
  id?: string;
  itens: Array<{
    produtoId: string;
    quantidade: number;
    safraId?: string | null;
    fazendaId?: string | null;
  }>;
  data?: Date;
  origem?: string;
  referenciaId?: string;
}) {
  const dataMovimentacao = movimentacao.data || new Date();

  for (const item of movimentacao.itens) {
    await adicionarEstoque({
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      safraId: item.safraId || null,
      fazendaId: item.fazendaId || null,
      tipo: "entrada",
      observacao: `Entrada - Origem: ${movimentacao.origem || "manual"}`,
    });
  }
}

// Consultar saldo com base nas movimentações (sem usar estoque_saldos)
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
      saldo += data.tipo === "entrada" ? quantidade : -quantidade;
    });

    return saldo;
  } catch (error) {
    console.error("Erro ao calcular saldo de estoque:", error);
    return 0;
  }
}

// NOVA FUNÇÃO: Reabastecer estoque ao excluir uma venda
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
      tipo: "entrada", // reabastece
      observacao: `Reabastecimento por exclusão da Venda ID: ${venda.id}`,
    });
  }
}
