'use client'

import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', backgroundColor: '#ffffff' }}>
        <div style={{ marginBottom: '16px' }}>
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
