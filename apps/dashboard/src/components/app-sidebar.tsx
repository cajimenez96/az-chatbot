'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Users, MessageSquare, BarChart3, LogOut, Smartphone } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import business from '../../business.json';
import { useAuthStore } from '@/store/useAuthStore'

const menuItems = [
  { name: 'Leads',     icon: Users,         path: '/dashboard/leads' },
  { name: 'FAQs',      icon: MessageSquare, path: '/dashboard/faqs' },
  { name: 'Métricas',  icon: BarChart3,     path: '/dashboard/metrics' },
  { name: 'WhatsApp',  icon: Smartphone,    path: '/dashboard/whatsapp' },
]

export function AppSidebar() {
  const router   = useRouter()
  const pathname = usePathname()
  const logout   = useAuthStore((state) => state.logout)
  const user     = useAuthStore((state) => state.user)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <Sidebar>
      {/* Header — brand */}
      <SidebarHeader style={{ padding: '16px', borderBottom: '1px solid var(--color-hairline)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 32, height: 32,
            backgroundColor: 'var(--color-primary)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }} />
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', letterSpacing: '1px' }}>
            {business.client.name.toUpperCase()}
          </span>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent style={{ padding: '12px' }}>
        <SidebarGroup>
          <SidebarMenu style={{ gap: '2px' }}>
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <SidebarMenuItem key={item.name}>
                  <a
                    href={item.path}
                    className={`nav-item${isActive ? ' nav-item--active' : ''}`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — user + logout */}
      <SidebarFooter style={{ padding: '16px', borderTop: '1px solid var(--color-hairline)' }}>
        <div style={{ marginBottom: '12px' }}>
          <p className="label-overline">Usuario</p>
          <p style={{ fontSize: '14px', color: 'var(--color-ink)', fontWeight: 500 }}>
            {user?.email || 'Admin'}
          </p>
        </div>
        <button className="btn-pill btn-pill--danger" onClick={handleLogout} style={{ width: '100%' }}>
          <LogOut size={18} />
          CERRAR SESIÓN
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
