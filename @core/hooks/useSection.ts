import { useEffect, useState } from "react";

interface Item {
  item: ItemProps;
}

export enum ItemProps {
  HOME = "home",
  USUARIO = "usuario",
  PRODUTO = "produto",
  ESTOQUE = "estoque",
  PRODUCAO = "producao",
  VENDA = "venda",
  FAZENDA = "fazenda",
  SAFRA = "safra",
  METAS = "metas",
}

export enum CurrentSection {
  DASHBORAD = "Sua Dashbord",
  CAD_PRODUTOS = "Cadastro de Produtos",
  CAD_FAZENDAS = "Cadastro de Fazendas",
  CAD_SAFRAS = "Cadastro de Safras",
  COMPLETE_CADASTRO = "Complete seu cadastro",
  CAD_ESTOQUE = "Gestão de Estoque",
  CAD_PRODUCAO = "Gestão de Produção",
  CAD_VENDAS = "Gestão de Vendas",
  CAD_METAS = "Gestão de Metas",
}

export function useSection(props: Item): CurrentSection {
  const [section, setSection] = useState<CurrentSection>(
    CurrentSection.DASHBORAD
  );

  useEffect(() => {
    switch (props.item) {
      case ItemProps.HOME:
        setSection(CurrentSection.DASHBORAD);
        break;
      case ItemProps.PRODUTO:
        setSection(CurrentSection.CAD_PRODUTOS);
        break;
      case ItemProps.FAZENDA:
        setSection(CurrentSection.CAD_FAZENDAS);
        break;
      case ItemProps.SAFRA:
        setSection(CurrentSection.CAD_SAFRAS);
        break;
      case ItemProps.USUARIO:
        setSection(CurrentSection.COMPLETE_CADASTRO);
        break;
      case ItemProps.ESTOQUE:
        setSection(CurrentSection.CAD_ESTOQUE);
        break;
      case ItemProps.PRODUCAO:
        setSection(CurrentSection.CAD_PRODUCAO);
        break;
      case ItemProps.VENDA:
        setSection(CurrentSection.CAD_VENDAS);
        break;
      case ItemProps.METAS:
        setSection(CurrentSection.CAD_METAS);
        break;
      default:
        setSection(CurrentSection.DASHBORAD);
    }
  }, [props.item]);

  return section;
}
