"use client";

import EstoqueForm from "@/@core/components/forms/estoque/EstoqueForm";
import EstoqueList from "@/@core/components/forms/estoque/EstoqueList";

// import SaldoEstoque from './SaldoEstoque'; // (opcional futuro)
// import GraficoEstoque from './GraficoEstoque'; // (opcional futuro)

export default function EstoquePage() {
  return (
    <div className="container mx-auto py-6">
      <EstoqueForm
        onSuccess={function (): void {
          alert("Produtos adicionados com sucesso!");
        }}
      />
      <EstoqueList />
    </div>
  );
}
