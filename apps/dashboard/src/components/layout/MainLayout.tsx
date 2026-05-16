"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 h-screen flex flex-col overflow-hidden bg-white">
        <div className="p-4 px-8">
          <SidebarTrigger />
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </SidebarProvider>
  );
}
