import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line
} from 'recharts'
import { TrendingUp, Activity, Globe, Tv } from 'lucide-react'
import { marketOverview, adMarketTrend, viewershipByChannel, digitalTrafficRanking, keyTrends } from '../../data/market'

const TABS = ['Ad Market', 'Viewership', 'Digital Ranking', 'Key Trends']
const PIE_COLORS = ['#E8001D', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#6b7280']
const IMPACT_COLOR = { High: 'badge-red', Medium: 'badge-yellow', Transformative: 'bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full font-medium', Strategic: 'bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium' }

export default function MarketStatus() {
  const [tab, setTab] = useState('Ad Market')

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Activity size={20} /> Market Status</h1>
        <p className="text-sm text-gray-400 mt-0.5">Indian News TV & Digital advertising market</p>
      </div>

      {/* Market KPI banners */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'TV News Ad Market', value: '₹4,800 Cr', sub: 'FY24', growth: '+7.2%', icon: Tv },
          { label: 'Digital News Market', value: '₹5,600 Cr', sub: 'FY24', growth: '+22.4%', icon: Globe },
          { label: 'Total News Ad Market', value: '₹10,400 Cr', sub: 'FY24', growth: '+20.9%', icon: TrendingUp },
          { label: 'Digital Share of Voice', value: '53.8%', sub: 'FY24 (was 37% in FY21)', growth: '+1680bps', icon: Activity },
        ].map(({ label, value, sub, growth, icon: Icon }) => (
          <div key={label} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-xl font-bold mt-1">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </div>
              <Icon size={18} className="text-gray-500 mt-0.5" />
            </div>
            <div className="text-xs text-green-400 mt-2 font-medium">{growth} YoY</div>
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

      {tab === 'Ad Market' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">TV News vs Digital News Ad Revenue (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={adMarketTrend} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="tvNews" name="TV News" fill="#E8001D" stackId="a" />
                <Bar dataKey="digitalNews" name="Digital News" fill="#3b82f6" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Market Growth Trajectory (INR Cr)</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={adMarketTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="tvNews" name="TV News" stroke="#E8001D" fill="#E8001D20" strokeWidth={2} />
                <Area type="monotone" dataKey="digitalNews" name="Digital News" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} />
                <Area type="monotone" dataKey="total" name="Total" stroke="#10b981" fill="#10b98120" strokeWidth={2} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Ad Market Forecast Table (INR Crores)</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Year</th>
                  <th className="text-right px-3">TV News</th>
                  <th className="text-right px-3">Digital News</th>
                  <th className="text-right px-3">Total</th>
                  <th className="text-right px-3">Digital Share</th>
                  <th className="text-right px-3">YoY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {adMarketTrend.map((row, i) => {
                  const prev = adMarketTrend[i - 1]
                  const yoy = prev ? (((row.total - prev.total) / prev.total) * 100).toFixed(1) : '—'
                  return (
                    <tr key={row.year} className={`hover:bg-ndtv-border/20 ${row.year.includes('E') ? 'text-gray-400 italic' : ''}`}>
                      <td className="py-2 pr-3 font-medium not-italic text-white">{row.year}</td>
                      <td className="text-right px-3">{row.tvNews.toLocaleString()}</td>
                      <td className="text-right px-3">{row.digitalNews.toLocaleString()}</td>
                      <td className="text-right px-3 font-medium text-white">{row.total.toLocaleString()}</td>
                      <td className="text-right px-3 text-blue-400">{((row.digitalNews / row.total) * 100).toFixed(1)}%</td>
                      <td className={`text-right px-3 ${typeof yoy === 'string' ? 'text-gray-400' : parseFloat(yoy) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {typeof yoy === 'string' ? yoy : `+${yoy}%`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Viewership' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">News Channel Viewership Share — All Day (%)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={viewershipByChannel}
                  dataKey="share"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, share }) => share > 5 ? `${name}: ${share}%` : ''}
                  labelLine={false}
                >
                  {viewershipByChannel.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Viewership Share Breakdown</h2>
            <div className="space-y-2.5">
              {viewershipByChannel.map((ch, i) => (
                <div key={ch.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <div className="flex-1 text-xs">{ch.name}</div>
                  <div className="text-xs text-gray-400">{ch.language}</div>
                  <div className="text-xs font-medium w-10 text-right">{ch.share}%</div>
                  <div className="w-20 h-1.5 bg-ndtv-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(ch.share / 15) * 100}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Digital Ranking' && (
        <div className="card">
          <h2 className="font-semibold text-sm mb-4">Top Indian News Digital Properties — MAU Ranking</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-ndtv-border">
                  <th className="text-center py-2 w-12">Rank</th>
                  <th className="text-left py-2 px-3">Property</th>
                  <th className="text-right px-3">MAU (Mn)</th>
                  <th className="text-right px-3">YoY Growth</th>
                  <th className="text-left px-3 w-40">MAU Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {digitalTrafficRanking.map(d => (
                  <tr key={d.rank} className={`hover:bg-ndtv-border/20 ${d.name === 'NDTV' ? 'bg-ndtv-red/5' : ''}`}>
                    <td className="py-2.5 text-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mx-auto ${
                        d.rank === 1 ? 'bg-yellow-500 text-black' :
                        d.rank === 2 ? 'bg-gray-400 text-black' :
                        d.rank === 3 ? 'bg-orange-600 text-white' : 'bg-ndtv-border text-gray-400'
                      }`}>{d.rank}</span>
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      {d.name}
                      {d.name === 'NDTV' && <span className="ml-1 badge-red">US</span>}
                    </td>
                    <td className="text-right px-3 font-medium">{d.mau}</td>
                    <td className="text-right px-3 text-green-400">{d.yoy}</td>
                    <td className="px-3">
                      <div className="w-32 h-2 bg-ndtv-border rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(d.mau / 310) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Key Trends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyTrends.map(trend => (
            <div key={trend.category} className="card">
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-semibold text-sm">{trend.category}</h2>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className={IMPACT_COLOR[trend.impact] || 'badge-yellow'}>{trend.impact}</span>
                  <span className="text-xs text-gray-500">{trend.timeline}</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mb-2">{trend.description}</p>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                <span className="text-xs text-green-400 font-medium">Opportunity: </span>
                <span className="text-xs text-gray-300">{trend.opportunity}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
