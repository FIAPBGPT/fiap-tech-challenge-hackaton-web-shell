import HeaderMenuComponent from "@/@core/components/baseHeaderMenu/HeaderMenu.component";
import DashboardPage from "../dashboard";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/@core/store/authStore";

export default function HomeCadastrar() {
  const [loading, setLoading] = useState(true);
  const setLoadingState = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    // Simula um carregamento de autenticação
    const timer = setTimeout(() => {
      setLoading(false);
      setLoadingState(false); // Atualiza o estado de loading no Zustand
    }, 1000); // Simula 1 segundo de carregamento
    return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
  }, []);

  return <HeaderMenuComponent children={<DashboardPage />} />;
}
