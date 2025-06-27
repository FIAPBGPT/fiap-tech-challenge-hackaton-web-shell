import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export enum CurrentSection {
  HOME = "Home",
  CAD_PRODUTOS = "Cadastro de Produtos",
  CAD_FAZENDAS = "Cadastro de Fazendas",
  COMPLETE_CADASTRO = "Complete seu cadastro",
  DESCONHECIDA = ""
}

export function useHeaderSection(): CurrentSection {
  const pathname = usePathname();
  const [section, setSection] = useState<CurrentSection>(CurrentSection.DESCONHECIDA);

  useEffect(() => {
    switch (pathname) {
      case "/":
        setSection(CurrentSection.HOME);
        break;
      case "/cadastro-produtos":
        setSection(CurrentSection.CAD_PRODUTOS);
        break;
      case "/cadastro-fazendas":
        setSection(CurrentSection.CAD_FAZENDAS);
        break;
      case "/complete-cadastro":
        setSection(CurrentSection.COMPLETE_CADASTRO);
        break;
      default:
        setSection(CurrentSection.DESCONHECIDA);
    }
  }, [pathname]);

  return section;
}