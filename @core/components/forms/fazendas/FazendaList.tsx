"use client";
import { useEffect, useState } from "react";
import FazendaForm from "./FazendaForm";
import { useFazendaStore } from "@/@core/store/fazendaStore";
import {
  excluirFazenda,
  listarFazendas,
} from "@/@core/services/firebase/pages/fazendasService";
import GenericTable from "../../ui/GenericTable";
import { Col, Row } from "react-bootstrap";

export default function FazendaList() {
  const { fazendas, setFazendas, loading, setLoading, removeFazenda } =
    useFazendaStore();
  const [fazendaEditando, setFazendaEditando] = useState<any | null>(null);

  const carregar = async () => {
    setLoading(true);
    try {
      const lista = await listarFazendas();
      // Garantir que cada fazenda tenha as propriedades necessárias
      const fazendasCompletas = lista.map((f: any) => ({
        id: f.id,
        nome: f.nome ?? "",
        estado: f.estado ?? "",
        latitude: f.latitude ?? null,
        longitude: f.longitude ?? null,
        ...f,
      }));
      setFazendas(fazendasCompletas);
    } catch (error) {
      console.error("Erro ao carregar as fazendas:", error);
      alert("Erro ao carregar as fazendas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta fazenda?")) {
      try {
        await excluirFazenda(id);
        setFazendas(fazendas.filter((f) => f.id !== id));
      } catch (error) {
        console.error("Erro ao excluir fazenda:", error);
        alert("Erro ao excluir fazenda.");
      }
    }
  };

  const handleEditar = (fazenda: any) => {
    setFazendaEditando(fazenda);
  };

  const handleCancelEdit = () => {
    setFazendaEditando(null);
  };

  const handleSucesso = () => {
    setFazendaEditando(null);
    carregar();
  };

  return (
    <div>
      <h3>Fazendas</h3>

      <FazendaForm
        editarFazenda={fazendaEditando ?? undefined}
        onSuccess={handleSucesso}
        onCancelEdit={handleCancelEdit}
      />

      <Row>
        <Col>
          <GenericTable
            data={fazendas}
            columns={[
              { key: "nome", label: "Nome" },
              { key: "estado", label: "Estado" },
              {
                key: "latitude",
                label: "Latitude",
                render: (f) => f.latitude?.toFixed(6) ?? "-",
              },
              {
                key: "longitude",
                label: "Longitude",
                render: (f) => f.longitude?.toFixed(6) ?? "-",
              },
            ]}
            onEdit={handleEditar}
            onDelete={(f) => handleDelete(f.id)}
            loading={loading}
          />
        </Col>
      </Row>

      {loading && <p>Carregando...</p>}
    </div>
  );
}
