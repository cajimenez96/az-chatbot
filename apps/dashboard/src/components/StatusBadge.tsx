'use client'

import React from 'react'

interface StatusBadgeProps {
  status: string
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; border?: string }> = {
  new:       { label: 'NUEVO',      bg: 'var(--color-badge-new)',    color: 'var(--color-on-primary)' },
  contacted: { label: 'CONTACTADO', bg: 'var(--color-surface-dark)', color: 'var(--color-on-dark)' },
  sold:      { label: 'VENDIDO',    bg: 'var(--color-success)',      color: 'var(--color-on-dark)' },
  lost:      { label: 'PERDIDO',    bg: 'var(--color-error)',        color: 'var(--color-on-dark)' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = STATUS_MAP[status] ?? { label: status.toUpperCase(), bg: 'var(--color-stone)', color: 'var(--color-on-dark)' }

  return (
    <span className="tag-pill" style={{ backgroundColor: s.bg, color: s.color, borderColor: s.bg }}>
      {s.label}
    </span>
  )
}
