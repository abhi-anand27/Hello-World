import React, { useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Overview from './components/Dashboard/Overview'
import TVBusiness from './components/TV/TVBusiness'
import DigitalBusiness from './components/Digital/DigitalBusiness'
import CompetitorAnalysis from './components/Competitors/CompetitorAnalysis'
import MarketStatus from './components/Market/MarketStatus'
import NewsTrends from './components/News/NewsTrends'
import AIAnalysis from './components/Analysis/AIAnalysis'
import CopilotPanel from './components/Copilot/CopilotPanel'

const PAGES = {
  overview: Overview,
  tv: TVBusiness,
  digital: DigitalBusiness,
  competitors: CompetitorAnalysis,
  market: MarketStatus,
  news: NewsTrends,
  analysis: AIAnalysis,
}

export default function App() {
  const [activePage, setActivePage] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
