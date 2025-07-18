"use client";
import Image from 'next/image';
import { auth } from "@/@core/services/firebase/firebase";
import { useAuthStore } from "@/@core/store/authStore";
import { StyledButton } from "@/@theme/custom/Button.style";
import { FooterContainer, ContactContainer, ContactText, IconsContainer, IconLink } from "@/@theme/custom/Footer.style";
import { Content, ErrorText, FormContainer, Header, LeftText, LoginContainer, LoginContainerContent, Logo, PageContainer, TitleForm } from "@/@theme/custom/LoginPage-style";
import { signInWithEmailAndPassword } from "firebase/auth";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import logo from "@/public/image/logo.png";
import InputComponent from '@/@core/components/ui/input';

// @ts-ignore
const Mfe = dynamic(() => import("mfe/app"), {
  ssr: false,
  loading: () => <Spinner animation="border" variant="secondary" size="sm" />,
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, senha);
      const { uid, email: userEmail } = res.user;
      setUser({ uid, email: userEmail || "" });
      router.push("/home-cadastrar");
    } catch (error: any) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      console.error(error);
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
              Sua solução em planejamento
            </LeftText>

            <FormContainer>
              <TitleForm>
                Faça seu Login
              </TitleForm>
              <InputComponent
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <InputComponent
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type="password"
                placeholder="Senha"
              />
              <StyledButton variant="secondary" onClick={handleLogin}>{loading ? <Spinner animation="border" size="sm" /> : "Entrar"}</StyledButton>
              <ErrorText>{error}</ErrorText>
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