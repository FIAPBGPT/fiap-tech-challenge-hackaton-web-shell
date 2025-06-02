'use client';
import { useEffect, useState } from "react";
import { listarSafras } from "@/@core/services/firebase/firebaseService";

interface SafraSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  name?: string;
}

export default function SafraSelect({ value, onChange, required, name }: SafraSelectProps) {
  const [safras, setSafras] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSafras() {
      const lista = await listarSafras();
      setSafras(lista);
    }
    fetchSafras();
  }, []);

  return (
    <select
      name={name || "safra"} // importante passar o name para funcionar com handleChange
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">Selecione uma safra</option>
      {safras.map(s => (
        <option key={s.id} value={s.valor}>
          {s.nome}
        </option>
      ))}
    </select>
  );
}
