'use client';
import { useEffect, useState } from "react";
import ProducaoForm from "./ProducoesForm";
import { adicionarEstoque } from "@/@core/services/firebase/pages/estoqueService";
import {
  excluirProducao,
  listarProducoes,
} from "@/@core/services/firebase/pages/producoesService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarFazendas } from "@/@core/services/firebase/pages/fazendasService";
import { listarSafras } from "@/@core/services/firebase/pages/safraService";

export default function ProducoesList() {
  const [producoes, setProducoes] = useState<any[]>([]);
  const [producaoEditando, setProducaoEditando] = useState<any | null>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [safras, setSafras] = useState<any[]>([]);

  const nomeProdutoFormatado = (produtos: any[], id: string) => {
    const produto = produtos.find((item) => item.id === id);
    if (!produto) return id; // Retorna o id se o produto não for encontrado
    return produto.categoria
      ? `${produto.nome} (${produto.categoria})`
      : produto.nome;
  };

  const nomePorId = (lista: any[], id: string) => {
    return lista.find((item) => item.id === id)?.nome || id;
  };

  const formatarSafra = (safraValor: string) => {
    if (!safraValor) return ""; // Retorna vazio se safraValor for nulo ou indefinido
    // Exemplo: recebe "SAF2425" e retorna "SAF24/25"
    const safraResult =
      safras.find((s) => s.id === safraValor) ||
      console.warn(`Safra não encontrada: ${safraValor}`);
    return safraResult.nome;
  };

  const carregar = async () => {
    const listaProducoes = await listarProducoes();
    const listaProdutos = await listarProdutos();
    const listaFazendas = await listarFazendas();
    const listaSafras = await listarSafras();

    setProducoes(listaProducoes);
    setProdutos(listaProdutos);
    setFazendas(listaFazendas);
    setSafras(listaSafras);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleEditar = async (producao: any) => {
    setProducaoEditando(producao);
    const quantidadeAnterior = producao.quantidade;
    const novaQuantidade = producaoEditando?.quantidade;

    if (novaQuantidade !== quantidadeAnterior) {
      if (novaQuantidade > quantidadeAnterior) {
        await adicionarEstoque({
          produtoId: producao.produto,
          safraId: producao.safra,
          quantidade: novaQuantidade - quantidadeAnterior,
          tipo: "entrada",
        });
      } else {
        await adicionarEstoque({
          produtoId: producao.produto,
          safraId: producao.safra,
          quantidade: quantidadeAnterior - novaQuantidade,
          tipo: "saida",
        });
      }
    }
    setProducaoEditando(producao);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta produção?")) {
      const producaoExcluida = producoes.find((p) => p.id === id);

      if (producaoExcluida) {
        await adicionarEstoque({
          produtoId: producaoExcluida.produto,
          safraId: producaoExcluida.safra,
          quantidade: producaoExcluida.quantidade,
          tipo: "saida", // Removendo a produção do estoque
        });

        await excluirProducao(id);
        carregar();
      }
    }
  };

  return (
    <div>
      <h3>Produções</h3>

      <ProducaoForm
        editarProducao={producaoEditando ?? undefined}
        onSuccess={() => {
          setProducaoEditando(null);
          carregar();
        }}
        onCancelEdit={() => setProducaoEditando(null)}
      />

      <ul>
        {producoes.map((p) => (
          <li key={p.id}>
            <strong>{nomeProdutoFormatado(produtos, p.produto)}</strong> -{" "}
            {p.quantidade} unidades - {nomePorId(fazendas, p.fazenda)} -{" "}
            {formatarSafra(p.safra)}
            <br />
            <button onClick={() => handleEditar(p)}>Editar</button>{" "}
            <button onClick={() => handleDelete(p.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
