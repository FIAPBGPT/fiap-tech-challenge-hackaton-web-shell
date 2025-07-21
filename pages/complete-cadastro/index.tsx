"use client";
import { useEffect, useState } from "react";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuthStore } from "@/@core/store/authStore";
import { ContactContainer, ContactText, FooterContainer, IconLink, IconsContainer } from "@/@theme/custom/Footer.style";
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import InputComponent from '@/@core/components/ui/input/Input.component'
import ButtonComponent from '@/@core/components/ui/Button'
import { Container } from '@/@theme/custom/Forms.styles'

export default function CompleteCadastro() {
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { setUser } = useAuthStore() // Atualizando o estado de autenticação global

  useEffect(() => {
    const auth = getAuth();

    setTimeout(() => {
      // Verifica se o link de cadastro é válido
      if (isSignInWithEmailLink(auth, window.location.href)) {
        console.log(window.location.href);
        localStorage.setItem("complete_cadastro_link", window.location.href);
        // Tenta obter o e-mail do localStorage com um pequeno delay para garantir que esteja disponível
        const tryGetPendingEmail = (retries = 5) => {
          const pendingEmail = localStorage.getItem("pending_email");
          if (pendingEmail) {
            try {
              const decodedEmail = atob(decodeURIComponent(pendingEmail));
              if (decodedEmail) {
                setEmail(decodedEmail);
                return;
              }
            } catch {
              // Se falhar ao decodificar, mostra erro
            }
          }
          if (retries > 0) {
            setTimeout(() => tryGetPendingEmail(retries - 1), 200);
          } else {
            setError("Link de cadastro inválido.");
          }
        };
        tryGetPendingEmail();
      } else {
        setError("O link de cadastro não é válido.");
      }
    }, 200); // Pequeno delay para garantir que o localStorage esteja pronto
  }, []);

  const handleCompleteCadastro = async () => {
    if (!email || !password) {
      setError("E-mail ou senha não fornecidos.");
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();
      const windowHref: string | null = localStorage.getItem(
        "complete_cadastro_link"
      );

      if (!windowHref || !isSignInWithEmailLink(auth, windowHref)) {
        throw new Error("Link inválido ou expirado.");
      }

      console.log("Link de cadastro:", windowHref);
      console.log("E-mail:", email);

      // Realiza o login com link mágico
      await signInWithEmailLink(auth, email, windowHref);

      if (auth.currentUser) {
        await updatePassword(auth.currentUser, password);
        setUser({ uid: auth.currentUser.uid || "", email: email });
        router.push("/home-cadastrar");
      } else {
        throw new Error("Usuário não autenticado.");
      }
    } catch (error: any) {
      console.error("Erro ao completar cadastro:", error.message);
      if (error.code === "auth/invalid-action-code") {
        setError(
          "Link inválido ou já utilizado. Solicite um novo e-mail de cadastro."
        );
      } else {
        setError("Erro ao completar o cadastro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="form-container-complete">
        <div className="form-container">
          {error && (
            <div style={{ color: "red", marginBottom: "15px" }}>
              <strong>{error}</strong>
            </div>
          )}

          {email && (
            <div style={{ marginBottom: "20px" }}>
              <p>
                Conclua o cadastro para: <strong>{email}</strong>
              </p>
            </div>
          )}
          <div id="div-logo-input-button">
            <div id="div-logotipo"></div>

            <div className="div-input-senha">
              <InputComponent
                type="password"
                value={password}
                onChange={(value) => setPassword(value)}
                placeholder="Digite sua nova senha"
                required
                id={"complete-cadastro"}
                name={"complete-cadastro"}
              />

              <div className="div-buttons">
                <ButtonComponent
                  onClick={handleCompleteCadastro}
                  disabled={loading}
                  label={loading ? "Processando..." : "Concluir Cadastro"}
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterContainer>
        <ContactContainer>
          <ContactText>Contate-nos</ContactText>
          <IconsContainer>
            <IconLink
              href="https://instagram.com"
              target="_blank"
              aria-label="Instagram"
            >
              <FaInstagram />
            </IconLink>
            <IconLink
              href="https://linkedin.com"
              target="_blank"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </IconLink>
            <IconLink
              href="https://wa.me/1234567890"
              target="_blank"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </IconLink>
          </IconsContainer>
        </ContactContainer>
        <ContactContainer>
          <ContactText>0800 004 250 08 | suporte@fiapfams.com.br</ContactText>
          <ContactText>Desenvolvido por Grupo 29</ContactText>
        </ContactContainer>
      </FooterContainer>
    </Container>
  );
}
