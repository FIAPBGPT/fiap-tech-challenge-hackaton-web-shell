"use client";
import { sendInviteEmail } from "@/@core/services/firebase/pages/inviteUserService";
import { useState } from "react";

export default function InviteUser() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Função para tratar o envio do convite
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("O e-mail é obrigatório");
      return;
    }

    setError(null); // Limpar qualquer erro anterior
    setLoading(true); // Iniciar o processo de loading

    try {
      await sendInviteEmail(email); // Envia o convite
      setSuccessMessage("Convite enviado com sucesso!");
      setEmail(""); // Limpar o campo de e-mail após envio
    } catch (err) {
      setError("Erro ao enviar o convite. Tente novamente.");
    } finally {
      setLoading(false); // Finalizar o processo de loading
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px", borderRadius: "8px", backgroundColor: "#f9f9f9", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <h2>Enviar Convite para Cadastro</h2>
      
      {/* Mensagem de Sucesso */}
      {successMessage && (
        <div style={{ color: "green", marginBottom: "15px", textAlign: "center" }}>
          {successMessage}
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
            E-mail do Usuário:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o e-mail do usuário"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Convite"}
        </button>
      </form>
    </div>
  );
}
