import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";

// Adiciona uma nova venda
export async function adicionarVenda(venda: any) {
  const vendasRef = collection(firestore, "vendas");
  return await addDoc(vendasRef, venda);
}

// Lista vendas de todos os usuários logados
export async function listarVendas() {
  const vendasRef = collection(firestore, "vendas");
  const snapshot = await getDocs(vendasRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Atualiza uma venda
export async function atualizarVenda(id: string, dados: any) {
  const docRef = doc(firestore, "vendas", id);
  return await updateDoc(docRef, dados);
}

// Exclui uma venda
export async function excluirVenda(id: string) {
  const docRef = doc(firestore, "vendas", id);
  return await deleteDoc(docRef);
}

// Funções para a coleção "fazendas"
export async function adicionarFazenda(fazenda: { nome: string, estado: string }) {
  const ref = collection(firestore, "fazendas");
  return await addDoc(ref, fazenda);
}

export async function atualizarFazenda(id: string, dados: { nome: string; estado: string }) {
  const ref = doc(firestore, "fazendas", id);
  return await updateDoc(ref, dados);
}

export async function listarFazendas() {
  const ref = collection(firestore, "fazendas");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function excluirFazenda(id: string) {
  const ref = doc(firestore, "fazendas", id);
  return await deleteDoc(ref);
}

// Adicionar produção
export async function adicionarProducao(dados: any) {
  return await addDoc(collection(firestore, "producoes"), dados);
}

// Listar produções
export async function listarProducoes() {
  const ref = collection(firestore, "producoes");
  const snap = await getDocs(ref);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Atualizar produção
export async function atualizarProducao(id: string, dados: any) {
  const docRef = doc(firestore, "producoes", id);
  return await updateDoc(docRef, dados);
}

// Excluir produção
export async function excluirProducao(id: string) {
  const docRef = doc(firestore, "producoes", id);
  return await deleteDoc(docRef);
}


export async function adicionarProduto(dados: { nome: string; categoria?: string; preco?: number; ativo?: boolean }) {
  const ref = collection(firestore, "produtos");
  return await addDoc(ref, {
    ...dados,
    ativo: dados.ativo ?? true,
  });
}

export async function listarProdutos() {
  const ref = collection(firestore, "produtos");
  const querySnapshot = await getDocs(ref);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function atualizarProduto(id: string, dados: any) {
  const docRef = doc(firestore, "produtos", id);
  return await updateDoc(docRef, dados);
}

export async function excluirProduto(id: string) {
  const docRef = doc(firestore, "produtos", id);
  return await deleteDoc(docRef);
}

export async function listarSafras() {
  const snapshot = await getDocs(collection(firestore, 'safras'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function adicionarSafra(dados: { nome: string; valor: string }) {
  await addDoc(collection(firestore, 'safras'), dados);
}

export async function atualizarSafra(id: string, dados: { nome: string; valor: string }) {
  const docRef = doc(firestore, 'safras', id);
  await updateDoc(docRef, dados);
}

export async function excluirSafra(id: string) {
  const docRef = doc(firestore, 'safras', id);
  await deleteDoc(docRef);
}

export async function listarMetas() {
  const snapshot = await getDocs(collection(firestore, 'metas'));
  const metas: any[] = [];
  snapshot.forEach(doc => metas.push({ id: doc.id, ...doc.data() }));
  return metas;
}

export async function adicionarMeta(meta: any) {
  return await addDoc(collection(firestore, 'metas'), meta);
}

export async function atualizarMeta(id: string, meta: any) {
  const metaDoc = doc(firestore, "metas", id);
  return await updateDoc(metaDoc, meta);
}

export async function excluirMeta(id: string) {
  const metaDoc = doc(firestore, "metas", id);
  return await deleteDoc(metaDoc);
}

export async function adicionarEstoque(movimentacao: {
  produtoId: string;
  safraId?: string | null;
  quantidade: number;
  tipo: "entrada" | "saida";
  observacao?: string;
}) {
  // Registra a movimentação
  await addDoc(collection(firestore, "estoque"), {
    ...movimentacao,
    data: Timestamp.now(),
  });

  // Define o ID do saldo com base no produtoId + safraId para garantir unicidade
  const saldoId = movimentacao.safraId
    ? `${movimentacao.produtoId}_${movimentacao.safraId}`
    : movimentacao.produtoId;

  const saldoRef = doc(firestore, "estoque_saldos", saldoId);

  // Busca saldo atual
  const saldoSnap = await getDoc(saldoRef);
  const saldoAtual = saldoSnap.exists() ? saldoSnap.data()?.quantidade || 0 : 0;

  // Calcula nova quantidade
  const quantidadeFinal =
    movimentacao.tipo === "saida"
      ? saldoAtual - movimentacao.quantidade
      : saldoAtual + movimentacao.quantidade;

  // Atualiza o saldo no Firestore
  await setDoc(
    saldoRef,
    {
      produtoId: movimentacao.produtoId,
      safraId: movimentacao.safraId || null,
      quantidade: quantidadeFinal,
      atualizadoEm: Timestamp.now(),
    },
    { merge: true }
  );
}


export async function registrarVendaEstoque(venda: {
  id: string;
  itens: Array<{ produtoId: string; safraId?: string | null; quantidade: number }>;
}) {
  for (const item of venda.itens) {
    await adicionarEstoque({
      produtoId: item.produtoId,
      safraId: item.safraId || null,
      quantidade: item.quantidade,
      tipo: "saida",
      observacao: `Venda ID: ${venda.id}`,
    });
  }
}

export async function registrarProducaoEstoque(producao: {
  id: string;
  itens: Array<{ produtoId: string; safraId?: string | null; quantidade: number }>;
}) {
  for (const item of producao.itens) {
    await adicionarEstoque({
      produtoId: item.produtoId,
      safraId: item.safraId || null,
      quantidade: item.quantidade,
      tipo: "entrada",
      observacao: `Produção ID: ${producao.id}`,
    });
  }
}

// Função para atualizar a quantidade do produto no estoque (simplificado)
async function atualizarEstoqueProduto(produtoId: string, quantidade: number) {
  const estoqueDocRef = doc(firestore, "estoque", produtoId);
  const estoqueDoc = await getDoc(estoqueDocRef);

  if (estoqueDoc.exists()) {
    const dados = estoqueDoc.data();
    const estoqueAtual = dados?.quantidade || 0;
    await updateDoc(estoqueDocRef, {
      quantidade: estoqueAtual + quantidade,
    });
  } else {
    // Cria registro de estoque se não existir
    await setDoc(estoqueDocRef, {
      quantidade: quantidade,
    });
  }
}

// Função para registrar entrada no estoque (usada ao cadastrar produção)
export async function registrarEntradaEstoque(movimentacao: {
  id?: string;
  itens: {
    produtoId: string;
    quantidade: number;
    safraId?: string;
  }[];
  data?: Date;
  origem?: string; // ex: 'produção'
  referenciaId?: string; // id da produção
}) {
  const dataMovimentacao = movimentacao.data || new Date();

  for (const item of movimentacao.itens) {
    // 1. Adiciona registro de movimentação na coleção "estoqueMovimentacoes"
    await addDoc(collection(firestore, "estoqueMovimentacoes"), {
      tipo: "entrada",
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      safraId: item.safraId || null,
      data: dataMovimentacao,
      origem: movimentacao.origem || "produção",
      referenciaId: movimentacao.referenciaId || null,
    });

    // 2. Atualiza quantidade no estoque
    await atualizarEstoqueProduto(item.produtoId, item.quantidade);
  }
}	

export async function consultarSaldoEstoque(produtoId: string, safraId?: string | null) {
  const estoqueRef = collection(firestore, "estoque");

  // Montar query dinâmica: produtoId é obrigatório, safraId opcional
  let q = query(estoqueRef, where("produtoId", "==", produtoId));
  if (safraId !== undefined && safraId !== null) {
    q = query(q, where("safraId", "==", safraId));
  }

  const snapshot = await getDocs(q);
  let saldo = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.tipo === "entrada") {
      saldo += data.quantidade;
    } else if (data.tipo === "saida") {
      saldo -= data.quantidade;
    }
  });

  return saldo;
}

// TO-DO: Implementar services separados para cada coleção
export async function listar(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function adicionar(collectionName: string, data: any) {
  return await addDoc(collection(firestore, collectionName), data);
}

export async function atualizar(collectionName: string, id: string, data: any) {
  const ref = doc(firestore, collectionName, id);
  return await updateDoc(ref, data);
}

export async function excluir(collectionName: string, id: string) {
  const ref = doc(firestore, collectionName, id);
  return await deleteDoc(ref);
}
