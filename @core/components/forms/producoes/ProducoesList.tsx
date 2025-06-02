'use client';
import { useEffect, useState } from "react";
import { excluirProducao, listarProducoes } from "@/@core/services/firebase/firebaseService";
import { listarProdutos } from "@/@core/services/firebase/firebaseService";
import { listarFazendas } from "@/@core/services/firebase/firebaseService";
import { listarSafras } from "@/@core/services/firebase/firebaseService";
import ProducaoForm from "./ProducoesForm";

export default function ProducoesList() {
  const [producoes, setProducoes] = useState<any[]>([]);
  const [producaoEditando, setProducaoEditando] = useState<any | null>(null);
  
  const [produtos, setProdutos] = useState<any[]>([]);
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [safras, setSafras] = useState<any[]>([]);

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

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta produção?")) {
      // Presumo que você tem uma função excluirProducao importada também
      await excluirProducao(id);
      carregar();
    }
  };

  const handleEditar = (producao: any) => {
    setProducaoEditando(producao);
  };

  const handleCancelEdit = () => {
    setProducaoEditando(null);
  };

  const handleSucesso = () => {
    setProducaoEditando(null);
    carregar();
  };

  // Função para buscar nome pelo id na lista
  const nomePorId = (lista: any[], id: string) => {
    return lista.find((item) => item.id === id)?.nome || id;
  };

  // Função para buscar nome e categoria do produto formatado
const nomeProdutoFormatado = (produtos: any[], id: string) => {
  const p = produtos.find((item) => item.id === id);
  if (!p) return id;
  return p.categoria ? `${p.nome} (${p.categoria})` : p.nome;
};

function formatarSafra(safraValor: string) {
  // exemplo: recebe "SAF2425" e retorna "SAF24/25"
  if (!safraValor || safraValor.length !== 7) return safraValor; 
  // SAF + 2 dígitos + 2 dígitos = 7 caracteres
  return safraValor.slice(0, 5) + '/' + safraValor.slice(5);
}

  return (
    <div>
      <h3>Produções</h3>

      <ProducaoForm
        editarProducao={producaoEditando ?? undefined}
        onSuccess={handleSucesso}
        onCancelEdit={handleCancelEdit}
      />

    <ul>
      {producoes.map((p) => (
        <li key={p.id}>
          <strong>{nomeProdutoFormatado(produtos, p.produto)}</strong> - {p.quantidade} unidades -{" "}
          {nomePorId(fazendas, p.fazenda)} - {formatarSafra(p.safra)}
          <br />
          <button onClick={() => handleEditar(p)}>Editar</button>{" "}
          <button onClick={() => handleDelete(p.id)}>Excluir</button>
        </li>
      ))}
    </ul>
    </div>
  );
}
