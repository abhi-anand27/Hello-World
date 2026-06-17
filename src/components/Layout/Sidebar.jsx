import React from 'react'
import {
  LayoutDashboard, Tv, Globe, Users, TrendingUp,
  Newspaper, BrainCircuit, Settings2, ChevronLeft, ChevronRight
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tv', label: 'TV Business', icon: Tv },
  { id: 'digital', label: 'Digital / Convergence', icon: Globe },
  { id: 'competitors', label: 'Competitor Analysis', icon: Users },
  { id: 'market', label: 'Market Status', icon: TrendingUp },
  { id: 'news', label: 'News & Trends', icon: Newspaper },
  { id: 'analysis', label: 'AI Analysis', icon: BrainCircuit },
  { id: 'admin', label: 'Data Editor', icon: Settings2 },
]

export default function Sidebar({ activePage, onNavigate, isOpen }) {
  return (
    <aside
      className={`flex flex-col bg-ndtv-card border-r border-ndtv-border transition-all duration-300 ${
        isOpen ? 'w-60' : 'w-16'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-ndtv-border ${!isOpen && 'justify-center px-2'}`}>
        <div className="flex-shrink-0 w-8 h-8 bg-ndtv-red rounded-lg flex items-center justify-center font-bold text-sm">
          N
        </div>
        {isOpen && (
          <div>
            <div className="font-bold text-sm leading-tight">NDTV</div>
            <div className="text-xs text-gray-400 leading-tight">Financial Dashboard</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => onNavigate(id)}
                title={!isOpen ? label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activePage === id
                    ? 'bg-ndtv-red text-white'
                    : 'text-gray-400 hover:text-white hover:bg-ndtv-border/50'
                } ${!isOpen ? 'justify-center' : ''}`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {isOpen && <span>{label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="px-4 py-3 border-t border-ndtv-border">
          <div className="text-xs text-gray-500">Data as of Q3 FY25</div>
          <div className="text-xs text-gray-600 mt-0.5">© NDTV Management Portal</div>
        </div>
      )}
    </aside>
  )
}
