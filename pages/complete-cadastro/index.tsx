"use client";
import { useEffect, useState } from "react";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuthStore } from "@/@core/store/authStore";

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
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Complete seu Cadastro</h2>
      
      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          <strong>{error}</strong>
        </div>
      )}
      
      {email && (
        <div style={{ marginBottom: "20px" }}>
          <p>O e-mail para concluir seu cadastro foi enviado para: <strong>{email}</strong></p>
        </div>
      )}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Digite sua nova senha"
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
        required
      />

      <button
        onClick={handleCompleteCadastro}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Processando..." : "Concluir Cadastro"}
      </button>
    </div>
  );
}
