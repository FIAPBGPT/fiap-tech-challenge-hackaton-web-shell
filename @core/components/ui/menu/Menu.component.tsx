import { Container,} from "@/@theme/custom/Menu.styles";
import UserIcon from "@/public/contact.svg";
import HomeIcon from "@/public/home.svg";
import RegisterIcon from "@/public/cadastro_check.svg";
import { useState } from "react";
import useWindowSize from "../../../hooks/useWindowSize";
import { usePathname } from "next/navigation";
import CardapioIcon from "@/public/icons8cardapio.svg";
import FazendasPage from "@/pages/fazendas";
import DashboardPage from "@/pages/dashboard";
import ProdutosPage from "@/pages/produtos";
import EstoquePage from "@/pages/estoque";
import ProducoesPage from "@/pages/producoes";
import CompleteCadastro from "@/pages/complete-cadastro";
import { ItemProps } from "@/@core/hooks/useSection";
import MetasPage from "@/pages/metas";

interface MenuComponentProps {
  isMenuOpen: boolean;
  onClose?: () => void;
  onOpenCadastro: (form: React.ReactNode, item: ItemProps)  => void;
}

export default function MenuComponent({
  isMenuOpen,
  onClose,
  onOpenCadastro,
}: MenuComponentProps) {
  const [isMenuLinksOpen, setIsMenuLinksOpen] = useState(false);
  const [isMenuBtnActive, setIsMenuBtnActive] = useState(false);
  const [isActiveBtn, setIsActiveBtn] = useState(ItemProps.HOME);
  const { width } = useWindowSize();
  const pathname = usePathname();
  const isMobile = width <= 720;


  // Desktop: sempre visível | Mobile: só se isMenuOpen for true
  const isVisible = !isMobile || isMenuOpen;
  if (!isVisible) return null;

  function toggleMenuLinks() {
    setIsMenuLinksOpen((isMenuLinksOpen) => !isMenuLinksOpen);
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  function toggleMenuButton() {
    setIsMenuBtnActive((isActiveBtn) => !isActiveBtn);
  }

  const renderActiveButton = (
    id: string,
    item: ItemProps,
    content: React.ReactNode,
    label: string,
    icon?: React.ReactNode,
    href?: string,
    pathname?: string
  ) => {

    return (
      <button
        onClick={() => {
          onOpenCadastro(content, item);
          setIsActiveBtn(item);
        }}
        className={`menu-button ${isActiveBtn === item ? "isActive" : ""}`}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <Container className={isMobile && isMenuOpen ? "mobile-menu-open" : ""}>
      {isMobile && onClose && (
        <div className="menu-close-button">
          <button onClick={onClose} className="close-btn">
            <CardapioIcon />
          </button>
        </div>
      )}

      <div id="menu-header">
        <div id="menu-user-icon">
          <UserIcon />
        </div>
        <div id="menu-data-user">
          <h1>Joana da Silva</h1>
          <p>Analista Administrativo</p>
          <p>Matrícula: 12345</p>
        </div>
      </div>

      <div id="menu-navigation">
        <div className="menu-navigation-item">
          {renderActiveButton(
            "home",
            ItemProps.HOME,
            <DashboardPage />,
            "Home",
            <HomeIcon />
          )}
        </div>
        <div className="menu-navigation-item">
          <button
            onClick={toggleMenuLinks}
            className={`menu-button ${isMenuLinksOpen ? "isActive" : ""}`}
          >
            <RegisterIcon />
            Cadastrar
          </button>
        </div>
      </div>

      <div id="menu-button-cadastro" className={isMenuLinksOpen ? "show" : ""}>

        {renderActiveButton("usuario", ItemProps.USUARIO, <CompleteCadastro />, "Usuário")}
        {renderActiveButton("produto", ItemProps.PRODUTO, <ProdutosPage />, "Produto")}
        {renderActiveButton("estoque", ItemProps.ESTOQUE, <EstoquePage />, "Estoque")}
        {renderActiveButton("producao", ItemProps.PRODUCAO, <ProducoesPage />, "Produção")}
        {renderActiveButton("fazenda", ItemProps.FAZENDA, <FazendasPage />, "Fazenda")}
        {renderActiveButton("metas", ItemProps.METAS, <MetasPage/>, "Metas")}
      </div>
    </Container>
  );
}
