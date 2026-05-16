'use client'

import React from 'react'

export function Instructions() {
  return (
    <div style={{ marginTop: 'var(--space-md)', width: '100%' }}>
      <h3 style={{ font: 'var(--text-body-lg)', color: 'var(--color-ink)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
        Instrucciones de vinculación:
      </h3>
      <ol className="instructions-list">
        <li>Abrí WhatsApp en tu teléfono.</li>
        <li>Tocá <b>Menú</b> o <b>Configuración</b> y seleccioná <b>Dispositivos vinculados</b>.</li>
        <li>Tocá en <b>Vincular un dispositivo</b>.</li>
        <li>Apuntá tu cámara a esta pantalla para escanear el código.</li>
      </ol>
    </div>
  )
}
