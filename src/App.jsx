import React, { useState } from 'react'
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Overview from './components/Dashboard/Overview'
import TVBusiness from './components/TV/TVBusiness'
import DigitalBusiness from './components/Digital/DigitalBusiness'
import CompetitorAnalysis from './components/Competitors/CompetitorAnalysis'
import MarketStatus from './components/Market/MarketStatus'
import NewsTrends from './components/News/NewsTrends'
import AIAnalysis from './components/Analysis/AIAnalysis'
import AdminEditor from './components/Admin/AdminEditor'
import CopilotPanel from './components/Copilot/CopilotPanel'
import { useData } from './api/DataContext'

const PAGES = {
  overview: Overview,
  tv: TVBusiness,
  digital: DigitalBusiness,
  competitors: CompetitorAnalysis,
  market: MarketStatus,
  news: NewsTrends,
  analysis: AIAnalysis,
  admin: AdminEditor,
}

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-ndtv-dark text-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-ndtv-red" />
        <div className="text-sm text-gray-400">Loading live data from API…</div>
      </div>
    </div>
  )
}

function ErrorScreen({ error, onRetry }) {
  return (
    <div className="flex h-screen items-center justify-center bg-ndtv-dark text-white">
      <div className="flex flex-col items-center gap-3 max-w-md text-center px-6">
        <AlertTriangle size={28} className="text-yellow-400" />
        <div className="text-sm font-semibold">Could not reach the data API</div>
        <div className="text-xs text-gray-400">
          {error}. Make sure the backend is running — start everything with{' '}
          <code className="bg-ndtv-card px-1.5 py-0.5 rounded text-ndtv-red">npm run dev</code>.
        </div>
        <button onClick={onRetry}
          className="mt-2 flex items-center gap-2 px-4 py-2 bg-ndtv-red hover:bg-red-600 rounded-lg text-sm font-medium transition-colors">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { data, loading, error, refresh } = useData()

  if (loading) return <LoadingScreen />
  if (error || !data) return <ErrorScreen error={error || 'No data'} onRetry={refresh} />

  const PageComponent = PAGES[activePage] || Overview

  return (
    <div className="flex h-screen overflow-hidden bg-ndtv-dark">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <PageComponent onNavigate={setActivePage} />
        </main>
      </div>
      <CopilotPanel />
    </div>
  )
}
