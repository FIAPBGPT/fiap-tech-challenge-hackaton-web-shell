'use client';

import ProdutoForm from "@/@core/components/forms/produtos/ProdutoForm";
import ProdutoList from "@/@core/components/forms/produtos/ProdutoList";
import { useState } from "react";

export default function ProdutosPage() {

  return (
    <div>
      <h1>Cadastro de Produtos</h1>

      <ProdutoList />
    </div>
  );
}
