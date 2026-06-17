import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

// Base URL: in dev, Vite proxies /api → http://localhost:3001 (see vite.config.js)
const API = '/api'

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
      setError(e.message)
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
