'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { Users, MessageSquare, BarChart3, LogOut, Car, Smartphone } from 'lucide-react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  const menuItems = [
    { name: 'Leads', icon: Users, path: '/dashboard/leads' },
    { name: 'FAQs', icon: MessageSquare, path: '/dashboard/faqs' },
    { name: 'Métricas', icon: BarChart3, path: '/dashboard/metrics' },
    { name: 'WhatsApp', icon: Smartphone, path: '/dashboard/whatsapp' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-canvas)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          backgroundColor: 'var(--color-surface-dark)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xxxl)' }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: 'var(--color-primary)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          />
          <span style={{ font: 'var(--text-heading-sm)', letterSpacing: '1px' }}>RENAULT</span>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-md)',
                  backgroundColor: isActive ? 'rgba(255, 237, 0, 0.1)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-ash)',
                  border: 'none',
                  borderRadius: 'var(--rounded-none)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: 'var(--space-xs)',
                  font: 'var(--text-button-md)',
                  textAlign: 'left',
                }}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            )
          })}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-xl)' }}>
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <p style={{ font: 'var(--text-overline)', color: 'var(--color-stone)' }}>Usuario</p>
            <p style={{ font: 'var(--text-body-sm)', color: 'white' }}>{user?.email || 'Admin'}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: 'var(--space-md)',
              backgroundColor: 'transparent',
              color: '#ff4444',
              border: '1px solid #ff4444',
              cursor: 'pointer',
              font: 'var(--text-button-md)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ff4444'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ff4444' }}
          >
            <LogOut size={18} />
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 'var(--space-xxxl)', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
