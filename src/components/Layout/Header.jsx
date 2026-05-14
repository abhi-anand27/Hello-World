import React from 'react'
import { Menu, Bell, RefreshCw, Calendar } from 'lucide-react'

export default function Header({ onToggleSidebar, sidebarOpen }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-ndtv-card border-b border-ndtv-border flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-ndtv-border/50 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <Calendar size={14} />
          <span>{dateStr}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Live Data
        </span>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-ndtv-border/50 transition-colors">
          <RefreshCw size={16} />
        </button>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-ndtv-border/50 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-ndtv-red rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-ndtv-red flex items-center justify-center text-xs font-bold ml-1">
          M
        </div>
      </div>
    </header>
  )
}
