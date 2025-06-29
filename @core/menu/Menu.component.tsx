import { Container, LinkIsActive } from "@/@theme/custom/Menu.styles";
import UserIcon from "@/public/contact.svg";
import HomeIcon from "@/public/home.svg";
import RegisterIcon from "@/public/cadastro_check.svg";
import Link, { LinkProps } from "next/link";
import { ReactElement, useEffect, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useSection } from "../hooks/useSection";
import { usePathname } from "next/navigation";

export default function MenuComponent({ isMenuOpen }: { isMenuOpen: boolean }) {
  const [isMenuLinksOpen, setIsMenuLinksOpen] = useState(false);
  const { width } = useWindowSize();
  const toggleMenuLinks = () => setIsMenuLinksOpen(!isMenuLinksOpen);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setIsMenuLinksOpen(true);
    }
  }, [pathname]);

  const isVisible = width > 720 || isMenuOpen;
  if (!isVisible) return null;

  const renderActiveLink = (
    href: string,
    label: string,
    icon?: any,
    customPathname?: string
  ) => {
    const currentPath = customPathname ?? pathname;
    if (currentPath === href) {
      return (
        <Link href={href} className={pathname === href ? "isActive" : ""}>
          {icon}
          {label}
        </Link>
      );
    } else {
      return (
        <Link href={href}>
          {icon}
          {label}
        </Link>
      );
    }
  };

  return (
    <Container>
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
          {renderActiveLink("/", "Home", <HomeIcon />)}
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
        {renderActiveLink("/etas", "Meta")}
      </div>
    </Container>
  );
}
