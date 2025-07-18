
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

export const sendInviteEmail = async (email: string) => {
  const auth = getAuth();

  // Codificar o email em Base64 para que ele possa ser passado na URL
  const encodedEmail = encodeURIComponent(btoa(email)); // btoa codifica em Base64

  // URL de redirecionamento
  const actionCodeSettings = {
    url: `${window.location.origin}/complete-cadastro?email=${encodedEmail}`, 
    handleCodeInApp: true,
  };

  try {
    // Envia o link de login para o email fornecido
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  } catch (error) {
    console.error("Erro ao enviar o convite:", error);
    throw new Error("Erro ao enviar o convite");
  }
};


