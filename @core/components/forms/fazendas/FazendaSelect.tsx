"use client";
import { listarFazendas } from "@/@core/services/firebase/pages/fazendasService";
import { useEffect, useState } from "react";
import SelectComponent from "../../ui/select/Select.component";

interface FazendaSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  valueKey?: string;
  labelKey?: string;
  required: boolean;
  placeholder?:string;
  label?: string;
}

export default function FazendaSelect(props: FazendaSelectProps) {
  const [fazendas, setFazendas] = useState<any[]>([]);
  

  useEffect(() => {
    const carregarFazendas = async () => {
      try {
        const fazendas = await listarFazendas();
        setFazendas(fazendas);
      } catch (error) {
        console.error("Erro ao carregar fazendas:", error);
        alert("Erro ao carregar fazendas.");
      }
    };

    carregarFazendas();
  }, []);

  return (
    <SelectComponent
      id={props.id}
      value={props.value}
      options={fazendas}
      onChange={props.onChange}
      placeholder={props.placeholder ? props.placeholder :  "Selecione uma fazenda"}
      required={props.required}
      ariaLabel="Filtrar por fazenda"
      valueKey="id"
      labelKey="nome"
      label={props.label}
      name="fazenda"
    />
  );
}
