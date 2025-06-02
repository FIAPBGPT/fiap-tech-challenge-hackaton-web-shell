'use client';
import VendaForm from "@/@core/components/forms/vendas/VendasForm";
import VendaList from "@/@core/components/forms/vendas/VendasList";
import { useState } from "react";

export default function VendasPage() {

  return (
    <>
      <h1>Gestão de Vendas</h1>
      <VendaList />
    </>
  );
}
