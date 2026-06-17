// ── NDTV Financial Dashboard — Backend API ───────────────────────────────────
// Serves financial / competitor / market data from SQLite via db.js with
// read + write endpoints. Data persists to disk, so edits survive restarts
// and every client fetches the latest numbers — this is what makes the
// dashboard "truly dynamic".

import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { getDataset, setDataset, setKey } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001

const DATASETS = ['financials', 'competitors', 'market']

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
  const data = getDataset(dataset)
  if (Object.keys(data).length === 0) return res.status(404).json({ error: 'Store not found' })
  res.json(data)
})

// Get everything at once (used by the frontend on load)
app.get('/api/all/data', (_req, res) => {
  const out = {}
  for (const name of DATASETS) out[name] = getDataset(name)
  res.json(out)
})

// Replace an entire dataset
app.put('/api/:dataset', (req, res) => {
  const { dataset } = req.params
  if (!DATASETS.includes(dataset)) return res.status(404).json({ error: 'Unknown dataset' })
  setDataset(dataset, req.body)
  res.json({ ok: true, dataset, updatedAt: new Date().toISOString() })
})

// Patch a single top-level key within a dataset
// e.g. PATCH /api/financials  body: { key: 'tvBusinessData', value: {...} }
app.patch('/api/:dataset', (req, res) => {
  const { dataset } = req.params
  const { key, value } = req.body || {}
  if (!DATASETS.includes(dataset)) return res.status(404).json({ error: 'Unknown dataset' })
  if (!key) return res.status(400).json({ error: 'Missing key' })
  setKey(dataset, key, value)
  res.json({ ok: true, dataset, key, updatedAt: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`✓ NDTV API running at http://localhost:${PORT}`)
  console.log(`  GET  /api/health`)
  console.log(`  GET  /api/all/data`)
  console.log(`  GET/PUT/PATCH /api/{financials|competitors|market}`)
})
