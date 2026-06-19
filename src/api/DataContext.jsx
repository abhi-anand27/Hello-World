import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as financialsStatic  from '../data/financials.js'
import * as competitorsStatic from '../data/competitors.js'
import * as marketStatic      from '../data/market.js'

// Base URL: in dev, Vite proxies /api → http://localhost:3001 (see vite.config.js)
const API = '/api'

// Fallback data bundle used when the API is unreachable (e.g. standalone HTML file)
function staticBundle() {
  const { tvBusinessData, consolidatedData, convergenceData } = financialsStatic
  const { tvCompetitors, digitalCompetitors, marketShareTrend, peerComparison } = competitorsStatic
  const {
    meSegments, meOverview, tvRevenue, tvSubscriptions, tvMetrics,
    digitalRevenue, digitalMetrics, adMarket, adMarketOverview,
    vodMetrics, appMetrics, onlineVideoMetrics,
  } = marketStatic
  return {
    financials:  { tvBusinessData, consolidatedData, convergenceData },
    competitors: { tvCompetitors, digitalCompetitors, marketShareTrend, peerComparison },
    market:      {
      meSegments, meOverview, tvRevenue, tvSubscriptions, tvMetrics,
      digitalRevenue, digitalMetrics, adMarket, adMarketOverview,
      vodMetrics, appMetrics, onlineVideoMetrics,
    },
  }
}

const DataContext = createContext(null)

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within <DataProvider>')
  return ctx
}

export function DataProvider({ children }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/all/data`)
      if (!res.ok) throw new Error(`API ${res.status}`)
      setData(await res.json())
    } catch (e) {
      // API unreachable (standalone HTML / no backend) — fall back to baked-in data
      setData(staticBundle())
      setError(null)   // not a user-visible error; app still works read-only
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Persist a single top-level key of a dataset, then refresh app-wide
  const updateKey = useCallback(async (dataset, key, value) => {
    const res = await fetch(`${API}/${dataset}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    if (!res.ok) throw new Error(`Save failed: ${res.status}`)
    await fetchAll()        // re-pull so every chart reflects the change
    return res.json()
  }, [fetchAll])

  return (
    <DataContext.Provider value={{ data, loading, error, refresh: fetchAll, updateKey }}>
      {children}
    </DataContext.Provider>
  )
}
