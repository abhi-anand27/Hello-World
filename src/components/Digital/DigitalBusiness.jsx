import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend, ReferenceLine
} from 'recharts'
import { Globe, TrendingUp, TrendingDown } from 'lucide-react'
import { useData } from '../../api/DataContext'

const TABS = ['Annual', 'Traffic Metrics']

function val(v) {
  if (v === null || v === undefined) return '—'
  return v < 0 ? `(${Math.abs(v)})` : v
}
function valColor(v) {
  if (v === null || v === undefined) return 'text-gray-400'
  return v < 0 ? 'text-red-400' : 'text-green-400'
}

export default function DigitalBusiness() {
  const [tab, setTab] = useState('Annual')
  const { data } = useData()
  const { annual, kpis, trafficMetrics } = data.financials.convergenceData

  const latestAnnual = annual[annual.length - 1]  // FY26
  const prevAnnual   = annual[annual.length - 2]  // FY25
  const revGrowth = (((latestAnnual.revenue - prevAnnual.revenue) / prevAnnual.revenue) * 100).toFixed(1)

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
          { label: 'FY26 Revenue',    value: `₹${latestAnnual.revenue} Cr`,  color: 'text-white' },
          { label: 'FY26 Op. Profit', value: `₹${val(latestAnnual.opProfit)} Cr`, color: valColor(latestAnnual.opProfit) },
          { label: 'FY26 PAT',        value: `₹${val(latestAnnual.pat)} Cr`, color: valColor(latestAnnual.pat) },
          { label: 'MAU Growth',      value: kpis.mauGrowth,                 color: 'text-green-400' },
        ].map(k => (
          <div key={k.label} className="card text-center">
            <div className="text-xs text-gray-400 mb-1">{k.label}</div>
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-ndtv-card border border-ndtv-border rounded-lg p-1 w-fit">
        {TABS.map(t => (
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

      {tab === 'Annual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Annual Revenue (INR Cr) — FY21–FY26</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={annual} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
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
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="opProfit" name="Op. Profit" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="pat"      name="PAT"        stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Annual table */}
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Annual P&L — Digital Convergence (INR Crores)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-4">Year</th>
                  <th className="text-right px-3">Revenue</th>
                  <th className="text-right px-3">Op. Profit</th>
                  <th className="text-right px-3">PAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {annual.map(a => (
                  <tr key={a.period} className={`hover:bg-ndtv-border/20 ${a.period === 'FY26' ? 'bg-blue-500/5 font-semibold' : ''}`}>
                    <td className="py-2.5 pr-4 font-semibold">{a.period}</td>
                    <td className="text-right px-3">{a.revenue}</td>
                    <td className={`text-right px-3 ${valColor(a.opProfit)}`}>{val(a.opProfit)}</td>
                    <td className={`text-right px-3 ${valColor(a.pat)}`}>{val(a.pat)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">Derived as Consolidated minus Standalone TV (BSE filings). Parentheses = losses.</p>
          </div>
        </div>
      )}

      {tab === 'Traffic Metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Monthly Active Users (Millions)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trafficMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-20} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[180, 250]} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="mau" name="MAU (Mn)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Page Views & Video Views (Millions)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trafficMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-20} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="pageViews"  name="Page Views (Mn)"  stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="videoViews" name="Video Views (Mn)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Monthly Traffic Data</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Month</th>
                  <th className="text-right px-3">MAU (Mn)</th>
                  <th className="text-right px-3">Page Views (Mn)</th>
                  <th className="text-right px-3">Video Views (Mn)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {trafficMetrics.map(m => (
                  <tr key={m.month} className="hover:bg-ndtv-border/20">
                    <td className="py-2 pr-3 font-medium">{m.month}</td>
                    <td className="text-right px-3 text-blue-400">{m.mau}</td>
                    <td className="text-right px-3">{m.pageViews}</td>
                    <td className="text-right px-3">{m.videoViews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">Source: Industry estimates (BARC/Nielsen digital measurement). {kpis.note}</p>
          </div>
        </div>
      )}
    </div>
  )
}
