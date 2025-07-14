import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/@core/services/firebase/firebase"; // Importando o auth já configurado
import { useAuthStore } from "@/@core/store/authStore";
import { useRouter } from "next/router";

export const useAuthListener = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // Garante que o código só seja executado no cliente

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true); // Começa a carregar, enquanto processa a autenticação

      // Se o usuário estiver logado
      if (user) {
        setUser({ uid: user.uid, email: user.email || "" });

        // Caso o usuário tenha sido autenticado, redireciona para o dashboard ou outra página
        if (router.pathname === "/complete-cadastro") {
          // Se a pessoa já estiver logada, redireciona para o dashboard ou outra página
          router.push("/home-cadastrar");
        }
      } else {
        // Se não houver usuário, limpa o estado de usuário
        setUser(null);
      }

      setLoading(false); // Processo de autenticação finalizado
    });

    // Limpeza do listener quando o componente for desmontado
    return () => unsubscribe();
  }, [setUser, setLoading, router]); // Dependências para refazer o efeito quando o estado do usuário ou do router mudar
};
