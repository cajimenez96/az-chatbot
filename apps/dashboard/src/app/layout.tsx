import QueryProvider from '@/providers/QueryProvider'
import './globals.css'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import business from '../../business.json';
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body>
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
