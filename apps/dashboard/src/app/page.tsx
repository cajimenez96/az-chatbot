'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Auth logic will go here
    setTimeout(() => setLoading(false), 1500)
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
        {/* Renault Diamond */}
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

        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" placeholder="admin@renault.com" required />
          <Input label="Contraseña" type="password" placeholder="••••••••" required />

          <div style={{ marginTop: 'var(--space-xl)' }}>
            <Button disabled={loading}>
              {loading ? 'CARGANDO...' : 'ENTRAR AL PANEL'}
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
