import { Container, LinkIsActive } from "@/@theme/custom/Menu.styles";
import UserIcon from "@/public/contact.svg";
import HomeIcon from "@/public/home.svg";
import RegisterIcon from "@/public/cadastro_check.svg";
import Link, { LinkProps } from "next/link";
import { ReactElement, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { useSection } from "../hooks/useSection";
import { usePathname } from "next/navigation";

export default function MenuComponent({ isMenuOpen }: { isMenuOpen: boolean }) {
  const [isMenuLinksOpen, setIsMenuLinksOpen] = useState(true);
  const { width } = useWindowSize();
  const toggleMenuLinks = () => setIsMenuLinksOpen(!isMenuLinksOpen);
  const isVisible = width > 720 || isMenuOpen;
  const section = useSection();
  const pathname = usePathname();

  if (!isVisible) return null;

  const IsActive = (
    { href, ...rest }: LinkProps,
    { children }: { children: React.ReactNode }
  ) => {
    console.log("Active link:", href);
    console.log("Active link:", pathname);
    if (pathname === href.toString()) {
      return (
        <LinkIsActive href={href.toString()} {...rest}>
          {children}
        </LinkIsActive>
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
          <Link href={"/"}>
            <HomeIcon />
            Home
          </Link>
        </div>
        <div className="menu-navigation-item">
          <button onClick={toggleMenuLinks} className="menu-button">
            <RegisterIcon />
            Cadastrar
          </button>
        </div>
      </div>

      <div id="menu-links-cadastro" className={isMenuLinksOpen ? "show" : ""}>
        <Link href={"/complete-cadastro"}>Usuário</Link>
        <Link href={"/fazendas"}>Fazenda</Link>
        <Link href={"/produtos"}>Produto</Link>
        <Link href={"/metas"}>Meta</Link>
      </div>
    </Container>
  );
}
