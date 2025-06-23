import { Container } from "@/@theme/custom/Header.styles";
import { useHeaderSection } from "@/@core/components/header/Header.service";
import useWindowSize from "@/@core/hooks/useWindowSize";
import CardapioIcon from "@/public/icons8cardapio.svg";

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
          <button>
            <CardapioIcon />
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <Container>
      <div id="main-container">
        <HasMenuHamburguer />
        <div id="div-section-text">
          <DataSection />
          <div>
            <h2>Bem-vindo(a)!</h2>
          </div>
        </div>
      </div>
    </Container>
  );
}
