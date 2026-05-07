'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { LoginDTO, AuthResponse } from '@az-chatbot/types'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth, rememberedEmail, setRememberedEmail, isAuthenticated } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar email recordado al montar el componente
  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [rememberedEmail])

  // Si ya está autenticado, lo mandamos al dashboard (placeholder por ahora)
  useEffect(() => {
    if (isAuthenticated()) {
      // router.push('/dashboard') 
      console.log('Usuario ya autenticado')
    }
  }, [isAuthenticated, router])

  const loginMutation = useMutation({
    mutationFn: async (data: LoginDTO) => {
      const res = await api.post<AuthResponse>('/auth/login', data)
      return res.data
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, email)
      
      if (rememberMe) {
        setRememberedEmail(email)
      } else {
        setRememberedEmail(null)
      }

      setError(null)
      router.push('/dashboard/leads')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error al intentar iniciar sesión')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-surface-dark)',
        padding: 'var(--space-xl)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--color-surface-card)',
          padding: 'var(--space-xxxl)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: 'var(--color-primary)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            margin: '0 auto var(--space-xxl) auto',
          }}
        />

        <header style={{ textAlign: 'center', marginBottom: 'var(--space-xxl)' }}>
          <h1 style={{ font: 'var(--text-heading-lg)', color: 'var(--color-ink)', marginBottom: 'var(--space-xs)' }}>
            PANEL DE GESTIÓN
          </h1>
          <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-mute)' }}>
            Iniciá sesión para gestionar los bots de Renault
          </p>
        </header>

        {error && (
          <div style={{ 
            backgroundColor: '#fff1f1', 
            color: 'var(--color-error)', 
            padding: 'var(--space-md)', 
            marginBottom: 'var(--space-lg)',
            borderLeft: '4px solid var(--color-error)',
            font: 'var(--text-body-sm)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@renault.com" 
            required 
          />
          <Input 
            label="Contraseña" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            required 
          />

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-xl)'
          }}>
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--color-ink)', width: '16px', height: '16px' }}
            />
            <label htmlFor="remember" style={{ font: 'var(--text-caption)', color: 'var(--color-body)', cursor: 'pointer' }}>
              Recordar mis datos
            </label>
          </div>

          <div style={{ marginTop: 'var(--space-xl)' }}>
            <Button disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'CARGANDO...' : 'ENTRAR AL PANEL'}
            </Button>
          </div>
        </form>

        <footer style={{ marginTop: 'var(--space-xxl)', textAlign: 'center' }}>
          <p style={{ font: 'var(--text-caption)', color: 'var(--color-stone)' }}>
            © 2024 Renault Argentina S.A.
          </p>
        </footer>
      </div>
    </div>
  )
}
