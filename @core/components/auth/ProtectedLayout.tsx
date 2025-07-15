"use client";
import { useAuthStore } from "@/@core/store/authStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para a tela de login se o usuário não estiver autenticado
    if (!loading && !user && router.pathname !== "/complete-cadastro") {
      router.push("/"); // Redireciona para a tela de login se não houver usuário
    }
    // else {
    //   router.push("/home-cadastrar"); // Redireciona para o dashboard se houver usuário
    // }
  }, [loading, user, router]);

  if (loading) return <p>Carregando autenticação...</p>;

  return <>{children}</>;
}
