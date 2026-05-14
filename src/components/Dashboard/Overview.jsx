import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Tv, Globe, Users, Activity } from 'lucide-react'
import { consolidatedData, tvBusinessData, convergenceData } from '../../data/financials'

function KPICard({ title, value, change, positive, icon: Icon, sub }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${positive ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
          <Icon size={18} className={positive ? 'text-green-400' : 'text-red-400'} />
        </div>
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{change} vs last year</span>
      </div>
    </div>
  )
}

const COLORS = {
  tv: '#E8001D',
  digital: '#3b82f6',
  ebitda: '#10b981',
}

export default function Overview({ onNavigate }) {
  const consolidated = consolidatedData.annual

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold">Executive Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">Consolidated NDTV Group — FY24 Actuals, FY25 Q3 Latest</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Consolidated Revenue"
          value="₹973 Cr"
          change="+5.9%"
          positive
          icon={Activity}
          sub="FY24 Actuals"
        />
        <KPICard
          title="EBITDA"
          value="₹116 Cr"
          change="+26.1%"
          positive
          icon={TrendingUp}
          sub="Margin: 11.9%"
        />
        <KPICard
          title="TV Business Revenue"
          value="₹670 Cr"
          change="+4.2%"
          positive
          icon={Tv}
          sub="EBITDA margin: 16.1%"
        />
        <KPICard
          title="Digital MAU"
          value="235M+"
          change="+22%"
          positive
          icon={Globe}
          sub="Convergence biz"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Revenue Breakdown (Annual)</h2>
            <span className="text-xs text-gray-400">INR Crores</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={consolidated} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" name="Revenue" fill={COLORS.tv} radius={[4, 4, 0, 0]} />
              <Bar dataKey="ebitda" name="EBITDA" fill={COLORS.ebitda} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TV vs Digital revenue */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">TV vs Digital Revenue (Annual)</h2>
            <span className="text-xs text-gray-400">INR Crores</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={[
                { year: 'FY21', tv: 476, digital: 198 },
                { year: 'FY22', tv: 528, digital: 237 },
                { year: 'FY23', tv: 643, digital: 276 },
                { year: 'FY24', tv: 670, digital: 303 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="tv" name="TV" stroke={COLORS.tv} fill={COLORS.tv + '30'} strokeWidth={2} />
              <Area type="monotone" dataKey="digital" name="Digital" stroke={COLORS.digital} fill={COLORS.digital + '30'} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'tv', label: 'TV Business', desc: 'Q3 FY25 Revenue: ₹191 Cr', icon: Tv, color: 'border-ndtv-red/40 hover:border-ndtv-red' },
          { id: 'digital', label: 'Digital / Convergence', desc: 'Q3 FY25 Revenue: ₹88 Cr', icon: Globe, color: 'border-blue-500/40 hover:border-blue-500' },
          { id: 'competitors', label: 'Competitors', desc: '5 TV + 5 Digital players', icon: Users, color: 'border-yellow-500/40 hover:border-yellow-500' },
          { id: 'market', label: 'Market Status', desc: 'Ad market ₹10,400 Cr', icon: TrendingUp, color: 'border-green-500/40 hover:border-green-500' },
        ].map(({ id, label, desc, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`card border text-left transition-colors ${color}`}
          >
            <Icon size={20} className="text-gray-400 mb-2" />
            <div className="font-medium text-sm">{label}</div>
            <div className="text-xs text-gray-400 mt-1">{desc}</div>
          </button>
        ))}
      </div>

      {/* Summary table */}
      <div className="card">
        <h2 className="font-semibold text-sm mb-4">Consolidated P&L Summary (INR Crores)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                <th className="text-left py-2 pr-4">Metric</th>
                {consolidated.map(d => (
                  <th key={d.period} className="text-right py-2 px-3">{d.period}</th>
                ))}
                <th className="text-right py-2 px-3 text-ndtv-red">YoY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ndtv-border/50">
              {[
                { label: 'Total Revenue', key: 'revenue' },
                { label: 'EBITDA', key: 'ebitda' },
                { label: 'PAT', key: 'pat' },
                { label: 'Net Debt/(Cash)', key: 'netDebt' },
              ].map(({ label, key }) => (
                <tr key={key} className="hover:bg-ndtv-border/20">
                  <td className="py-2.5 pr-4 text-gray-300">{label}</td>
                  {consolidated.map(d => (
                    <td key={d.period} className={`text-right px-3 py-2.5 font-medium ${
                      d[key] < 0 ? 'text-red-400' : 'text-white'
                    }`}>
                      {d[key] < 0 ? `(${Math.abs(d[key])})` : d[key]}
                    </td>
                  ))}
                  <td className="text-right px-3 py-2.5">
                    {(() => {
                      const vals = consolidated.map(d => d[key])
                      const last = vals[vals.length - 1]
                      const prev = vals[vals.length - 2]
                      if (!prev || prev === 0) return '—'
                      const pct = (((last - prev) / Math.abs(prev)) * 100).toFixed(1)
                      return (
                        <span className={parseFloat(pct) >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {parseFloat(pct) >= 0 ? '+' : ''}{pct}%
                        </span>
                      )
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
