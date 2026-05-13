import QueryProvider from '@/providers/QueryProvider'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import business from '../../business.json';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: `${business.client.name} — Panel de Gestión`,
  description: business.client.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
