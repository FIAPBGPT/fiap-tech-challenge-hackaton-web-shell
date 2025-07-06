import { Container, LinkIsActive } from "@/@theme/custom/Menu.styles";
import UserIcon from "@/public/contact.svg";
import HomeIcon from "@/public/home.svg";
import RegisterIcon from "@/public/cadastro_check.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import useWindowSize from "../../../hooks/useWindowSize";
import { usePathname } from "next/navigation";
import CardapioIcon from "@/public/icons8cardapio.svg";

interface MenuComponentProps {
  isMenuOpen: boolean;
  onClose?: () => void; // Função opcional para fechar o menu
}

export default function MenuComponent({
  isMenuOpen,
  onClose,
}: MenuComponentProps) {
  const [isMenuLinksOpen, setIsMenuLinksOpen] = useState(false);
  const { width } = useWindowSize();
  const pathname = usePathname();
  const isMobile = width <= 720;

  useEffect(() => {
    // Abre automaticamente se estiver em uma rota de cadastro
    const cadastroRoutes = [
      "/complete-cadastro",
      "/fazendas",
      "/produtos",
      "/estoque",
      "/metas",
    ];
    const isInCadastroRoute = cadastroRoutes.includes(pathname);

    setIsMenuLinksOpen(isInCadastroRoute);
  }, [pathname]);

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

  const renderActiveLink = (
    href: string,
    label: string,
    icon?: any,
    customPathname?: string
  ) => {
    const currentPath = customPathname ?? pathname;
    if (currentPath === href) {
      return (
        <Link
          href={href}
          className={pathname === href ? "isActive" : ""}
          onClick={handleLinkClick}
        >
          {icon}
          {label}
        </Link>
      );
    } else {
      return (
        <Link href={href} onClick={handleLinkClick}>
          {icon}
          {label}
        </Link>
      );
    }
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
          {renderActiveLink("/dashboard", "Home", <HomeIcon />)}
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

      <div id="menu-links-cadastro" className={isMenuLinksOpen ? "show" : ""}>
        {renderActiveLink("/complete-cadastro", "Usuário")}
        {renderActiveLink("/fazendas", "Fazenda")}
        {renderActiveLink("/produtos", "Produto")}
        {renderActiveLink("/estoque", "Estoque")}
        {renderActiveLink("/metas", "Meta")}
      </div>
    </Container>
  );
}
