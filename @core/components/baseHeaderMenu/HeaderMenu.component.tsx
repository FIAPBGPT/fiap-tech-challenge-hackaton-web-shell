import HeaderComponent from "@/@core/components/ui/header/Header.component";
import MenuComponent from "@/@core/components/ui/menu/Menu.component";
import { Container } from "@/@theme/custom/HeaderMenu.styles";
import { useState } from "react";

export default function HeaderMenuComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Container>
      <HeaderComponent
        toggleMenu={() => setIsMenuOpen((visible) => !visible)}
        isActive={isMenuOpen}
      />
      <div id="menu-main-container">
        {/* mobile */}

        <div
          className={`menu-overlay ${isMenuOpen ? "show" : ""}`}
          onClick={closeMenu}
        />

        <MenuComponent isMenuOpen={isMenuOpen} onClose={closeMenu} />

        <main>
          <div id="main-container">{children}</div>
        </main>
      </div>
    </Container>
  );
}
