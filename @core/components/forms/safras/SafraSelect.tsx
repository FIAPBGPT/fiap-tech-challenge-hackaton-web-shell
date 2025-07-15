"use client";

import { listarSafras } from "@/@core/services/firebase/pages/safraService";
import { useEffect, useState } from "react";
import SelectComponent from "../../ui/select/Select.component";

interface SafraSelectProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  valueKey?: string;
  labelKey?: string;
  required: boolean;
  label?: string;
}

export default function SafraSelect({
  value,
  onChange,
  required = false,
  valueKey,
  labelKey,
  name = "safra",
  label,
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
    <SelectComponent
      id={name}
      value={value}
      options={safras}
      onChange={onChange}
      placeholder="Selecione uma safra"
      required={required}
      ariaLabel="Selecionar safra"
      valueKey="id"
      labelKey="nome"
      label={label}
      name={name}
    />
  );
}
