import React, { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, BarChart, Bar
} from 'recharts'
import { Users, Shield, AlertTriangle, TrendingUp } from 'lucide-react'
import { useData } from '../../api/DataContext'

const TABS = ['TV Players', 'Digital Players', 'Market Share Trend', 'SWOT']

const STATUS_CONFIG = {
  self: { color: 'border-ndtv-red/60 bg-ndtv-red/10', badge: 'badge-red', label: 'NDTV' },
  threat: { color: 'border-yellow-500/40 bg-yellow-500/5', badge: 'badge-yellow', label: 'Competitor' },
  neutral: { color: 'border-gray-600/40', badge: 'badge-yellow', label: 'Peer' },
  emerging: { color: 'border-blue-500/40 bg-blue-500/5', badge: 'bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium', label: 'Emerging' },
}

const LINE_COLORS = {
  ndtv: '#E8001D',
  aajTak: '#f59e0b',
  network18: '#a855f7',
  zee: '#3b82f6',
  sunTV: '#10b981',
}

export default function CompetitorAnalysis() {
  const [tab, setTab] = useState('TV Players')
  const [selectedTV, setSelectedTV] = useState(null)
  const { data } = useData()
  const { tvCompetitors, digitalCompetitors, marketShareTrend } = data.competitors

  const radarData = tvCompetitors.map(c => ({
    name: c.name.split(' ')[0],
    'Primetime Share': typeof c.primetime.share === 'number' ? c.primetime.share : 5,
    'Revenue (100s Cr)': Math.min(Math.round(c.revenue / 100), 20),
    'EBITDA Margin': Math.max(parseFloat(c.ebitdaMargin) + 40, 0),
    'Channel Count': c.channels.length * 2,
    'Brand Score': c.name.includes('NDTV') ? 8 : c.name.includes('Aaj Tak') ? 9 : c.name.includes('Sun') ? 8 : c.name.includes('Zee') ? 7 : 6,
  }))

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Users size={20} /> Competitor Analysis</h1>
        <p className="text-sm text-gray-400 mt-0.5">Indian News TV & Digital competitive landscape</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-ndtv-card border border-ndtv-border rounded-lg p-1 w-fit flex-wrap">
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

      {tab === 'TV Players' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {tvCompetitors.map(c => {
              const cfg = STATUS_CONFIG[c.status]
              return (
                <div
                  key={c.name}
                  className={`card border cursor-pointer transition-all ${cfg.color} ${selectedTV === c.name ? 'ring-1 ring-ndtv-red' : ''}`}
                  onClick={() => setSelectedTV(selectedTV === c.name ? null : c.name)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-sm">{c.name}</div>
                    <span className={cfg.badge}>{cfg.label}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-3">{c.ownership}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-400">Revenue:</span> <span className="font-medium">₹{c.revenue} Cr</span></div>
                    <div><span className="text-gray-400">EBITDA Mg:</span> <span className="font-medium">{c.ebitdaMargin}</span></div>
                    <div><span className="text-gray-400">PAT FY25:</span> <span className={`font-medium ${c.pat < 0 ? 'text-red-400' : 'text-green-400'}`}>₹{c.pat} Cr</span></div>
                    <div><span className="text-gray-400">EPS:</span> <span className={`font-medium ${c.eps < 0 ? 'text-red-400' : 'text-green-400'}`}>₹{c.eps}</span></div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.channels.map(ch => (
                      <span key={ch} className="text-xs bg-ndtv-border/60 px-1.5 py-0.5 rounded">{ch}</span>
                    ))}
                  </div>
                  {selectedTV === c.name && (
                    <div className="mt-3 pt-3 border-t border-ndtv-border/50 space-y-2">
                      <div className="text-xs"><span className="text-green-400 font-medium">Strength: </span>{c.strength}</div>
                      <div className="text-xs"><span className="text-red-400 font-medium">Weakness: </span>{c.weakness}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Comparison table */}
          <div className="card overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">TV Players Comparison</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Network</th>
                  <th className="text-right px-3">Ticker</th>
                  <th className="text-right px-3">Rev FY25 (Cr)</th>
                  <th className="text-right px-3">OPM FY25</th>
                  <th className="text-right px-3">PAT FY25 (Cr)</th>
                  <th className="text-right px-3">EPS FY25</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {tvCompetitors.sort((a, b) => b.revenue - a.revenue).map(c => (
                  <tr key={c.name} className={`hover:bg-ndtv-border/20 ${c.status === 'self' ? 'bg-ndtv-red/5' : ''}`}>
                    <td className="py-2 pr-3 font-medium">
                      {c.name}
                      {c.status === 'self' && <span className="ml-1 badge-red">NDTV</span>}
                    </td>
                    <td className="text-right px-3 text-gray-400 font-mono text-xs">{c.ticker}</td>
                    <td className="text-right px-3">{c.revenue.toLocaleString()}</td>
                    <td className="text-right px-3">{c.ebitdaMargin}</td>
                    <td className={`text-right px-3 ${c.pat < 0 ? 'text-red-400' : 'text-green-400'}`}>{c.pat}</td>
                    <td className={`text-right px-3 ${c.eps < 0 ? 'text-red-400' : 'text-green-400'}`}>₹{c.eps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Digital Players' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {digitalCompetitors.map(d => {
              const cfg = STATUS_CONFIG[d.status]
              return (
                <div key={d.name} className={`card border ${cfg.color}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-sm">{d.name}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">#{d.rank}</span>
                      <span className={cfg.badge}>{cfg.label}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div><span className="text-gray-400">MAU:</span> <span className="font-medium">{d.mau}M</span></div>
                    <div><span className="text-gray-400">Ad Rev:</span> <span className="font-medium">₹{d.adRevenue} Cr</span></div>
                    <div><span className="text-gray-400">Growth:</span> <span className="text-green-400 font-medium">{d.growth}</span></div>
                    <div><span className="text-gray-400">Model:</span> <span className="font-medium">{d.revenueModel}</span></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">{d.strength}</div>
                </div>
              )
            })}
          </div>

          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Digital MAU Comparison (Millions)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={digitalCompetitors} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} width={115} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Bar
                  dataKey="mau"
                  name="MAU (Mn)"
                  radius={[0, 4, 4, 0]}
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'Market Share Trend' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">News Channel Viewership Share Trend (%)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={marketShareTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-20} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[6, 14]} />
                <Tooltip contentStyle={{ background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="ndtv" name="NDTV" stroke={LINE_COLORS.ndtv} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="aajTak" name="Aaj Tak" stroke={LINE_COLORS.aajTak} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="network18" name="Network18" stroke={LINE_COLORS.network18} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="zee" name="Zee News" stroke={LINE_COLORS.zee} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="sunTV" name="Sun TV" stroke={LINE_COLORS.sunTV} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="flex items-start gap-3 p-2">
              <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-medium text-yellow-400">Trend Alert: </span>
                NDTV's combined viewership share has declined from ~8.9% (Q1 FY23) to ~7.8% (Q4 FY24).
                Aaj Tak (TV Today) remains the Hindi news market leader at ~10.8%. Network18 gaining share
                with JioStar distribution. Viewership data based on BARC estimates (Hindi+English news genre).
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'SWOT' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Strengths',
              icon: <Shield size={16} className="text-green-400" />,
              color: 'border-green-500/30 bg-green-500/5',
              headerColor: 'text-green-400',
              items: [
                'Premium English-language brand — trusted by urban, educated audience',
                'NDTV Profit — strong financial news positioning',
                'Digital MAU of 235M+ — top 3 news portal in India',
                'Adani Group backing — financial stability & access to infrastructure',
                'Strong original content & investigative journalism heritage',
              ],
            },
            {
              title: 'Weaknesses',
              icon: <AlertTriangle size={16} className="text-red-400" />,
              color: 'border-red-500/30 bg-red-500/5',
              headerColor: 'text-red-400',
              items: [
                'Declining viewership market share across TV channels',
                'Digital business yet to achieve profitability',
                'Limited Hindi mass-market penetration vs. Aaj Tak',
                'Leadership transition & ownership change creating talent uncertainty',
                'Lower EBITDA margin vs. industry leader (Aaj Tak at 22%)',
              ],
            },
            {
              title: 'Opportunities',
              icon: <TrendingUp size={16} className="text-blue-400" />,
              color: 'border-blue-500/30 bg-blue-500/5',
              headerColor: 'text-blue-400',
              items: [
                'CTV/OTT boom — premium advertising at 5-8x linear CPMs',
                'Bihar elections FY26 + state election calendar — ad uplift of 35-45%',
                'AI newsroom — reduce production costs by 25-40%',
                'NDTV Premium subscription product launch',
                'Adani Group B2B media partnerships & cross-group advertising',
                'Regional language digital expansion (12 languages potential)',
              ],
            },
            {
              title: 'Threats',
              icon: <AlertTriangle size={16} className="text-yellow-400" />,
              color: 'border-yellow-500/30 bg-yellow-500/5',
              headerColor: 'text-yellow-400',
              items: [
                'Republic TV/Bharat gaining mass Hindi audience rapidly',
                'Network18/JioStar ecosystem — captive distribution advantage',
                'Digital ad revenue shifting to Google, Meta, YouTube',
                'Short-form video (Reels/Shorts) cannibalizing news video consumption',
                'Regulatory/TRAI changes affecting carriage fee economics',
                'Talent exodus concern post acquisition',
              ],
            },
          ].map(section => (
            <div key={section.title} className={`card border ${section.color}`}>
              <h2 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${section.headerColor}`}>
                {section.icon} {section.title}
              </h2>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${
                      section.title === 'Strengths' ? 'bg-green-400' :
                      section.title === 'Weaknesses' ? 'bg-red-400' :
                      section.title === 'Opportunities' ? 'bg-blue-400' : 'bg-yellow-400'
                    }`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
