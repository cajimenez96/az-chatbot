'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/store/useAuthStore'
import type { LoginDTO, AuthResponse } from '@az-chatbot/types'
import business from '@/../business.json'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth, rememberedEmail, setRememberedEmail, isAuthenticated } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [rememberedEmail])

  useEffect(() => {
    if (isAuthenticated()) {
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-canvas)', padding: 'var(--space-xl)' }}>
      <div className="card-default" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-xxl)', boxSizing: 'border-box' }}>

        {/* Logo diamond */}
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'var(--color-primary)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          margin: '0 auto var(--space-xl) auto',
        }} />

        <header style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ font: 'var(--text-heading-lg)', color: 'var(--color-ink)', marginBottom: 'var(--space-xxs)' }}>
            PANEL DE GESTIÓN
          </h1>
          <p className="page-subtitle">
            Iniciá sesión para gestionar los bots de {business.client.name}
          </p>
        </header>

        {error && (
          <div style={{
            backgroundColor: '#fff1f1',
            color: 'var(--color-error)',
            font: 'var(--text-body-sm)',
            padding: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
            borderLeft: '3px solid var(--color-error)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ display: 'block', font: 'var(--text-button-sm)', color: 'var(--color-ink)', marginBottom: 'var(--space-xs)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`admin@${business.client.name.toLowerCase().replace(/\s+/g, '')}.com`}
              required
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--rounded-full)',
                font: 'var(--text-body-sm)',
                outline: 'none',
                boxSizing: 'border-box',
                color: 'var(--color-ink)',
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ display: 'block', font: 'var(--text-button-sm)', color: 'var(--color-ink)', marginBottom: 'var(--space-xs)' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--rounded-full)',
                font: 'var(--text-body-sm)',
                outline: 'none',
                boxSizing: 'border-box',
                color: 'var(--color-ink)',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xl)' }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--color-surface-dark)', width: '16px', height: '16px' }}
            />
            <label htmlFor="remember" className="text-caption" style={{ cursor: 'pointer' }}>
              Recordar mis datos
            </label>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn-pill btn-pill--primary"
            style={{ width: '100%', justifyContent: 'center', opacity: loginMutation.isPending ? 0.7 : 1 }}
          >
            {loginMutation.isPending ? 'CARGANDO...' : 'ENTRAR AL PANEL'}
          </button>
        </form>

        <footer style={{ marginTop: 'var(--space-xxl)', textAlign: 'center' }}>
          <p className="text-caption">© 2026 {business.owner.name}</p>
        </footer>
      </div>
    </div>
  )
}
