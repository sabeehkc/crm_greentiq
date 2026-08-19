'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar isMobileExpanded={isMobileMenuOpen} setIsMobileExpanded={setIsMobileMenuOpen} />
      <div className="flex-1 flex flex-col bg-background min-w-0 relative">
        <Navbar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 p-6 overflow-y-auto pb-12">
          {children}
        </main>
        <div className="absolute bottom-2 right-4 text-xs text-muted-foreground opacity-60 pointer-events-none">
          &copy; {new Date().getFullYear()} Sabeeh KC. All rights reserved.
        </div>
      </div>
    </div>
  )
}
