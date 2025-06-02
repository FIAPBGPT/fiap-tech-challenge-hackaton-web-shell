import { excluirFazenda, listarFazendas } from "@/@core/services/firebase/firebaseService";
import { useEffect, useState } from "react";
import FazendaForm from "./FazendaForm";

export default function FazendaList() {
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [fazendaEditando, setFazendaEditando] = useState<any | null>(null);

  const carregar = async () => {
    const lista = await listarFazendas();
    setFazendas(lista);
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta fazenda?")) {
      await excluirFazenda(id);
      carregar();
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
            {f.nome} - {f.estado}{" "}
            <button onClick={() => handleEditar(f)}>Editar</button>
            <button onClick={() => handleDelete(f.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
