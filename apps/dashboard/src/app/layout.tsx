import QueryProvider from '@/providers/QueryProvider'
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
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
