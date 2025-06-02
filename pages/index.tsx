"use client";
import { auth } from "@/@core/services/firebase/firebase";
import { useAuthStore } from "@/@core/store/authStore";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
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
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, senha);
      const { uid, email: userEmail } = res.user;
      setUser({ uid, email: userEmail || "" });
      router.push("/dashboard");
    } catch (error) {
      alert("Erro ao entrar");
    }
  };

  const handleLoginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const { uid, email: userEmail } = res.user;
      setUser({ uid, email: userEmail || "" });
      router.push("/dashboard");
    } catch (error) {
      alert("Erro ao entrar com Google");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        type="password"
        placeholder="Senha"
      />
      <button onClick={handleLogin}>Entrar</button>

      <hr />

      <button
        onClick={handleLoginGoogle}
        style={{ backgroundColor: "#4285F4", color: "white" }}
      >
        Entrar com Google
      </button>
    </div>
  );
}
