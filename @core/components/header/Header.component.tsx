import { Container } from "@/@theme/custom/Header.styles";
import { useHeaderSection } from "@/@core/components/header/Header.service";
import useWindowSize from "@/@core/hooks/useWindowSize";
import CardapioIcon from "@/public/icons8cardapio.svg";
import { useState } from "react";
import MenuComponent from "@/@core/menu/Menu.component";

export default function HeaderComponent() {
  const section = useHeaderSection();
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
          <button onClick={() => toggleMenuAside()}>
            <CardapioIcon />
          </button>
        </div>
      );
    }
    return null;
  }

  const toggleMenuAside = () => {
    if (HasMenuHamburguer()) {
      return <MenuComponent />;
    } else {
      return null;
    }
  };

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
