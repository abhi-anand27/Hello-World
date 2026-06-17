// ── NDTV Financial Dashboard — SQLite persistence layer ──────────────────────
// Uses better-sqlite3 (synchronous API, compatible with ESM via createRequire).
// Schema: store(dataset TEXT, key TEXT, value TEXT, PRIMARY KEY(dataset, key))
// Each top-level key of a JSON dataset is stored as one row; value is JSON text.

import { createRequire } from 'module'
import { readFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DB_PATH = join(DATA_DIR, 'ndtv.db')

// Ensure data directory exists
mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(DB_PATH)

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS store (
    dataset TEXT NOT NULL,
    key     TEXT NOT NULL,
    value   TEXT NOT NULL,
    PRIMARY KEY (dataset, key)
  )
`)

// Prepared statements
const stmtGet    = db.prepare('SELECT key, value FROM store WHERE dataset = ?')
const stmtGetOne = db.prepare('SELECT value FROM store WHERE dataset = ? AND key = ?')
const stmtUpsert = db.prepare(
  'INSERT INTO store (dataset, key, value) VALUES (?, ?, ?) ' +
  'ON CONFLICT(dataset, key) DO UPDATE SET value = excluded.value'
)
const stmtCount  = db.prepare('SELECT COUNT(*) AS n FROM store WHERE dataset = ?')

// ── Seed from JSON files if the dataset has no rows yet ──────────────────────
const DATASETS = ['financials', 'competitors', 'market']

for (const name of DATASETS) {
  const { n } = stmtCount.get(name)
  if (n === 0) {
    const jsonPath = join(DATA_DIR, `${name}.json`)
    if (existsSync(jsonPath)) {
      const obj = JSON.parse(readFileSync(jsonPath, 'utf8'))
      const insertMany = db.transaction((entries) => {
        for (const [key, val] of entries) {
          stmtUpsert.run(name, key, JSON.stringify(val))
        }
      })
      insertMany(Object.entries(obj))
      console.log(`  db: seeded "${name}" (${Object.keys(obj).length} keys)`)
    }
  }
}

// ── Public helpers ────────────────────────────────────────────────────────────

/** Return all keys for a dataset as a plain object. */
export function getDataset(dataset) {
  const rows = stmtGet.all(dataset)
  const out = {}
  for (const row of rows) out[row.key] = JSON.parse(row.value)
  return out
}

/** Return the value for a single key inside a dataset (or undefined). */
export function getKey(dataset, key) {
  const row = stmtGetOne.get(dataset, key)
  return row ? JSON.parse(row.value) : undefined
}

/** Upsert a single key inside a dataset. */
export function setKey(dataset, key, value) {
  stmtUpsert.run(dataset, key, JSON.stringify(value))
}

/** Replace all keys for a dataset with the provided object. */
export function setDataset(dataset, obj) {
  const replaceAll = db.transaction(() => {
    // Delete existing keys not in new object
    const existing = stmtGet.all(dataset).map(r => r.key)
    const newKeys = new Set(Object.keys(obj))
    const delStmt = db.prepare('DELETE FROM store WHERE dataset = ? AND key = ?')
    for (const k of existing) {
      if (!newKeys.has(k)) delStmt.run(dataset, k)
    }
    // Upsert all new keys
    for (const [key, val] of Object.entries(obj)) {
      stmtUpsert.run(dataset, key, JSON.stringify(val))
    }
  })
  replaceAll()
}
