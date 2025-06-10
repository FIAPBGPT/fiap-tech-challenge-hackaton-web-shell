"use client";
import { useEffect, useState } from "react";
import FazendaForm from "./FazendaForm";
import { useFazendaStore } from "@/@core/store/fazendaStore";
import {
  excluirFazenda,
  listarFazendas,
} from "@/@core/services/firebase/pages/fazendasService";

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

      <ul>
        {fazendas.map((f) => (
          <li key={f.id}>
            <strong>{f.nome}</strong> - {f.estado}{" "}
            {f.latitude !== null && f.latitude !== undefined && (
              <>| Latitude: {f.latitude.toFixed(6)} </>
            )}
            {f.longitude !== null && f.longitude !== undefined && (
              <>| Longitude: {f.longitude.toFixed(6)}</>
            )}{" "}
            <button onClick={() => handleEditar(f)}>Editar</button>
            <button onClick={() => handleDelete(f.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      {loading && <p>Carregando...</p>}
    </div>
  );
}
