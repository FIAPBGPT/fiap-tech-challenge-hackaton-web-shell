import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
} from 'firebase/auth'
import { auth } from '@/@core/services/firebase/firebase'

export const useAuthListener = () => {
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        setLoading(true);

        const isCompleteCadastroRoute =
          router.asPath.includes("complete-cadastro");

        if (firebaseUser) {
          const currentUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
          };
          setUser(currentUser);
        } else {
          if (isCompleteCadastroRoute) {
            if (typeof window !== "undefined") {
              const urlParams = new URLSearchParams(window.location.search);
              const email = urlParams.get("email");
              if (email) {
                localStorage.setItem("pending_email", email);
              }
              setTimeout(() => {
                router.push("/complete-cadastro");
              }, 2000);
            }
          } else {
            setUser(null);
          }
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
      return { success: true };
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };

  return { user, loading, logout }
}
