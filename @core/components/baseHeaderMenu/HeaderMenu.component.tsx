import HeaderComponent from "@/@core/components/header/Header.component";
import MenuComponent from "@/@core/menu/Menu.component";
import { MainContainer } from "@/@theme/custom/DashboradPage-naoSubir-styles";
import { useState } from "react";

export default function HeaderMenuComponent({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <MainContainer>
      <HeaderComponent toggleMenu={() => setIsMenuOpen((visible) => !visible)}/>
      <MenuComponent isMenuOpen={isMenuOpen} />
      <main style={{ flex: 1, padding: "20px", width: "100%" }}>
        {children}
      </main>
    </MainContainer>
  );
}
