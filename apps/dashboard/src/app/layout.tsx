import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Renault — Panel de Gestión',
  description: 'Panel administrativo de atención automatizada Renault',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
