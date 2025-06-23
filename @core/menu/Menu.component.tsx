import { Container } from "@/@theme/custom/Menu.styles";
import UserIcon from "@/public/contact.svg";
import HomeIcon from "@/public/home.svg";
import RegisterIcon from "@/public/cadastro_check.svg";
import Link from "next/link";

export default function MenuComponent() {
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
          <Link href={"/"}>
            <RegisterIcon />
            Cadastrar
          </Link>
        </div>
        <div id="menu-links-cadastro">
          <Link href={"/"}>Cadastrar</Link>
          <Link href={"/"}>Cadastrar</Link>
          <Link href={"/"}>Cadastrar</Link>
          <Link href={"/"}>Cadastrar</Link>
        </div>
      </div>
    </Container>
  );
}
