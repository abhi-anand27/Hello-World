import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ReferenceLine
} from 'recharts'
import { TrendingUp, TrendingDown, Tv, Globe, Users, Activity, BarChart3 } from 'lucide-react'
import { useData } from '../../api/DataContext'
import { digitalTraffic as DT } from '../../data/digitalTraffic'

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
        <span>{change}</span>
      </div>
    </div>
  )
}

const COLORS = { tv: '#E8001D', digital: '#3b82f6', profit: '#10b981', loss: '#ef4444' }

// TV vs Digital revenue split (from financials.js)
const tvVsDigital = [
  { year: 'FY21', tv: 197, digital: 161 },
  { year: 'FY22', tv: 231, digital: 165 },
  { year: 'FY23', tv: 221, digital: 165 },
  { year: 'FY24', tv: 229, digital: 141 },
  { year: 'FY25', tv: 262, digital: 203 },
  { year: 'FY26', tv: 332, digital: 196 },
]

export default function Overview({ onNavigate }) {
  const { data } = useData()
  const { consolidatedData } = data.financials
  const consolidated = consolidatedData.annual
  // FY26 is the latest full year
  const latest = consolidated[consolidated.length - 1]   // FY26
  const prev   = consolidated[consolidated.length - 2]   // FY25

  const revGrowth = (((latest.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold">Executive Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">NDTV Group Consolidated — FY26 Full Year (Apr 25 – Mar 26)</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Consolidated Revenue"
          value={`₹${latest.revenue} Cr`}
          change={`${revGrowth >= 0 ? '+' : ''}${revGrowth}% vs FY25`}
          positive={revGrowth >= 0}
          icon={Activity}
          sub="FY26 Actuals"
        />
        <KPICard
          title="Operating Profit"
          value={`₹${latest.opProfit} Cr`}
          change={`OPM: ${latest.opm}%`}
          positive={latest.opProfit >= 0}
          icon={TrendingDown}
          sub="FY26 Actuals"
        />
        <KPICard
          title="PAT (Net Profit)"
          value={`₹${latest.pat} Cr`}
          change={latest.pat >= 0 ? `OPM ${latest.opm}%` : 'Loss year'}
          positive={latest.pat >= 0}
          icon={latest.pat >= 0 ? TrendingUp : TrendingDown}
          sub="FY26 Actuals"
        />
        <KPICard
          title="Digital MAU"
          value="235M+"
          change="+22% YoY"
          positive
          icon={Globe}
          sub="NDTV Convergence"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Consolidated Revenue + Operating Profit trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Consolidated Revenue & Op. Profit (Annual)</h2>
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
                formatter={(v, name) => [v < 0 ? `(${Math.abs(v)})` : v, name]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="#555" />
              <Bar dataKey="revenue" name="Revenue" fill={COLORS.tv} radius={[4, 4, 0, 0]} />
              <Bar dataKey="opProfit" name="Op. Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pat" name="PAT" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TV vs Digital revenue */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">TV vs Digital Revenue Split (Annual)</h2>
            <span className="text-xs text-gray-400">INR Crores</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={tvVsDigital}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="tv" name="TV (Standalone)" stroke={COLORS.tv} fill={COLORS.tv + '30'} strokeWidth={2} />
              <Area type="monotone" dataKey="digital" name="Digital (Convergence)" stroke={COLORS.digital} fill={COLORS.digital + '30'} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'tv',          label: 'TV Business',          desc: `FY26 Revenue: ₹332 Cr`, icon: Tv,         color: 'border-ndtv-red/40 hover:border-ndtv-red' },
          { id: 'digital',     label: 'Digital / Convergence',desc: `FY26 Revenue: ₹196 Cr`, icon: Globe,      color: 'border-blue-500/40 hover:border-blue-500' },
          { id: 'competitors', label: 'Competitors',           desc: '5 Listed Peer Companies', icon: Users,   color: 'border-yellow-500/40 hover:border-yellow-500' },
          { id: 'market',      label: 'M&E Industry FICCI',      desc: 'FICCI-EY 2026 Report',   icon: TrendingUp,color: 'border-green-500/40 hover:border-green-500' },
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

      {/* Consolidated P&L summary table */}
      <div className="card">
        <h2 className="font-semibold text-sm mb-4">NDTV Consolidated P&L Summary — All Years (INR Crores)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-ndtv-border">
                <th className="text-left py-2 pr-4">Metric</th>
                {consolidated.map(d => (
                  <th key={d.period} className={`text-right py-2 px-3 ${d.period === 'FY26' ? 'text-ndtv-red' : ''}`}>{d.period}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ndtv-border/50">
              {[
                { label: 'Revenue',      key: 'revenue',  fmt: v => v },
                { label: 'Op. Profit',   key: 'opProfit', fmt: v => v < 0 ? `(${Math.abs(v)})` : v },
                { label: 'OPM %',        key: 'opm',      fmt: v => `${v}%` },
                { label: 'PAT',          key: 'pat',      fmt: v => v < 0 ? `(${Math.abs(v)})` : v },
              ].map(({ label, key, fmt }) => (
                <tr key={key} className="hover:bg-ndtv-border/20">
                  <td className="py-2 pr-4 text-gray-300 font-medium">{label}</td>
                  {consolidated.map(d => (
                    <td key={d.period} className={`text-right px-3 py-2 font-medium ${
                      d[key] < 0 ? 'text-red-400' : key === 'revenue' ? 'text-white' : 'text-green-400'
                    } ${d.period === 'FY26' ? 'font-bold' : ''}`}>
                      {fmt(d[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">Source: BSE filings via finology.in (same data as Moneycontrol). FY26 = Apr 25 – Mar 26.</p>
      </div>

      {/* Comscore + GA snapshots (two separate rows) */}
      <ComscoreSnapshot />
      <GASnapshot />
    </div>
  )
}

function ml(m) {
  if (typeof m !== 'string' || !m.includes('-')) return m
  const [y, mo] = m.split('-')
  const names = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${names[+mo] || mo}'${y.slice(2)}`
}

function ComscoreSnapshot() {
  const csGroup   = DT.csGroup
  const csEnglish = DT.csEnglish
  const csHindi   = DT.csHindi
  const appMins   = DT.csAppMins
  const ndtvGroup   = csGroup.ranking.find(r => r.ndtv)
  const ndtvEnglish = csEnglish.ranking.find(r => r.ndtv)
  const ndtvHindi   = csHindi.ranking.find(r => r.ndtv)
  const ndtvApp     = appMins.rows.find(r => r.ndtv)
  const groupRank   = csGroup.ranking.findIndex(r => r.ndtv) + 1
  const engRank     = csEnglish.ranking.findIndex(r => r.ndtv) + 1
  const hindiRank   = csHindi.ranking.findIndex(r => r.ndtv) + 1

  const kpis = [
    { label: 'Group Unique Users',  value: `${ndtvGroup?.value ?? '—'} Mn`,   sub: `#${groupRank} Publisher Group · ${ml(csGroup.latestMonth)}`,   icon: BarChart3,  color: 'text-blue-400' },
    { label: 'English News',        value: `${ndtvEnglish?.value ?? '—'} Mn`, sub: `#${engRank} English News Site · ${ml(csEnglish.latestMonth)}`,   icon: Globe,      color: 'text-green-400' },
    { label: 'Hindi News',          value: `${ndtvHindi?.value ?? '—'} Mn`,   sub: `#${hindiRank} Hindi News Site · ${ml(csHindi.latestMonth)}`,    icon: Globe,      color: 'text-yellow-400' },
    { label: 'App Engagement',      value: `${ndtvApp?.avgMins ?? '—'} min`,  sub: `Avg mins/user · #1 in app engagement`,                          icon: Activity,   color: 'text-purple-400' },
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <BarChart3 size={15} className="text-gray-400" /> Comscore Snapshot — NDTV Digital Reach
        </h2>
        <span className="text-xs text-gray-500">Source: Comscore India · Unique Users · {ml(csGroup.latestMonth)}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <k.icon size={12} /> {k.label}
            </div>
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Comscore India unique users (millions) — rankings on Users, not Pageviews. Full detail in Digital Traffic.</p>
    </div>
  )
}

function GASnapshot() {
  const fy = DT.gaFY
  const latest = DT.gaNDTV.trend[DT.gaNDTV.trend.length - 1]
  const g = DT.gaFYGrowth
  const kpis = [
    { label: 'Users (FY24-25)',     value: `${fy[1].users.toLocaleString('en-IN')} Mn`,     sub: `${g.users >= 0 ? '+' : ''}${g.users}% YoY`,         pos: g.users >= 0,     icon: Activity },
    { label: 'Sessions (FY24-25)',  value: `${fy[1].sessions.toLocaleString('en-IN')} Mn`,  sub: `${g.sessions >= 0 ? '+' : ''}${g.sessions}% YoY`,   pos: g.sessions >= 0,  icon: TrendingUp },
    { label: 'Pageviews (FY24-25)', value: `${fy[1].pageviews.toLocaleString('en-IN')} Mn`, sub: `${g.pageviews >= 0 ? '+' : ''}${g.pageviews}% YoY`, pos: g.pageviews >= 0, icon: Globe },
    { label: 'Latest-month Users',  value: `${latest?.users ?? '—'} Mn`,                    sub: `GA4 · ${ml(latest?.month)}`,                       pos: true,             icon: BarChart3 },
  ]
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Globe size={15} className="text-gray-400" /> Google Analytics Snapshot — NDTV Group (GA4)
        </h2>
        <span className="text-xs text-gray-500">Source: Google Analytics 4 · {fy[1].fy}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <k.icon size={12} /> {k.label}
            </div>
            <div className="text-lg font-bold text-white">{k.value}</div>
            <div className={`text-[11px] mt-0.5 ${k.sub.includes('%') ? (k.pos ? 'text-green-400' : 'text-red-400') : 'text-gray-500'}`}>{k.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">NDTV Group GA4 — Users / Sessions / Pageviews in millions. Full detail in Digital Traffic › Google Analytics.</p>
    </div>
  )
}
