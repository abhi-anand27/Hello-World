// ── NDTV Financial Dashboard — Backend API ───────────────────────────────────
// Serves financial / competitor / market data from JSON files with read + write
// endpoints. Data persists to disk, so edits survive restarts and every client
// fetches the latest numbers — this is what makes the dashboard "truly dynamic".
//
// Swap the JSON store for Postgres/Mongo later by replacing readStore/writeStore.

import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const PORT = process.env.PORT || 3001

const DATASETS = ['financials', 'competitors', 'market']

function storePath(name) {
  return join(DATA_DIR, `${name}.json`)
}
function readStore(name) {
  return JSON.parse(readFileSync(storePath(name), 'utf8'))
}
function writeStore(name, data) {
  writeFileSync(storePath(name), JSON.stringify(data, null, 2))
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', datasets: DATASETS, time: new Date().toISOString() })
})

// Get one dataset (financials | competitors | market)
app.get('/api/:dataset', (req, res) => {
  const { dataset } = req.params
  if (!DATASETS.includes(dataset)) return res.status(404).json({ error: 'Unknown dataset' })
  if (!existsSync(storePath(dataset))) return res.status(404).json({ error: 'Store not found' })
  res.json(readStore(dataset))
})

// Get everything at once (used by the frontend on load)
app.get('/api/all/data', (_req, res) => {
  const out = {}
  for (const name of DATASETS) out[name] = readStore(name)
  res.json(out)
})

// Replace an entire dataset
app.put('/api/:dataset', (req, res) => {
  const { dataset } = req.params
  if (!DATASETS.includes(dataset)) return res.status(404).json({ error: 'Unknown dataset' })
  writeStore(dataset, req.body)
  res.json({ ok: true, dataset, updatedAt: new Date().toISOString() })
})

// Patch a single top-level key within a dataset
// e.g. PATCH /api/financials  body: { key: 'tvBusinessData', value: {...} }
app.patch('/api/:dataset', (req, res) => {
  const { dataset } = req.params
  const { key, value } = req.body || {}
  if (!DATASETS.includes(dataset)) return res.status(404).json({ error: 'Unknown dataset' })
  if (!key) return res.status(400).json({ error: 'Missing key' })
  const store = readStore(dataset)
  store[key] = value
  writeStore(dataset, store)
  res.json({ ok: true, dataset, key, updatedAt: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`✓ NDTV API running at http://localhost:${PORT}`)
  console.log(`  GET  /api/health`)
  console.log(`  GET  /api/all/data`)
  console.log(`  GET/PUT/PATCH /api/{financials|competitors|market}`)
})
