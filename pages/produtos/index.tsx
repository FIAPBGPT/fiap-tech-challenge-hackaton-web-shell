"use client";

import HeaderMenuComponent from "@/@core/components/baseHeaderMenu/HeaderMenu.component";
import ProdutoForm from "@/@core/components/forms/produtos/ProdutoForm";
import ProdutoList from "@/@core/components/forms/produtos/ProdutoList";
import { useState } from "react";

export default function ProdutosPage() {
  return (
    <HeaderMenuComponent>
      <div>
        <ProdutoForm
          onSuccess={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <div style={{ height: "150px" }}></div>
        <ProdutoList />
      </div>
    </HeaderMenuComponent>
  );
}
