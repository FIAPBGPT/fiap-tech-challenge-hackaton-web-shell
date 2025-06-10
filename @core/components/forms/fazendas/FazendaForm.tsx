'use client';
import {
  adicionarFazenda,
  atualizarFazenda,
} from "@/@core/services/firebase/pages/fazendasService";
import { useEffect, useState } from "react";

const estadosBR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

interface FazendaFormProps {
  onSuccess: () => void;
  editarFazenda?: { 
    id: string; 
    nome: string; 
    estado: string;
    latitude?: number | null;
    longitude?: number | null;
  };
  onCancelEdit?: () => void;
}

export default function FazendaForm({
  onSuccess,
  editarFazenda,
  onCancelEdit,
}: FazendaFormProps) {
  const [nome, setNome] = useState("");
  const [estado, setEstado] = useState("");
  const [latitude, setLatitude] = useState<string>("");  // guardamos como string para input
  const [longitude, setLongitude] = useState<string>("");

  // Carrega os dados ao editar uma fazenda existente
  useEffect(() => {
    if (editarFazenda) {
      setNome(editarFazenda.nome);
      setEstado(editarFazenda.estado);
      setLatitude(editarFazenda.latitude?.toString() || "");
      setLongitude(editarFazenda.longitude?.toString() || "");
    } else {
      setNome("");
      setEstado("");
      setLatitude("");
      setLongitude("");
    }
  }, [editarFazenda]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!nome.trim() || nome.length < 2 || !estado) {
      return alert("Nome da fazenda inválido ou estado não selecionado");
    }

    // Validar latitude e longitude, se preenchidos
    const latNum = latitude ? Number(latitude) : null;
    const longNum = longitude ? Number(longitude) : null;

    if (
      (latitude && (latNum === null || isNaN(latNum) || latNum < -90 || latNum > 90)) ||
      (longitude && (longNum === null || isNaN(longNum) || longNum < -180 || longNum > 180))
    ) {
      return alert("Latitude ou Longitude inválidos");
    }

    try {
      // Atualiza ou adiciona a fazenda
      const dadosFazenda = {
        nome,
        estado,
        latitude: latNum,
        longitude: longNum,
      };

      if (editarFazenda) {
        await atualizarFazenda(editarFazenda.id, dadosFazenda);
      } else {
        await adicionarFazenda(dadosFazenda);
      }

      setNome("");
      setEstado("");
      setLatitude("");
      setLongitude("");
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar a fazenda:", error);
      alert("Ocorreu um erro ao salvar a fazenda. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>{editarFazenda ? "Editar Fazenda" : "Cadastrar Fazenda"}</legend>

        <label htmlFor="nome">Nome da Fazenda:</label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da Fazenda"
          required
        />

        <label htmlFor="estado">Estado:</label>
        <select
          id="estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
        >
          <option value="">Selecione o estado</option>
          {estadosBR.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>

        <label htmlFor="latitude">Latitude:</label>
        <input
          type="number"
          step="any"
          id="latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Latitude (ex: -23.55052)"
        />

        <label htmlFor="longitude">Longitude:</label>
        <input
          type="number"
          step="any"
          id="longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude (ex: -46.633308)"
        />

        <button type="submit">{editarFazenda ? "Salvar" : "Cadastrar"}</button>
        {editarFazenda && (
          <button type="button" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </fieldset>
    </form>
  );
}
