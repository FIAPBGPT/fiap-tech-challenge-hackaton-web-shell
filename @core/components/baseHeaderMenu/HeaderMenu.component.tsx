import HeaderComponent from "@/@core/components/header/Header.component";
import MenuComponent from "@/@core/menu/Menu.component";
import { Container } from "@/@theme/custom/DashboradPage-naoSubir-styles";
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
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100vh",
        }}
      >
        <MenuComponent isMenuOpen={isMenuOpen} />
        <main
          style={{ flex: 1, padding: "20px", width: "100%", height: "100vh" }}
        >
          {children}
        </main>
      </div>
    </Container>
  );
}
