'use client';

import { listarSafras } from "@/@core/services/firebase/pages/safraService";
import { useEffect, useState } from "react";

interface SafraSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  name?: string;
}

export default function SafraSelect({
  value,
  onChange,
  required,
  name,
}: SafraSelectProps) {
  const [safras, setSafras] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  useEffect(() => {
    async function fetchSafras() {
      try {
        const lista = await listarSafras();
        setSafras(lista);
      } catch (err) {
        console.error("Erro ao carregar as safra:", err);
        setError("Erro ao carregar as safra. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    fetchSafras();
  }, []);

  if (loading) {
    return <p>Carregando safra...</p>; // Mensagem enquanto carrega
  }

  if (error) {
    return <p>{error}</p>; // Exibe o erro, se houver
  }

  return (
    <select
      name={name || "safra"} // importante passar o name para funcionar com handleChange
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">Selecione uma safra</option>
      {safras.map((s) => (
        <option key={s.id} value={s.id}>
          {s.nome} {/* Exibe o nome e o valor da safra */}
        </option>
      ))}
    </select>
  );
}
