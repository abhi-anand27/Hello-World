import React, { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend, ReferenceLine
} from 'recharts'
import { Globe, TrendingUp, TrendingDown, Save, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useData } from '../../api/DataContext'

const TABS = ['Annual', 'P&L Detail', 'Revenue Breakup', 'Data Editor']

const TT = { background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }

// Estimated digital revenue components (derived from segment reporting)
const REVENUE_ROWS = [
  { key: 'display',     label: 'Display Advertising', color: '#E8001D' },
  { key: 'video',       label: 'Video / OTT',          color: '#3b82f6' },
  { key: 'social',      label: 'Social & Influencer',  color: '#f59e0b' },
  { key: 'events',      label: 'Events & IP',          color: '#10b981' },
  { key: 'syndication', label: 'Syndication & Others', color: '#8b5cf6' },
]

// Estimated revenue component split (% of total digital revenue per year)
const REV_SPLIT = {
  FY21: { display: 68, video: 14, social: 5,  events: 8,  syndication: 5 },
  FY22: { display: 64, video: 17, social: 7,  events: 7,  syndication: 5 },
  FY23: { display: 60, video: 20, social: 9,  events: 6,  syndication: 5 },
  FY24: { display: 55, video: 24, social: 10, events: 7,  syndication: 4 },
  FY25: { display: 52, video: 27, social: 11, events: 6,  syndication: 4 },
  FY26: { display: 50, video: 30, social: 11, events: 6,  syndication: 3 },
}

function val(v) {
  if (v === null || v === undefined) return '—'
  return v < 0 ? `(${Math.abs(v)})` : v
}
function valColor(v) {
  if (v === null || v === undefined) return 'text-gray-400'
  return v < 0 ? 'text-red-400' : 'text-green-400'
}

function Toast({ kind, msg }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
      kind === 'ok'
        ? 'bg-green-500/15 border-green-500/40 text-green-300'
        : 'bg-red-500/15 border-red-500/40 text-red-300'
    }`}>
      {kind === 'ok' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
      {msg}
    </div>
  )
}

export default function DigitalBusiness() {
  const [tab, setTab] = useState('Annual')
  const { data } = useData()
  const { annual, kpis } = data.financials.convergenceData

  const latestAnnual = annual[annual.length - 1]
  const prevAnnual   = annual[annual.length - 2]
  const revGrowth = (((latestAnnual.revenue - prevAnnual.revenue) / prevAnnual.revenue) * 100).toFixed(1)

  // Revenue breakup data — apply split % to actuals
  const revBreakup = annual.map(a => {
    const split = REV_SPLIT[a.period] || REV_SPLIT['FY26']
    const row = { period: a.period }
    REVENUE_ROWS.forEach(r => { row[r.key] = +(a.revenue * split[r.key] / 100).toFixed(1) })
    return row
  })

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Globe size={20} /> Digital / Convergence Business</h1>
          <p className="text-sm text-gray-400 mt-0.5">NDTV.com · NDTV Apps · Video · Events — Derived: Consolidated minus Standalone TV</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-1 rounded">MAU: {kpis.mauBase}</span>
          <span className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-1 rounded">YT: {kpis.youtubeSubscribers}</span>
          <span className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-1 rounded">Rank {kpis.digitalRank} news portal</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: `FY${latestAnnual.period.slice(2)} Revenue`,    value: `₹${latestAnnual.revenue} Cr`, color: 'text-white' },
          { label: `FY${latestAnnual.period.slice(2)} Op. Profit`, value: `₹${val(latestAnnual.opProfit)} Cr`, color: valColor(latestAnnual.opProfit) },
          { label: `FY${latestAnnual.period.slice(2)} PAT`,        value: `₹${val(latestAnnual.pat)} Cr`, color: valColor(latestAnnual.pat) },
          { label: 'Revenue Growth',                               value: `${revGrowth >= 0 ? '+' : ''}${revGrowth}%`, color: revGrowth >= 0 ? 'text-green-400' : 'text-red-400' },
        ].map(k => (
          <div key={k.label} className="card text-center">
            <div className="text-xs text-gray-400 mb-1">{k.label}</div>
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-ndtv-card border border-ndtv-border rounded-lg p-1 w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === t ? 'tab-active' : 'tab-inactive'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Annual' && <AnnualTab annual={annual} />}
      {tab === 'P&L Detail' && <PLDetailTab annual={annual} />}
      {tab === 'Revenue Breakup' && <RevBreakupTab annual={annual} revBreakup={revBreakup} />}
      {tab === 'Data Editor' && <DataEditorTab />}
    </div>
  )
}

/* ── Annual ─────────────────────────────────────────────────────── */
function AnnualTab({ annual }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card">
        <h2 className="font-semibold text-sm mb-3">Annual Revenue (INR Cr)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={annual} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip contentStyle={TT} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="revenue"  name="Revenue"    fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="opProfit" name="Op. Profit" fill="#10b981" radius={[3, 3, 0, 0]} />
            <Bar dataKey="pat"      name="PAT"        fill="#8b5cf6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h2 className="font-semibold text-sm mb-3">Op. Profit & PAT Trend (INR Cr)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={annual}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <ReferenceLine y={0} stroke="#555" strokeDasharray="4 2" />
            <Tooltip contentStyle={TT} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="opProfit" name="Op. Profit" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="pat"      name="PAT"        stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── P&L Detail ─────────────────────────────────────────────────── */
function PLDetailTab({ annual }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="card overflow-x-auto">
        <h2 className="font-semibold text-sm mb-3">Annual P&L — Digital / Convergence (INR Crores)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-ndtv-border">
              <th className="text-left py-2 pr-4">Metric</th>
              {annual.map(a => (
                <th key={a.period} className={`text-right px-3 ${a.period === annual[annual.length - 1].period ? 'text-ndtv-red' : ''}`}>{a.period}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ndtv-border/50">
            {[
              { label: 'Revenue (Cr)',     key: 'revenue',  fmt: v => v },
              { label: 'Op. Profit (Cr)',  key: 'opProfit', fmt: v => v < 0 ? `(${Math.abs(v)})` : v },
              { label: 'OPM %',            key: 'opm',      fmt: v => `${v ?? '—'}%` },
              { label: 'PAT (Cr)',         key: 'pat',      fmt: v => v < 0 ? `(${Math.abs(v)})` : v },
            ].map(({ label, key, fmt }) => (
              <tr key={key} className="hover:bg-ndtv-border/20">
                <td className="py-2.5 pr-4 font-medium text-gray-300">{label}</td>
                {annual.map(a => (
                  <td key={a.period} className={`text-right px-3 py-2.5 font-medium ${
                    a[key] < 0 ? 'text-red-400' : key === 'revenue' ? 'text-white' : 'text-green-400'
                  } ${a.period === annual[annual.length - 1].period ? 'font-bold' : ''}`}>
                    {fmt(a[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">Derived as Consolidated minus Standalone TV (BSE filings). Parentheses = losses.</p>
      </div>

      {/* YoY growth table */}
      <div className="card overflow-x-auto">
        <h2 className="font-semibold text-sm mb-3">YoY Growth (%)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-ndtv-border">
              <th className="text-left py-2 pr-4">Metric</th>
              {annual.slice(1).map(a => (
                <th key={a.period} className={`text-right px-3 ${a.period === annual[annual.length - 1].period ? 'text-ndtv-red' : ''}`}>{a.period}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ndtv-border/50">
            {['revenue', 'opProfit', 'pat'].map(key => (
              <tr key={key} className="hover:bg-ndtv-border/20">
                <td className="py-2.5 pr-4 font-medium text-gray-300 capitalize">{key === 'opProfit' ? 'Op. Profit' : key === 'pat' ? 'PAT' : 'Revenue'}</td>
                {annual.slice(1).map((a, i) => {
                  const prev = annual[i][key]
                  const curr = a[key]
                  const g = prev && prev !== 0 ? (((curr - prev) / Math.abs(prev)) * 100).toFixed(1) : null
                  return (
                    <td key={a.period} className={`text-right px-3 py-2.5 font-medium ${g === null ? 'text-gray-500' : g >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {g !== null ? `${g >= 0 ? '+' : ''}${g}%` : '—'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Revenue Breakup ────────────────────────────────────────────── */
function RevBreakupTab({ annual, revBreakup }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card lg:col-span-2">
        <h2 className="font-semibold text-sm mb-3">Revenue Breakup by Segment (INR Cr, estimated)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revBreakup} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip contentStyle={TT} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {REVENUE_ROWS.map(r => (
              <Bar key={r.key} dataKey={r.key} name={r.label} fill={r.color} stackId="a" radius={r.key === 'syndication' ? [3, 3, 0, 0] : undefined} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2">Segment split is management estimate based on disclosed revenue mix commentary. Total matches reported digital P&L.</p>
      </div>

      {/* Latest year pie-style table */}
      <div className="card">
        <h2 className="font-semibold text-sm mb-3">Revenue Mix — {annual[annual.length - 1].period}</h2>
        <div className="space-y-2">
          {REVENUE_ROWS.map(r => {
            const latest = revBreakup[revBreakup.length - 1]
            const total  = annual[annual.length - 1].revenue
            const pct    = total ? ((latest[r.key] / total) * 100).toFixed(1) : 0
            return (
              <div key={r.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{r.label}</span>
                  <span className="font-medium">₹{latest[r.key]} Cr <span className="text-gray-500">({pct}%)</span></span>
                </div>
                <div className="h-1.5 bg-ndtv-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: r.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Trend — display vs video */}
      <div className="card">
        <h2 className="font-semibold text-sm mb-3">Display vs Video Revenue Trend (INR Cr)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={revBreakup}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip contentStyle={TT} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="display" name="Display Ads" stroke="#E8001D" fill="#E8001D30" strokeWidth={2} />
            <Area type="monotone" dataKey="video"   name="Video / OTT" stroke="#3b82f6" fill="#3b82f630" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── Data Editor ────────────────────────────────────────────────── */
const EDIT_COLS = ['period', 'revenue', 'opProfit', 'pat']

function DataEditorTab() {
  const { data, updateKey } = useData()
  const [rows, setRows]   = useState([])
  const [saving, setSaving] = useState(false)
  const [toast, setToast]  = useState(null)

  useEffect(() => {
    setRows(JSON.parse(JSON.stringify(data.financials.convergenceData.annual)))
    setToast(null)
  }, [data])

  const setCell = (rowIdx, col, raw) => {
    setRows(prev => {
      const next = [...prev]
      const v = col === 'period' ? raw : (raw === '' || raw === '-' ? raw : Number(raw))
      next[rowIdx] = { ...next[rowIdx], [col]: v }
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    setToast(null)
    try {
      const root = JSON.parse(JSON.stringify(data.financials.convergenceData))
      root.annual = rows
      await updateKey('financials', 'convergenceData', root)
      setToast({ kind: 'ok', msg: 'Saved — all Digital charts updated.' })
    } catch (e) {
      setToast({ kind: 'err', msg: `Save failed: ${e.message}` })
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    setRows(JSON.parse(JSON.stringify(data.financials.convergenceData.annual)))
    setToast(null)
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-semibold text-sm">Edit Digital Annual P&L (INR Crores)</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {toast && <Toast kind={toast.kind} msg={toast.msg} />}
            <button onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-ndtv-border text-gray-400 hover:text-white transition-colors">
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={save} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs bg-ndtv-red hover:bg-red-600 font-medium transition-colors disabled:opacity-50">
              <Save size={12} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                {EDIT_COLS.map(c => (
                  <th key={c} className="text-left py-2 px-3 font-medium">
                    {c === 'opProfit' ? 'Op. Profit' : c === 'pat' ? 'PAT' : c === 'period' ? 'Year' : c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ndtv-border/50">
              {rows.map((row, ri) => (
                <tr key={ri} className={ri === rows.length - 1 ? 'bg-blue-500/5' : ''}>
                  {EDIT_COLS.map(col => (
                    <td key={col} className="px-3 py-1.5">
                      <input
                        value={row[col] ?? ''}
                        onChange={e => setCell(ri, col, e.target.value)}
                        className="w-full bg-ndtv-dark border border-ndtv-border/60 rounded px-2 py-1 text-xs text-white focus:border-ndtv-red outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">Parentheses not needed — enter negative numbers directly (e.g. -12). Changes reflect immediately across all Digital charts.</p>
      </div>
    </div>
  )
}
