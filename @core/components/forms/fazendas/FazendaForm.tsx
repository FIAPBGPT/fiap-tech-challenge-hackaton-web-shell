'use client';
import { useEffect, useState } from "react";
import { adicionarFazenda, atualizarFazenda } from "@/@core/services/firebase/firebaseService";

const estadosBR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];
interface FazendaFormProps {
  onSuccess: () => void;
  editarFazenda?: { id: string; nome: string; estado: string };
  onCancelEdit?: () => void;
}

export default function FazendaForm({ onSuccess, editarFazenda, onCancelEdit }: FazendaFormProps) {
  const [nome, setNome] = useState("");
  const [estado, setEstado] = useState("");

useEffect(() => {
  if (editarFazenda) {
    setNome(editarFazenda.nome);
    setEstado(editarFazenda.estado);
  } else {
    // Limpa os campos quando sai do modo de edição
    setNome("");
    setEstado("");
  }
}, [editarFazenda]);


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!nome.trim() || !estado) return alert("Preencha todos os campos");

    if (editarFazenda) {
      await atualizarFazenda(editarFazenda.id, { nome, estado });
    } else {
      await adicionarFazenda({ nome, estado });
    }

    setNome("");
    setEstado("");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da Fazenda"
        required
      />
      <select value={estado} onChange={(e) => setEstado(e.target.value)} required>
        <option value="">Selecione o estado</option>
        {estadosBR.map((uf) => (
          <option key={uf} value={uf}>
            {uf}
          </option>
        ))}
      </select>
      <button type="submit">{editarFazenda ? "Salvar" : "Cadastrar"}</button>
      {editarFazenda && <button type="button" onClick={onCancelEdit}>Cancelar</button>}
    </form>
  );

}

