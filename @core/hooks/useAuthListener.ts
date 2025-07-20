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
    if (typeof window === 'undefined') return

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        setLoading(true)

        if (firebaseUser) {
          const currentUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
          }
          setUser(currentUser)

          if (router.pathname === '/complete-cadastro') {
            router.push('/home-cadastrar') // Redireciona para o dashboard se houver usuário
          }
        } else {
          setUser(null)
        }

        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [router])

  const logout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
      return { success: true }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      return { success: false, error: error.massage }
    }
  }

  return { user, loading, logout }
}
