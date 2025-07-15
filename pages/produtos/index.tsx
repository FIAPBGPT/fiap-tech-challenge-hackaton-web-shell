"use client";

import HeaderMenuComponent from "@/@core/components/baseHeaderMenu/HeaderMenu.component";
import ProdutoForm from "@/@core/components/forms/produtos/ProdutoForm";
import ProdutoList from "@/@core/components/forms/produtos/ProdutoList";
import { Container } from "@/@theme/custom/Produtos.styles";

export default function ProdutosPage() {
  return (
    <Container>
      <ProdutoList />
    </Container>
  );
}
