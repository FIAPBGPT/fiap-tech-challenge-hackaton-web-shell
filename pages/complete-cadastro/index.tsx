"use client";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuthStore } from "@/@core/store/authStore";
import { Content, ErrorText, FormContainer, Header, LeftText, LoginContainer, LoginContainerContent, PageContainer, SucessText } from "@/@theme/custom/LoginPage-style";
import { ContactContainer, ContactText, FooterContainer, IconLink, IconsContainer } from "@/@theme/custom/Footer.style";
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { StyledButton } from "@/@theme/custom/Button.style";
import logo from "@/public/image/logo.png";
import InputComponent from "@/@core/components/ui/input";

export default function CompleteCadastro() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuthStore(); // Atualizando o estado de autenticação global

  useEffect(() => {
    const auth = getAuth();
    const { email: queryEmail } = router.query;

    // Verifica se o link de cadastro é válido
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Se o e-mail não está na URL, mostra um erro
      if (!queryEmail) {
        setError("Link de cadastro inválido.");
        return;
      }

      // Recupera o e-mail da URL e define o estado
      const decodedEmail = atob(decodeURIComponent(queryEmail as string));
      setEmail(decodedEmail);
    } else {
      setError("O link de cadastro não é válido.");
    }
  }, [router.query.email]);

  const handleCompleteCadastro = async () => {
    if (!email || !password) {
      setError("E-mail ou senha não fornecidos.");
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();

      // Conclui o cadastro com a senha
      await signInWithEmailLink(auth, email, window.location.href);
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, password); // Define a senha do usuário
        setUser({ uid: auth.currentUser.uid || "", email: email }); // Atualiza o estado de autenticação no Zustand
      } else {
        throw new Error("Usuário não autenticado.");
      }

      // Redireciona para a página principal ou dashboard
      router.push("/home-cadastrar");
    } catch (error) {
      setError("Erro ao completar o cadastro. Tente novamente.");
    } finally {
      setLoading(false);
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
              Complete seu Cadastro
            </LeftText>
            
            <FormContainer>
              <InputComponent
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                required
              />

              <StyledButton variant="secondary" onClick={handleCompleteCadastro}>{loading ? "Processando..." : "Concluir Cadastro"}</StyledButton>

              {error && (
                <ErrorText>{error}</ErrorText>                
              )}
              
              {email && (
                <SucessText>O e-mail para concluir seu cadastro foi enviado para: <strong>{email}</strong></SucessText>
              )}
            </FormContainer>
          </Content>
        </LoginContainerContent>
      </LoginContainer>

      <FooterContainer>
        <ContactContainer>
          <ContactText>Contate-nos</ContactText>
          <IconsContainer>
            <IconLink href="https://instagram.com" target="_blank" aria-label="Instagram">
              <FaInstagram />
            </IconLink>
            <IconLink href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
              <FaLinkedin />
            </IconLink>
            <IconLink href="https://wa.me/1234567890" target="_blank" aria-label="WhatsApp">
              <FaWhatsapp />
            </IconLink>
          </IconsContainer>
        </ContactContainer>
        <ContactContainer>
          <ContactText>0800 004 250 08   |   suporte@fiapfams.com.br </ContactText>
          <ContactText>Desenvolvido por Grupo 29 </ContactText>
        </ContactContainer>
      </FooterContainer>
    </PageContainer>
  );
}
