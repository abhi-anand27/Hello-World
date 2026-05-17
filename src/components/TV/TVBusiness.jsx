import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ReferenceLine
} from 'recharts'
import { TrendingUp, TrendingDown, Tv } from 'lucide-react'
import { tvBusinessData } from '../../data/financials'

const TAB_OPTIONS = ['Quarterly', 'Annual', 'P&L Detail']

function val(v) {
  if (v === null || v === undefined) return '—'
  return v < 0 ? `(${Math.abs(v)})` : v
}
function valColor(v) {
  if (v === null || v === undefined) return 'text-gray-400'
  return v < 0 ? 'text-red-400' : 'text-green-400'
}

export default function TVBusiness() {
  const [tab, setTab] = useState('Quarterly')
  const quarterly = tvBusinessData.quarterly
  const annual    = tvBusinessData.annual
  const kpis      = tvBusinessData.kpis

  const latestAnnual = annual[annual.length - 1]    // FY26
  const prevAnnual   = annual[annual.length - 2]    // FY25

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Tv size={20} /> TV Business (Standalone)</h1>
          <p className="text-sm text-gray-400 mt-0.5">NDTV 24x7 · NDTV India · NDTV Profit — BSE Standalone P&L</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-ndtv-card border border-ndtv-border px-2 py-1 rounded">FY25 Revenue: ₹{prevAnnual.revenue} Cr</span>
          <span className="text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-1 rounded">FY26 Revenue: ₹{latestAnnual.revenue} Cr</span>
          <span className="text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-1 rounded">OPM: {latestAnnual.opm}%</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'FY26 Revenue',    value: `₹${latestAnnual.revenue} Cr`,   color: 'text-white' },
          { label: 'FY26 Op. Profit', value: `₹${latestAnnual.opProfit} Cr`,  color: 'text-red-400' },
          { label: 'FY26 PAT',        value: `₹${latestAnnual.pat} Cr`,        color: 'text-red-400' },
          { label: 'FY26 EPS',        value: `₹${latestAnnual.eps}`,           color: 'text-red-400' },
        ].map(k => (
          <div key={k.label} className="card text-center">
            <div className="text-xs text-gray-400 mb-1">{k.label}</div>
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 bg-ndtv-card border border-ndtv-border rounded-lg p-1 w-fit">
        {TAB_OPTIONS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === t ? 'tab-active' : 'tab-inactive'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Quarterly' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Quarterly Revenue (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={quarterly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-30} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" name="Revenue (Cr)" fill="#E8001D" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Quarterly Op. Profit & PAT (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={quarterly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-30} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <ReferenceLine y={0} stroke="#555" strokeDasharray="4 2" />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="opProfit" name="Op. Profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pat"      name="PAT"        stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quarterly table */}
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Quarterly P&L — TV Standalone (INR Crores)</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Quarter</th>
                  <th className="text-right px-3">Revenue</th>
                  <th className="text-right px-3">Op. Profit</th>
                  <th className="text-right px-3">OPM %</th>
                  <th className="text-right px-3">PAT</th>
                  <th className="text-right px-3">EPS (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {quarterly.map(q => (
                  <tr key={q.period} className="hover:bg-ndtv-border/20">
                    <td className="py-2 pr-3 font-medium">{q.period}</td>
                    <td className="text-right px-3">{q.revenue}</td>
                    <td className={`text-right px-3 ${valColor(q.opProfit)}`}>{val(q.opProfit)}</td>
                    <td className={`text-right px-3 ${valColor(q.opm)}`}>{q.opm !== null ? `${q.opm}%` : '—'}</td>
                    <td className={`text-right px-3 ${valColor(q.pat)}`}>{val(q.pat)}</td>
                    <td className={`text-right px-3 ${valColor(q.eps)}`}>{q.eps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">Source: BSE filings via finology.in. Parentheses denote losses.</p>
          </div>
        </div>
      )}

      {tab === 'Annual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Annual Revenue (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={annual} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="revenue"  name="Revenue"     fill="#E8001D" radius={[3, 3, 0, 0]} />
                <Bar dataKey="opProfit" name="Op. Profit"  fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="pat"      name="PAT"         fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">OPM Trend (%) — FY21–FY26</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={annual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <ReferenceLine y={0} stroke="#555" strokeDasharray="4 2" />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }}
                  formatter={v => [`${v}%`, 'OPM']} />
                <Line type="monotone" dataKey="opm" name="OPM %" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Annual P&L — TV Standalone (INR Crores)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-4">Year</th>
                  <th className="text-right px-3">Revenue</th>
                  <th className="text-right px-3">Op. Profit</th>
                  <th className="text-right px-3">OPM %</th>
                  <th className="text-right px-3">PAT</th>
                  <th className="text-right px-3">EPS (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {annual.map(a => (
                  <tr key={a.period} className={`hover:bg-ndtv-border/20 ${a.period === 'FY26' ? 'bg-ndtv-red/5 font-semibold' : ''}`}>
                    <td className="py-2.5 pr-4 font-semibold">{a.period}</td>
                    <td className="text-right px-3">{a.revenue}</td>
                    <td className={`text-right px-3 ${valColor(a.opProfit)}`}>{val(a.opProfit)}</td>
                    <td className={`text-right px-3 ${valColor(a.opm)}`}>{a.opm}%</td>
                    <td className={`text-right px-3 ${valColor(a.pat)}`}>{val(a.pat)}</td>
                    <td className={`text-right px-3 ${valColor(a.eps)}`}>{a.eps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">Source: BSE filings via finology.in. Parentheses = losses. FY26 = Apr 25 – Mar 26.</p>
          </div>
        </div>
      )}

      {tab === 'P&L Detail' && (
        <div className="card overflow-x-auto">
          <h2 className="font-semibold text-sm mb-4">Full P&L — TV Business Standalone (INR Crores) | FY21–FY26</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                <th className="text-left py-2 pr-4 font-medium">Line Item</th>
                {annual.map(a => (
                  <th key={a.period} className={`text-right px-3 py-2 ${a.period === 'FY26' ? 'text-ndtv-red' : ''}`}>{a.period}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ndtv-border/40 text-sm">
              {[
                { label: 'Revenue',      key: 'revenue',  bold: true, color: '' },
                { label: 'Op. Profit',   key: 'opProfit', bold: false, color: 'auto' },
                { label: 'OPM %',        key: 'opm',      bold: false, color: 'auto', suffix: '%' },
                { label: 'PAT',          key: 'pat',      bold: false, color: 'auto' },
                { label: 'EPS (₹)',      key: 'eps',      bold: false, color: 'auto' },
              ].map(row => (
                <tr key={row.label} className="hover:bg-ndtv-border/20">
                  <td className={`py-2.5 pr-4 ${row.bold ? 'font-semibold' : 'text-gray-300'}`}>{row.label}</td>
                  {annual.map(a => {
                    const v = a[row.key]
                    const cls = row.color === 'auto' ? valColor(v) : ''
                    const display = row.suffix
                      ? `${v}${row.suffix}`
                      : row.bold ? v : val(v)
                    return (
                      <td key={a.period} className={`text-right px-3 py-2.5 ${cls} ${row.bold ? 'font-semibold' : ''} ${a.period === 'FY26' ? 'font-bold' : ''}`}>
                        {display}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-3">Source: BSE filings via finology.in (same data as Moneycontrol). Parentheses denote losses.</p>
        </div>
      )}
    </div>
  )
}
