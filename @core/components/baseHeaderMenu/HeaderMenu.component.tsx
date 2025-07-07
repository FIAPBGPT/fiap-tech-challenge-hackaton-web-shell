import HeaderComponent from "@/@core/components/ui/header/Header.component";
import MenuComponent from "@/@core/components/ui/menu/Menu.component";
import { ItemProps } from "@/@core/hooks/useSection";
import { Container } from "@/@theme/custom/HeaderMenu.styles";
import { useState } from "react";

export default function HeaderMenuComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeContent, setActiveContent] = useState<React.ReactNode | null>(
    null
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<ItemProps>(ItemProps.HOME);
  const closeMenu = () => setIsMenuOpen(false);

  const handleOpenCadastro = (form: React.ReactNode, item: ItemProps) => {
    setActiveContent(form);
    setActiveItem(item);
  };

  const handleCloseCadastro = () => {
    setActiveContent(null);
  };

  return (
    <Container>
      <HeaderComponent
        toggleMenu={() => setIsMenuOpen((visible) => !visible)}
        isActive={isMenuOpen}
        item={activeItem}
      />
      <div id="menu-main-container">
        {/* mobile */}

        <div
          className={`menu-overlay ${isMenuOpen ? "show" : ""}`}
          onClick={closeMenu}
        />

        <MenuComponent
          isMenuOpen={isMenuOpen}
          onClose={closeMenu}
          onOpenCadastro={handleOpenCadastro}
        />

        <main>
          <div id="main-container">
            {activeContent ? (
              <>
                {activeContent}
              </>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </Container>
  );
}
