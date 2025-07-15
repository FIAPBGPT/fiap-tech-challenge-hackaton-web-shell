import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/@core/services/firebase/firebase";

export const useAuthListener = () => {
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        setLoading(true);

        if (firebaseUser) {
          const currentUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
          };
          setUser(currentUser);

          if (router.pathname === "/complete-cadastro") {
            router.push("/dashboard");
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [router]);

  return { user, loading };
};
