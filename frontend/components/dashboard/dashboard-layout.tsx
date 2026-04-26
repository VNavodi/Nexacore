"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      <div
        className="flex flex-col transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? "64px" : "240px",
        }}
      >
        <Header sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
