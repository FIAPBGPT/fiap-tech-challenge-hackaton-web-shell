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
    if (loading) return;

    if (!user && router.pathname !== "/complete-cadastro") {
      router.push("/"); 
    } else if (user && router.pathname === "/") {
      router.push("/home-cadastrar");
    } else {
      router.push("/complete-cadastro");
    }
  }, [loading, user, router]);

  if (loading) return <p>Carregando autenticação...</p>;

  return <>{children}</>;
}
