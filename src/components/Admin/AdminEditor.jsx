import React, { useState, useEffect } from 'react'
import { Settings2, Save, RotateCcw, CheckCircle2, AlertTriangle, Code2, Table2 } from 'lucide-react'
import { useData } from '../../api/DataContext'

// Editable annual P&L tables — the most common thing management updates each quarter.
const TARGETS = [
  { id: 'tvAnnual',     label: 'TV Standalone (Annual)', dataset: 'financials', key: 'tvBusinessData',   path: 'annual', cols: ['period', 'revenue', 'opProfit', 'opm', 'pat', 'eps'] },
  { id: 'consAnnual',   label: 'Consolidated (Annual)',  dataset: 'financials', key: 'consolidatedData', path: 'annual', cols: ['period', 'revenue', 'opProfit', 'opm', 'pat', 'eps'] },
  { id: 'digiAnnual',   label: 'Digital (Annual)',       dataset: 'financials', key: 'convergenceData',  path: 'annual', cols: ['period', 'revenue', 'opProfit', 'pat'] },
  { id: 'tvQuarterly',  label: 'TV Standalone (Quarterly)', dataset: 'financials', key: 'tvBusinessData', path: 'quarterly', cols: ['period', 'revenue', 'opProfit', 'pat', 'eps'] },
  { id: 'adMarket',     label: 'Ad Market Trend',        dataset: 'market',     key: 'adMarketTrend',    path: null, cols: ['year', 'tvNews', 'digitalNews', 'total'] },
]

function Toast({ kind, msg }) {
  const styles = kind === 'ok'
    ? 'bg-green-500/15 border-green-500/40 text-green-300'
    : 'bg-red-500/15 border-red-500/40 text-red-300'
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${styles}`}>
      {kind === 'ok' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
      {msg}
    </div>
  )
}

export default function AdminEditor() {
  const { data, updateKey } = useData()
  const [targetId, setTargetId] = useState(TARGETS[0].id)
  const [mode, setMode] = useState('table')        // 'table' | 'json'
  const [rows, setRows] = useState([])
  const [jsonText, setJsonText] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const target = TARGETS.find(t => t.id === targetId)

  // Load current values into the editor whenever the target changes
  useEffect(() => {
    const root = data[target.dataset][target.key]
    const arr = target.path ? root[target.path] : root
    setRows(JSON.parse(JSON.stringify(arr)))
    setJsonText(JSON.stringify(root, null, 2))
    setToast(null)
  }, [targetId, data])   // eslint-disable-line react-hooks/exhaustive-deps

  const setCell = (rowIdx, col, raw) => {
    setRows(prev => {
      const next = [...prev]
      const isNumeric = col !== 'period' && col !== 'year'
      let v = raw
      if (isNumeric) v = raw === '' || raw === '-' ? raw : Number(raw)
      next[rowIdx] = { ...next[rowIdx], [col]: v }
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    setToast(null)
    try {
      let valueToSave
      if (mode === 'json') {
        valueToSave = JSON.parse(jsonText)
      } else {
        // Merge edited array back into the full key object
        const root = JSON.parse(JSON.stringify(data[target.dataset][target.key]))
        if (target.path) root[target.path] = rows
        valueToSave = target.path ? root : rows
      }
      await updateKey(target.dataset, target.key, valueToSave)
      setToast({ kind: 'ok', msg: 'Saved! Every chart on the dashboard now reflects this.' })
    } catch (e) {
      setToast({ kind: 'err', msg: `Save failed: ${e.message}` })
    } finally {
      setSaving(false)
    }
  }

  const resetRow = () => {
    const root = data[target.dataset][target.key]
    const arr = target.path ? root[target.path] : root
    setRows(JSON.parse(JSON.stringify(arr)))
    setJsonText(JSON.stringify(root, null, 2))
    setToast(null)
  }

  return (
    <div className="space-y-5 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Settings2 size={20} /> Data Editor (Admin)</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Edit the live numbers. Changes save to the backend API and instantly update every chart — no rebuild needed.
        </p>
      </div>

      {/* Target + mode selectors */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={targetId}
          onChange={e => setTargetId(e.target.value)}
          className="bg-ndtv-card border border-ndtv-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-ndtv-red/60"
        >
          {TARGETS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>

        <div className="flex gap-1 bg-ndtv-card border border-ndtv-border rounded-lg p-1">
          <button onClick={() => setMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${mode === 'table' ? 'bg-ndtv-red text-white' : 'text-gray-400 hover:text-white'}`}>
            <Table2 size={13} /> Table
          </button>
          <button onClick={() => setMode('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${mode === 'json' ? 'bg-ndtv-red text-white' : 'text-gray-400 hover:text-white'}`}>
            <Code2 size={13} /> Raw JSON
          </button>
        </div>

        <div className="flex-1" />

        <button onClick={resetRow}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-ndtv-border text-gray-300 hover:bg-ndtv-border/40 transition">
          <RotateCcw size={13} /> Reset
        </button>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-ndtv-red hover:bg-red-600 disabled:opacity-50 transition">
          <Save size={13} /> {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {toast && <Toast kind={toast.kind} msg={toast.msg} />}

      {/* Table editor */}
      {mode === 'table' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                {target.cols.map(c => (
                  <th key={c} className="text-left py-2 px-3 capitalize">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ndtv-border/50">
              {rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-ndtv-border/20">
                  {target.cols.map(col => (
                    <td key={col} className="py-1.5 px-3">
                      <input
                        value={row[col] ?? ''}
                        onChange={e => setCell(ri, col, e.target.value)}
                        className={`w-full bg-ndtv-dark border border-ndtv-border rounded px-2 py-1 text-xs focus:outline-none focus:border-ndtv-red/60 ${
                          col === 'period' || col === 'year' ? 'text-white font-medium w-20' : 'text-right'
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-3">
            Tip: change any value (e.g. a revenue figure), click <span className="text-ndtv-red">Save changes</span>, then open the
            Overview or TV Business page — the charts and tables will show your new number immediately.
          </p>
        </div>
      )}

      {/* Raw JSON editor */}
      {mode === 'json' && (
        <div className="card">
          <textarea
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            spellCheck={false}
            className="w-full h-[480px] bg-ndtv-dark border border-ndtv-border rounded-lg p-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-ndtv-red/60 resize-y"
          />
          <p className="text-xs text-gray-500 mt-2">
            Full object for <span className="text-white">{target.key}</span>. Edit carefully — must be valid JSON.
          </p>
        </div>
      )}
    </div>
  )
}
