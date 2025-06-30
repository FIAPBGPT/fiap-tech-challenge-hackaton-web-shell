import { Container } from "@/@theme/custom/Header.styles";
import { useSection } from "@/@core/hooks/useSection";
import useWindowSize from "@/@core/hooks/useWindowSize";
import CardapioIcon from "@/public/icons8cardapio.svg";
import { useState } from "react";

interface HeaderProps {
  toggleMenu: () => void;
  isActive: boolean;
}

export default function HeaderComponent({ toggleMenu, isActive }: HeaderProps) {
  const section = useSection();
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
            <div>
              <h2>Bem-vindo(a)!</h2>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
