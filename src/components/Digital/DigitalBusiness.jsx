import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend, ComposedChart
} from 'recharts'
import { Globe, TrendingUp, TrendingDown, Users, Eye } from 'lucide-react'
import { convergenceData } from '../../data/financials'

const TABS = ['Quarterly', 'Annual', 'Traffic Metrics', 'Revenue Mix']

export default function DigitalBusiness() {
  const [tab, setTab] = useState('Quarterly')
  const { quarterly, annual, kpis, trafficMetrics } = convergenceData

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Globe size={20} /> Digital / Convergence Business</h1>
          <p className="text-sm text-gray-400 mt-0.5">NDTV.com, NDTV Apps, Video Streaming, Events</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge-green">MAU: 235M+</span>
          <span className="badge-yellow">Path to Profit: Q4 FY25E</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Revenue Growth', value: kpis.revenueGrowth, positive: true },
          { label: 'MAU Growth', value: kpis.mauGrowth, positive: true },
          { label: 'MAU Base', value: kpis.mauBase, positive: true },
          { label: 'Digital Ad Growth', value: kpis.digitalAdGrowth, positive: true },
          { label: 'Profitability ETA', value: kpis.pathToProfitability },
        ].map(({ label, value, positive }) => (
          <div key={label} className="card text-center">
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className="text-lg font-bold">{value}</div>
            {positive !== undefined && (
              <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${positive ? 'text-green-400' : 'text-yellow-400'}`}>
                {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              </div>
            )}
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

      {tab === 'Quarterly' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Quarterly Revenue by Stream (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={quarterly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-30} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="digitalAd" name="Digital Ad" fill="#3b82f6" stackId="a" />
                <Bar dataKey="subscription" name="Subscription" fill="#8b5cf6" stackId="a" />
                <Bar dataKey="events" name="Events" fill="#06b6d4" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">EBITDA Trend — Path to Profitability</h2>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={quarterly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-30} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[3, 3, 0, 0]}
                  label={false}
                />
                <Line type="monotone" dataKey="pat" name="PAT" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Quarterly P&L — Digital Business (INR Crores)</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Quarter</th>
                  <th className="text-right px-3">Revenue</th>
                  <th className="text-right px-3">Digital Ad</th>
                  <th className="text-right px-3">Subscription</th>
                  <th className="text-right px-3">Events</th>
                  <th className="text-right px-3">EBITDA</th>
                  <th className="text-right px-3">PAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {quarterly.map(q => (
                  <tr key={q.period} className="hover:bg-ndtv-border/20">
                    <td className="py-2 pr-3 font-medium">{q.period}</td>
                    <td className="text-right px-3">{q.revenue}</td>
                    <td className="text-right px-3">{q.digitalAd}</td>
                    <td className="text-right px-3">{q.subscription}</td>
                    <td className="text-right px-3">{q.events}</td>
                    <td className={`text-right px-3 font-medium ${q.ebitda >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {q.ebitda < 0 ? `(${Math.abs(q.ebitda)})` : q.ebitda}
                    </td>
                    <td className={`text-right px-3 ${q.pat >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {q.pat < 0 ? `(${Math.abs(q.pat)})` : q.pat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Annual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Annual Revenue Growth (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={annual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="digitalAd" name="Digital Ad" stroke="#3b82f6" fill="#3b82f630" strokeWidth={2} stackId="a" />
                <Area type="monotone" dataKey="subscription" name="Subscription" stroke="#8b5cf6" fill="#8b5cf630" strokeWidth={2} stackId="a" />
                <Area type="monotone" dataKey="events" name="Events" stroke="#06b6d4" fill="#06b6d430" strokeWidth={2} stackId="a" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">EBITDA & PAT Journey (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={annual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="pat" name="PAT" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Annual P&L — Digital / Convergence (INR Crores)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-4">Year</th>
                  <th className="text-right px-3">Revenue</th>
                  <th className="text-right px-3">Digital Ad</th>
                  <th className="text-right px-3">Subscription</th>
                  <th className="text-right px-3">Events</th>
                  <th className="text-right px-3">EBITDA</th>
                  <th className="text-right px-3">PAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {annual.map(a => (
                  <tr key={a.period} className="hover:bg-ndtv-border/20">
                    <td className="py-2.5 pr-4 font-semibold">{a.period}</td>
                    <td className="text-right px-3">{a.revenue}</td>
                    <td className="text-right px-3">{a.digitalAd}</td>
                    <td className="text-right px-3">{a.subscription}</td>
                    <td className="text-right px-3">{a.events}</td>
                    <td className={`text-right px-3 font-medium ${a.ebitda >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {a.ebitda < 0 ? `(${Math.abs(a.ebitda)})` : a.ebitda}
                    </td>
                    <td className={`text-right px-3 ${a.pat >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {a.pat < 0 ? `(${Math.abs(a.pat)})` : a.pat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="mau" name="MAU (Mn)" stroke="#3b82f6" fill="#3b82f630" strokeWidth={2.5} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Page Views & Video Views (Millions)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trafficMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="pageViews" name="Page Views (Mn)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="videoViews" name="Video Views (Mn)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-sm mb-3">Traffic Summary Table</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2">Month</th>
                  <th className="text-right px-3">MAU (Mn)</th>
                  <th className="text-right px-3">Page Views (Mn)</th>
                  <th className="text-right px-3">Video Views (Mn)</th>
                  <th className="text-right px-3">Vid/PV Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {trafficMetrics.map(m => (
                  <tr key={m.month} className="hover:bg-ndtv-border/20">
                    <td className="py-2.5 font-medium">{m.month}</td>
                    <td className="text-right px-3">{m.mau}</td>
                    <td className="text-right px-3">{m.pageViews.toLocaleString()}</td>
                    <td className="text-right px-3">{m.videoViews}</td>
                    <td className="text-right px-3 text-gray-400">{((m.videoViews / m.pageViews) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Revenue Mix' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-4">Revenue Mix FY24 (₹303 Cr)</h2>
            <div className="space-y-4">
              {[
                { label: 'Digital Advertising', value: 217, pct: 71.6, color: 'bg-blue-500' },
                { label: 'Subscriptions', value: 58, pct: 19.1, color: 'bg-purple-500' },
                { label: 'Events & Others', value: 28, pct: 9.2, color: 'bg-cyan-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="font-medium">₹{item.value} Cr ({item.pct}%)</span>
                  </div>
                  <div className="h-2.5 bg-ndtv-border rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-4">Key Digital Metrics</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'App Downloads', value: '82M+', icon: '📱' },
                { label: 'YouTube Subscribers', value: '14.2M', icon: '▶️' },
                { label: 'Avg Session Duration', value: '4m 32s', icon: '⏱️' },
                { label: 'Mobile Traffic Share', value: '78%', icon: '📊' },
                { label: 'Languages', value: '12', icon: '🌐' },
                { label: 'Daily Unique Visitors', value: '18M+', icon: '👥' },
              ].map(item => (
                <div key={item.label} className="bg-ndtv-border/30 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="font-bold text-base">{item.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
