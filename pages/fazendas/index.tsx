'use client';
import { useState } from "react";
import FazendaForm from "@/@core/components/forms/fazendas/FazendaForm";
import FazendaList from "@/@core/components/forms/fazendas/FazendaList";


export default function FazendasPage() {
      const [atualizarLista, setAtualizarLista] = useState(false);

  const handleAtualizar = () => {
    setAtualizarLista((prev) => !prev); // toggle para forçar atualização
  };
  return (
    <>
      <h1>Gerenciar Fazendas</h1>
      <FazendaList />
    </>
  );
}
