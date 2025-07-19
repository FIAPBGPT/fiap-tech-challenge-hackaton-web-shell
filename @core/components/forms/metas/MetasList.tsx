'use client';
import { useEffect, useState } from "react";
import MetaForm from "./MetaForm";
import {
  excluirMeta,
  listarMetas,
} from "@/@core/services/firebase/pages/metasService";
import { listarProdutos } from "@/@core/services/firebase/pages/produtosService";
import { listarSafras } from "@/@core/services/firebase/pages/safraService";
import { Col, Row } from "react-bootstrap";
import GenericTable from "../../ui/GenericTable";

export default function MetaList() {
  const [metas, setMetas] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [safras, setSafras] = useState<any[]>([]);
  const [metaEditando, setMetaEditando] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    const [listaMetas, listaProdutos, listaSafras] = await Promise.all([
      listarMetas(),
      listarProdutos(),
      listarSafras(),
    ]);
    setMetas(listaMetas);
    setProdutos(listaProdutos);
    setSafras(listaSafras);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta meta?")) {
      await excluirMeta(id);
      carregar();
    }
  };

  const handleEditar = (meta: any) => {
    setMetaEditando(meta);
  };

  const handleCancelEdit = () => {
    setMetaEditando(null);
  };

  const handleSucesso = () => {
    setMetaEditando(null);
    carregar();
  };

  const formatarSafra = (safra: string) => {
    const safraSelected = safras.find(
      (s) => s.id === safra || s.valor === safra
    );
    if (!safraSelected) {
      return safraSelected.nome;
    } // Retorna o ID se a safra não for encontrada

    return safraSelected.nome;
  };

  const nomeProduto = (produtoId: string) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) return produtoId;
    return `${produto.nome}${
      produto.categoria ? ` (${produto.categoria})` : ""
    }`;
  };

  // Traduz o tipo para exibição
  const tipoTexto = (tipo?: string) => {
    switch (tipo) {
      case "producao":
        return "Meta de Produção";
      case "vendas":
        return "Meta de Vendas";
      default:
        return "Tipo não definido";
    }
  };

  return (
    <Row className="w-100">
      <Col md={12} className="mb-3">
        {metaEditando ? (
          <MetaForm
            editarMeta={metaEditando}
            onSuccess={handleSucesso}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          <MetaForm onSuccess={handleSucesso} />
        )}
      </Col>
      <Col md={12}>
        <GenericTable
          data={metas.map((m) => ({
            id: m.id,
            produto: nomeProduto(m.produto),
            safra: formatarSafra(m.safra),
            fazenda: m.fazenda || "N/A",
            valor: m.valor,
            tipo: tipoTexto(m.tipo),
          }))}
          columns={[
            { key: "produto", label: "Produto" },
            { key: "safra", label: "Safra" },
            { key: "fazenda", label: "Id ou Nome da Fazenda" },
            { key: "valor", label: "Valor" },
            { key: "tipo", label: "Tipo" },
          ]}
          onEdit={(row) => {
            const meta = metas.find((m) => m.id === row.id);
            if (meta) handleEditar(meta);
          }}
          onDelete={(row) => handleDelete(row.id)}
          loading={loading}
        />
      </Col>
    </Row>
  );
}
