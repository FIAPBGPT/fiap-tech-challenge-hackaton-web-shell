'use client';

import EstoqueList from "@/@core/components/forms/estoque/EstoqueList";

// import SaldoEstoque from './SaldoEstoque'; // (opcional futuro)
// import GraficoEstoque from './GraficoEstoque'; // (opcional futuro)

export default function EstoquePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Gestão de Estoque</h1>

      {/* Formulário e lista */}
      <EstoqueList />

      {/* Futuras funcionalidades */}
      {/* <SaldoEstoque /> */}
      {/* <GraficoEstoque /> */}
    </div>
  );
}
