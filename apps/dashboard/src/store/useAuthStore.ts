import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: { email: string } | null
  rememberedEmail: string | null
  setAuth: (token: string, email: string) => void
  setRememberedEmail: (email: string | null) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      rememberedEmail: null,

      setAuth: (token, email) => {
        set({ token, user: { email } })
      },

      setRememberedEmail: (email) => {
        set({ rememberedEmail: email })
      },

      logout: () => {
        set({ token: null, user: null })
        // Nota: El rememberedEmail NO se borra al cerrar sesión
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'chatbot-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
