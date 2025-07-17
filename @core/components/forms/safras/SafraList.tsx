import { useEffect, useState } from "react";
import SafraForm from "./SafraForm";
import { useSafraStore } from "@/@core/store/safrasStore";
import {
  excluirSafra,
  listarSafras,
} from "@/@core/services/firebase/pages/safraService";
import { Col, Row } from "react-bootstrap";
import GenericTable from "../../ui/GenericTable";

export default function SafraList() {
  const { safras, setSafras, loading, setLoading, removeSafra } =
    useSafraStore();
  const [safraEditando, setSafraEditando] = useState<any | null>(null);

  const carregar = async () => {
    setLoading(true);
    try {
      const lista = await listarSafras();
      // Garantir que cada safra tenha id, nome e valor
      const listaCompleta = lista.map((s: any) => ({
        id: s.id,
        nome: s.nome ?? "",
        valor: s.valor ?? 0,
      }));
      setSafras(listaCompleta);
    } catch (error) {
      console.error("Erro ao carregar safra:", error);
      alert("Erro ao carregar safra.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta safra?")) {
      try {
        await excluirSafra(id);
        setSafras(safras.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Erro ao excluir safra:", error);
        alert("Erro ao excluir safra.");
      }
    }
  };

  const handleEditar = (safra: any) => {
    setSafraEditando(safra);
  };

  const handleCancelEdit = () => {
    setSafraEditando(null);
  };

  const handleSucesso = () => {
    setSafraEditando(null);
    carregar();
  };

  return (
    <Row className="w-100">
      <Col md={12} className="mb-3">
        {safraEditando ? (
          <SafraForm
            onSuccess={handleSucesso}
            editarSafra={safraEditando}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          <SafraForm onSuccess={handleSucesso} />
        )}
      </Col>
      <Col md={12}>
        <GenericTable
          data={safras.map((s) => ({
            id: s.id,
            nome: s.nome,
            valor: s.valor,
          }))}
          columns={[
            { label: "Nome", key: "nome" },
            { label: "Valor", key: "valor" },
          ]}
          onEdit={(row) => handleEditar(row)}
          onDelete={(row) => handleDelete(row.id)}
          loading={loading}
        />
      </Col>
    </Row>
  );
}
