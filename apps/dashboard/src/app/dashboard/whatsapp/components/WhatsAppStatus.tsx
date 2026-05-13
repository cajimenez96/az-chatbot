'use client'

import React from 'react'
import { CheckCircle2, RefreshCcw, AlertTriangle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface WhatsAppStatusProps {
  data: any
  isLoading: boolean
  isError: boolean
}

export function WhatsAppStatus({ data, isLoading, isError }: WhatsAppStatusProps) {
  if (isLoading) {
    return <p className="text-caption">Cargando estado...</p>
  }

  if (isError) {
    return (
      <div style={{ color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={20} />
        Hubo un error al conectar con la API
      </div>
    )
  }

  if (data?.isConnected) {
    return (
      <div className="state-box state-box--ok">
        <CheckCircle2 size={48} color="var(--color-success)" />
        <h2 style={{ font: 'var(--text-heading-sm)', color: 'var(--color-ink)' }}>BOT CONECTADO</h2>
        <p className="text-caption">El sistema está operando normalmente y respondiendo consultas.</p>
      </div>
    )
  }

  if (data?.qrCode) {
    return (
      <div className="state-box state-box--qr">
        <QRCodeSVG value={data.qrCode} size={256} />
      </div>
    )
  }

  return (
    <div className="state-box state-box--wait">
      <RefreshCcw size={40} className="animate-spin" color="var(--color-ink)" />
      <p style={{ color: 'var(--color-body)' }}>Esperando código QR del Bot...</p>
      <p className="text-caption">Asegurate de que el proceso del Bot esté corriendo en tu servidor.</p>
    </div>
  )
}
