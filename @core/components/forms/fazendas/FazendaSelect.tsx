'use client';
import { useEffect, useState } from "react";
import { listarFazendas } from "@/@core/services/firebase/firebaseService";

export default function FazendaSelect({
  value,
  onChange,
  name = "fazenda", // Permite customizar o nome do select, útil para integração com formulários
}: {
  value: string;
  onChange: (e: any) => void;
  name?: string;
}) {
  const [fazendas, setFazendas] = useState<any[]>([]);

  useEffect(() => {
    listarFazendas().then(setFazendas);
  }, []);

  return (
    <select name={name} value={value} onChange={onChange} required>
      <option value="">Selecione uma fazenda</option>
      {fazendas.map((f) => (
        <option key={f.id} value={f.nome}>{f.nome}</option>
      ))}
    </select>
  );
}
