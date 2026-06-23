// Shared store for web data the Gemini chatbot pulls (with the user's permission).
// The chatbot writes here; the News & Trends page renders these as a "Live from the web" feed.
import { useSyncExternalStore } from 'react'

let _results = []
const _listeners = new Set()

function emit() { _listeners.forEach(l => l()) }

export function addWebResult(query, sources, summary) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    query,
    sources: sources || [],
    summary: summary || '',
    ts: new Date().toISOString(),
  }
  _results = [entry, ..._results].slice(0, 40)
  emit()
}

export function clearWebResults() {
  _results = []
  emit()
}

export function getWebResults() { return _results }

export function subscribeWebResults(cb) {
  _listeners.add(cb)
  return () => _listeners.delete(cb)
}

export function useWebResults() {
  return useSyncExternalStore(subscribeWebResults, getWebResults, getWebResults)
}
