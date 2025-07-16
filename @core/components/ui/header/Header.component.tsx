import { Container } from "@/@theme/custom/Header.styles";
import { ItemProps, useSection } from "@/@core/hooks/useSection";
import useWindowSize from "@/@core/hooks/useWindowSize";
import CardapioIcon from "@/public/icons8cardapio.svg";
import { useState } from "react";

interface HeaderProps {
  toggleMenu: () => void;
  isActive: boolean;
  item: ItemProps | null;
}

export default function HeaderComponent({ toggleMenu, isActive, item }: HeaderProps) {
  const section = useSection({ item: item ?? ItemProps.HOME });
  const { width } = useWindowSize();

  function DataSection() {
    return (
      <h1 id="section-name">
        {section ? section : "Carregando informações de seção"}
      </h1>
    );
  }

  function HasMenuHamburguer() {
    if (width <= 720) {
      return (
        <div id="div-icon-header">
          <button onClick={toggleMenu}
          className={isActive ? "isActive" : ""} 
          >
            <CardapioIcon />
          </button>
        </div>
      );
    }
  }

  return (
    <Container>
      <div id="container-header">
        <div id="main-container-header">
          <HasMenuHamburguer />
          <div id="div-section-text">
            <DataSection />
          </div>
        </div>
      </div>
    </Container>
  );
}
