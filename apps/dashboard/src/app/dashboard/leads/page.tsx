'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ILead } from '@az-chatbot/types'
import { Calendar, Mail, Phone, User, Tag } from 'lucide-react'

export default function LeadsPage() {
  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await api.get<ILead[]>('/leads')
      return res.data
    },
  })

  if (isLoading) return <p style={{ font: 'var(--text-body-md)', color: 'var(--color-ash)' }}>Cargando leads...</p>
  if (error) return <p style={{ color: 'var(--color-error)' }}>Error al cargar leads</p>

  return (
    <div>
      <header style={{ marginBottom: 'var(--space-xxxl)' }}>
        <h1 style={{ font: 'var(--text-heading-lg)', color: 'var(--color-ink)', marginBottom: 'var(--space-xs)' }}>
          GESTIÓN DE LEADS
        </h1>
        <p style={{ font: 'var(--text-body-md)', color: 'var(--color-body)' }}>
          Seguimiento de prospectos capturados por el asistente virtual
        </p>
      </header>

      <div style={{ backgroundColor: 'white', border: '1px solid var(--color-hairline)', borderRadius: 'var(--rounded-none)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-canvas)', borderBottom: '1px solid var(--color-hairline)' }}>
              <th style={headerStyle}>CLIENTE</th>
              <th style={headerStyle}>CONTACTO</th>
              <th style={headerStyle}>INTERÉS</th>
              <th style={headerStyle}>FECHA</th>
              <th style={headerStyle}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(leads) && leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--color-hairline)', transition: 'background 0.2s' }}>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <div style={avatarStyle}>{lead.name?.charAt(0) || 'U'}</div>
                      <span style={{ font: 'var(--text-button-md)', color: 'var(--color-ink)' }}>{lead.name || 'Sin nombre'}</span>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-body)', font: 'var(--text-caption)' }}>
                        <Phone size={14} /> {lead.phone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-body)', font: 'var(--text-caption)' }}>
                        <Mail size={14} /> {lead.email || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ 
                      font: 'var(--text-overline)', 
                      padding: '4px 8px', 
                      backgroundColor: 'var(--color-stone)', 
                      color: 'var(--color-ink)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Tag size={12} /> {lead.interest || 'GENERAL'}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-body)', font: 'var(--text-caption)' }}>
                      <Calendar size={14} /> {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <StatusBadge status={lead.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--space-xxxl)', textAlign: 'center', color: 'var(--color-ash)', font: 'var(--text-body-sm)' }}>
                  {Array.isArray(leads) ? 'No hay leads registrados todavía.' : 'No se pudo cargar la lista de leads.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: '#ffed00',
    contacted: '#000000',
    sold: '#22c55e',
    lost: '#ef4444',
  }
  
  return (
    <span style={{ 
      font: 'var(--text-caption)', 
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: status === 'new' ? 'black' : 'white',
      backgroundColor: colors[status] || 'var(--color-stone)',
      padding: '4px 12px',
      borderRadius: '20px'
    }}>
      {status}
    </span>
  )
}

const headerStyle: React.CSSProperties = {
  padding: 'var(--space-lg)',
  font: 'var(--text-overline)',
  color: 'var(--color-mute)',
  letterSpacing: '1px'
}

const cellStyle: React.CSSProperties = {
  padding: 'var(--space-lg)',
  verticalAlign: 'middle'
}

const avatarStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-ink)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  font: 'var(--text-button-md)'
}
