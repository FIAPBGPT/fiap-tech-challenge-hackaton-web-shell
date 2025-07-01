import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export enum CurrentSection {
  HOME = "Home",
  CAD_PRODUTOS = "Cadastro de Produtos",
  CAD_FAZENDAS = "Cadastro de Fazendas",
  COMPLETE_CADASTRO = "Complete seu cadastro",
  METAS = "Metas",
}

export function useSection(): CurrentSection {
  const pathname = usePathname();
  const [section, setSection] = useState<CurrentSection>(CurrentSection.HOME);

  useEffect(() => {
    switch (pathname) {
      case "/":
        setSection(CurrentSection.HOME);
        break;
      case "/produtos":
        setSection(CurrentSection.CAD_PRODUTOS);
        break;
      case "/fazendas":
        setSection(CurrentSection.CAD_FAZENDAS);
        break;
      case "/complete-cadastro":
        setSection(CurrentSection.COMPLETE_CADASTRO);
        break;
      case "/metas":
        setSection(CurrentSection.METAS);
        break;
      default:
        setSection(CurrentSection.HOME);
    }
  }, [pathname]);

  return section;
}