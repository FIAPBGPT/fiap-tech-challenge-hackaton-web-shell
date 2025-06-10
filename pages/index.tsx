"use client";
import { auth } from "@/@core/services/firebase/firebase";
import { useAuthStore } from "@/@core/store/authStore";
import { signInWithEmailAndPassword } from "firebase/auth";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { Spinner } from "react-bootstrap";

// @ts-ignore
const Mfe = dynamic(() => import("mfe/app"), {
  ssr: false,
  loading: () => <Spinner animation="border" variant="secondary" size="sm" />,
});

export default function Home() {
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
      router.push("/dashboard");
    } catch (error: any) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          type="password"
          placeholder="Senha"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "10px",
          }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Entrar"}
        </button>
      </div>
    </div>
  );
}
