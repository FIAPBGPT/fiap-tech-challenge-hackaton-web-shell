"use client";

import ProdutoForm from "@/@core/components/forms/produtos/ProdutoForm";
import ProdutoList from "@/@core/components/forms/produtos/ProdutoList";
import { Container } from "@/@theme/custom/Produtos.styles";

export default function ProdutosPage() {
  return (
    <Container>
      <ProdutoForm
        onSuccess={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <ProdutoList />
    </Container>
  );
}
