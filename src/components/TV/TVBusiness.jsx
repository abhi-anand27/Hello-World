import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ComposedChart, Area
} from 'recharts'
import { TrendingUp, TrendingDown, Tv, DollarSign, BarChart2 } from 'lucide-react'
import { tvBusinessData } from '../../data/financials'

const TAB_OPTIONS = ['Quarterly', 'Annual', 'Revenue Mix', 'P&L Detail']

function MetricBadge({ label, value, positive }) {
  return (
    <div className="card text-center">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-lg font-bold">{value}</div>
      {positive !== undefined && (
        <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          <span>YoY</span>
        </div>
      )}
    </div>
  )
}

export default function TVBusiness() {
  const [tab, setTab] = useState('Quarterly')
  const quarterly = tvBusinessData.quarterly
  const annual = tvBusinessData.annual
  const kpis = tvBusinessData.kpis

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Tv size={20} /> TV Business</h1>
          <p className="text-sm text-gray-400 mt-0.5">NDTV 24x7, NDTV India, NDTV Profit</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-green">FY24: ₹670 Cr</span>
          <span className="badge-green">Margin: 16.1%</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricBadge label="Revenue Growth" value={kpis.revenueGrowth} positive />
        <MetricBadge label="EBITDA Growth" value={kpis.ebitdaGrowth} positive />
        <MetricBadge label="PAT Growth" value={kpis.patGrowth} positive />
        <MetricBadge label="EBITDA Margin" value={kpis.ebitdaMargin} positive />
        <MetricBadge label="Ad Rev Share" value={kpis.adRevShare} />
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
              <ComposedChart data={quarterly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-30} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="adRevenue" name="Ad Revenue" fill="#E8001D" stackId="a" />
                <Bar dataKey="subRevenue" name="Subscription" fill="#f97316" stackId="a" radius={[3, 3, 0, 0]} />
                <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="#10b981" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">PAT & EBITDA Trend (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={quarterly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-30} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pat" name="PAT" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quarterly table */}
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Quarterly P&L (INR Crores)</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Quarter</th>
                  <th className="text-right px-3">Revenue</th>
                  <th className="text-right px-3">Ad Rev</th>
                  <th className="text-right px-3">Sub Rev</th>
                  <th className="text-right px-3">EBITDA</th>
                  <th className="text-right px-3">EBITDA%</th>
                  <th className="text-right px-3">PAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {quarterly.map(q => (
                  <tr key={q.period} className="hover:bg-ndtv-border/20">
                    <td className="py-2 pr-3 font-medium">{q.period}</td>
                    <td className="text-right px-3">{q.revenue}</td>
                    <td className="text-right px-3">{q.adRevenue}</td>
                    <td className="text-right px-3">{q.subRevenue}</td>
                    <td className="text-right px-3 text-green-400">{q.ebitda}</td>
                    <td className="text-right px-3 text-gray-400">{((q.ebitda / q.revenue) * 100).toFixed(1)}%</td>
                    <td className="text-right px-3 text-blue-400">{q.pat}</td>
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
            <h2 className="font-semibold text-sm mb-3">Annual Revenue & EBITDA (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={annual} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="revenue" name="Revenue" fill="#E8001D" radius={[3, 3, 0, 0]} />
                <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="pat" name="PAT" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">EBITDA Margin Trend (%)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={annual}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 25]} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="margin" name="EBITDA Margin %" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Annual P&L (INR Crores)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-4">Year</th>
                  <th className="text-right px-3">Revenue</th>
                  <th className="text-right px-3">Ad Revenue</th>
                  <th className="text-right px-3">Sub Revenue</th>
                  <th className="text-right px-3">EBITDA</th>
                  <th className="text-right px-3">EBITDA%</th>
                  <th className="text-right px-3">PAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {annual.map(a => (
                  <tr key={a.period} className="hover:bg-ndtv-border/20">
                    <td className="py-2.5 pr-4 font-semibold">{a.period}</td>
                    <td className="text-right px-3">{a.revenue}</td>
                    <td className="text-right px-3">{a.adRevenue}</td>
                    <td className="text-right px-3">{a.subRevenue}</td>
                    <td className="text-right px-3 text-green-400">{a.ebitda}</td>
                    <td className="text-right px-3 text-yellow-400">{a.margin}%</td>
                    <td className="text-right px-3 text-blue-400">{a.pat}</td>
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
            <h2 className="font-semibold text-sm mb-3">Ad vs Subscription Revenue (Annual, INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={annual} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="adRevenue" name="Ad Revenue" fill="#E8001D" stackId="a" />
                <Bar dataKey="subRevenue" name="Subscription" fill="#f97316" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="font-semibold text-sm mb-4">Revenue Mix Breakdown (FY24)</div>
            <div className="space-y-3">
              {[
                { label: 'Advertising Revenue', value: 547, pct: '81.6%', color: 'bg-ndtv-red' },
                { label: 'Subscription Revenue', value: 123, pct: '18.4%', color: 'bg-orange-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="font-medium">₹{item.value} Cr ({item.pct})</span>
                  </div>
                  <div className="h-2 bg-ndtv-border rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-ndtv-border grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-gray-400">Total Channels</div>
                <div className="font-bold text-lg mt-1">3</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Languages</div>
                <div className="font-bold text-lg mt-1">2</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Avg CPM (₹)</div>
                <div className="font-bold text-lg mt-1">150-200</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'P&L Detail' && (
        <div className="card overflow-x-auto">
          <h2 className="font-semibold text-sm mb-4">Detailed Annual P&L — TV Business (INR Crores)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                <th className="text-left py-2 pr-4 font-medium">Line Item</th>
                {annual.map(a => <th key={a.period} className="text-right px-3 py-2">{a.period}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-ndtv-border/40 text-sm">
              {[
                { label: 'Total Revenue', fn: a => a.revenue, bold: true },
                { label: '  Advertising Revenue', fn: a => a.adRevenue },
                { label: '  Subscription Revenue', fn: a => a.subRevenue },
                { label: 'EBITDA', fn: a => a.ebitda, color: 'text-green-400' },
                { label: 'EBITDA Margin', fn: a => `${a.margin}%`, color: 'text-yellow-400' },
                { label: 'PAT', fn: a => a.pat, color: 'text-blue-400' },
              ].map(row => (
                <tr key={row.label} className="hover:bg-ndtv-border/20">
                  <td className={`py-2.5 pr-4 ${row.bold ? 'font-semibold' : 'text-gray-300'}`}>{row.label}</td>
                  {annual.map(a => (
                    <td key={a.period} className={`text-right px-3 py-2.5 ${row.color || ''} ${row.bold ? 'font-semibold' : ''}`}>
                      {typeof row.fn(a) === 'string' ? row.fn(a) : row.fn(a)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
