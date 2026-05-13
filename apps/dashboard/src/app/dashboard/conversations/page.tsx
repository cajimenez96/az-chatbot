'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, CheckCircle2, User, Phone, Clock, MessageCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function ConversationsPage() {
  const queryClient = useQueryClient()
  const token = typeof window !== 'undefined' ? localStorage.getItem('renault-auth-storage') : null
  const parsedToken = token ? JSON.parse(token)?.state?.token : null

  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/conversations`, {
        headers: {
          'Authorization': `Bearer ${parsedToken}`
        }
      })
      if (!res.ok) throw new Error('Error al obtener conversaciones')
      return res.json()
    }
  })

  const closeMutation = useMutation({
    mutationFn: async (phone: string) => {
      const res = await fetch(`${API_URL}/conversations/${phone}/close`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${parsedToken}`
        }
      })
      if (!res.ok) throw new Error('Error al cerrar conversación')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting_human':
        return <span style={{ backgroundColor: '#ff4444', color: 'white', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold' }}>ESPERANDO ASESOR</span>
      case 'human_active':
        return <span style={{ backgroundColor: 'var(--color-primary)', color: 'black', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold' }}>ATENCIÓN HUMANA</span>
      case 'bot_active':
        return <span style={{ backgroundColor: '#00ff64', color: 'black', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold' }}>BOT ACTIVO</span>
      default:
        return <span style={{ backgroundColor: 'var(--color-surface-light)', color: 'var(--color-ash)', padding: '4px 8px', fontSize: '12px' }}>CERRADA</span>
    }
  }

  return (
    <div>
      <header style={{ marginBottom: 'var(--space-xxl)' }}>
        <h1 style={{ font: 'var(--text-heading-lg)', color: 'white', marginBottom: 'var(--space-xs)' }}>
          GESTIÓN DE CHATS
        </h1>
        <p style={{ font: 'var(--text-body-md)', color: 'var(--color-ash)' }}>
          Monitoreá las conversaciones en tiempo real y retomá el control del bot.
        </p>
      </header>

      {isLoading ? (
        <div style={{ color: 'white' }}>Cargando conversaciones...</div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {data?.data?.map((conv: any) => (
            <div key={conv.id} style={{ 
              backgroundColor: 'var(--color-surface)', 
              padding: 'var(--space-xl)',
              border: '1px solid var(--color-surface-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: 'var(--color-surface-light)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <User size={24} color="var(--color-ash)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: '4px' }}>
                    <span style={{ color: 'white', font: 'var(--text-body-lg)', fontWeight: 'bold' }}>
                      {conv.leadName || 'Usuario Desconocido'}
                    </span>
                    {getStatusBadge(conv.status)}
                  </div>
                  <div style={{ color: 'var(--color-primary)', fontSize: '13px', marginBottom: '8px' }}>
                    {conv.phone} {conv.leadEmail ? `• ${conv.leadEmail}` : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', color: 'var(--color-ash)', fontSize: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> Último mensaje: {new Date(conv.lastMessageAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                {(conv.status === 'waiting_human' || conv.status === 'human_active') && (
                  <button
                    onClick={() => closeMutation.mutate(conv.phone)}
                    disabled={closeMutation.isPending}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'black',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      font: 'var(--text-button-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    FINALIZAR ATENCIÓN (REACTIVAR BOT)
                  </button>
                )}
                <a
                  href={`https://web.whatsapp.com/send?phone=${conv.phone.split('@')[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '1px solid var(--color-surface-light)',
                    padding: '10px 20px',
                    textDecoration: 'none',
                    font: 'var(--text-button-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageCircle size={16} />
                  ABRIR EN WHATSAPP
                </a>
              </div>
            </div>
          ))}

          {data?.data?.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-xxxl)', color: 'var(--color-ash)' }}>
              No hay conversaciones activas en este momento.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
