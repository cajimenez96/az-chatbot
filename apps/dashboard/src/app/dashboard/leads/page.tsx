'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ILead } from '@az-chatbot/types'
import { Calendar, Mail, Phone, Tag } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/StatusBadge"

export default function LeadsPage() {
  const { data: leads, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await api.get<ILead[]>('/leads')
      return res.data
    },
  })

  if (isLoading) return <p className="text-caption">Cargando leads...</p>
  if (error)     return <p style={{ color: 'var(--color-error)' }}>Error al cargar leads</p>

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header className="page-header">
        <h1 className="page-title">GESTIÓN DE LEADS</h1>
        <p className="page-subtitle">Seguimiento de prospectos capturados por el asistente virtual</p>
      </header>

      <div className="card-default card-overflow">
        <Table>
          <TableHeader style={{ backgroundColor: 'var(--color-surface-soft)' }}>
            <TableRow>
              <TableHead className="th-cell">CLIENTE</TableHead>
              <TableHead className="th-cell">CONTACTO</TableHead>
              <TableHead className="th-cell">INTERÉS</TableHead>
              <TableHead className="th-cell">FECHA</TableHead>
              <TableHead className="th-cell">ESTADO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(leads) && leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead.id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                  <TableCell className="td-cell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar">{lead.name?.charAt(0) || 'U'}</div>
                      <span style={{ font: 'var(--text-button-md)', color: 'var(--color-ink)' }}>
                        {lead.name || 'Sin nombre'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="td-cell">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={13} /> {lead.phone}
                      </div>
                      <div className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} /> {lead.email || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="td-cell">
                    <span className="tag-pill">
                      <Tag size={11} /> {lead.interest?.toUpperCase() || 'GENERAL'}
                    </span>
                  </TableCell>
                  <TableCell className="td-cell">
                    <div className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} /> {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="td-cell">
                    <StatusBadge status={lead.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ padding: 'var(--space-xxxl)', textAlign: 'center' }}>
                  <span className="text-caption">
                    {Array.isArray(leads) ? 'No hay leads registrados todavía.' : 'No se pudo cargar la lista de leads.'}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
