import HeaderComponent from "@/@core/components/header/Header.component";
import MenuComponent from "@/@core/menu/Menu.component";
import { Container } from "@/@theme/custom/HeaderMenu.styles";
import { useState } from "react";

export default function HeaderMenuComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Container>
      <HeaderComponent
        toggleMenu={() => setIsMenuOpen((visible) => !visible)}
        isActive={isMenuOpen}
      />
      <div id="menu-main-container">
        <MenuComponent isMenuOpen={isMenuOpen} />
        <main>
          <div id="main-container">{children}</div>
        </main>
      </div>
    </Container>
  );
}
