"use client";
import Image from 'next/image';
import { sendInviteEmail } from "@/@core/services/firebase/pages/inviteUserService";
import { Content, ErrorText, FormContainer, Header, LeftText, LoginContainer, LoginContainerContent, PageContainer, SucessText } from "@/@theme/custom/LoginPage-style";
import { useState } from "react";
import logo from "@/public/image/logo.png";
import { StyledButton } from '@/@theme/custom/Button.style';
import InputComponent from "@/@core/components/ui/input";

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
    <PageContainer>
      <LoginContainer>
        <Header>
          <Image src={logo} alt="Logo" width={120} height={40} />
        </Header>
        <LoginContainerContent>
          <Content>
            <LeftText>
              Enviar Convite para Cadastro
            </LeftText>
            <FormContainer>
              <InputComponent
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o e-mail do usuário"
                required
              />
              <StyledButton variant="secondary" onClick={handleSubmit}>{loading ? "Enviando..." : "Enviar Convite"}</StyledButton>
              {successMessage && (
                <SucessText>{successMessage}</SucessText>
              )}
              {error && (
                <ErrorText>{error}</ErrorText>
              )}              
            </FormContainer>
          </Content>  
        </LoginContainerContent>
      </LoginContainer>
    </PageContainer>
  );
}
