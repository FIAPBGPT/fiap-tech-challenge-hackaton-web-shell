'use client';
import { useEffect, useState } from "react";
import ProducaoForm from "./ProducoesForm";
import {
  removerProducaoEstoque,
  registrarProducaoEstoque,
} from "@/@core/services/firebase/pages/estoqueService";
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
    if (!produto) return id;
    return produto.categoria
      ? `${produto.nome} (${produto.categoria})`
      : produto.nome;
  };

  const nomePorId = (lista: any[], id: string) => {
    return lista.find((item) => item.id === id)?.nome || id;
  };

  const formatarSafra = (safraValor: string) => {
    if (!safraValor) return "";
    const safraResult =
      safras.find((s) => s.id === safraValor) ||
      console.warn(`Safra não encontrada: ${safraValor}`);
    return safraResult.nome;
  };

  const carregar = async () => {
    const [listaProducoes, listaProdutos, listaFazendas, listaSafras] =
      await Promise.all([
        listarProducoes(),
        listarProdutos(),
        listarFazendas(),
        listarSafras(),
      ]);

    setProducoes(listaProducoes);
    setProdutos(listaProdutos);
    setFazendas(listaFazendas);
    setSafras(listaSafras);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleEditar = (producao: any) => {
    setProducaoEditando(producao);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta produção?")) {
      const producaoExcluida = producoes.find((p) => p.id === id);

      if (producaoExcluida) {
        await removerProducaoEstoque({
          id,
          itens: [
            {
              produtoId: producaoExcluida.produto,
              safraId: producaoExcluida.safra,
              fazendaId: producaoExcluida.fazenda,
              quantidade: producaoExcluida.quantidade,
            },
          ],
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
