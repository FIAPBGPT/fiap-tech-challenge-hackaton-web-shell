'use client';
import { listarFazendas } from "@/@core/services/firebase/pages/fazendasService";
import { useEffect, useState } from "react";

export default function FazendaSelect({
  value,
  onChange,
  name = "fazenda",
}: {
  value: string;
  onChange: (e: any) => void;
  name?: string;
}) {
  const [fazendas, setFazendas] = useState<any[]>([]);

  useEffect(() => {
    const carregarFazendas = async () => {
      try {
        const fazendas = await listarFazendas();
        setFazendas(fazendas);
      } catch (error) {
        console.error("Erro ao carregar fazendas:", error);
        alert("Erro ao carregar fazendas.");
      }
    };

    carregarFazendas();
  }, []);

  return (
    <select name={name} value={value} onChange={onChange} required>
      <option value="">Selecione uma fazenda</option>
      {fazendas.map((f) => (
        <option key={f.id} value={f.id}>
          {f.nome}
        </option>
      ))}
    </select>
  );
}
