import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { TrendingUp, Activity, Globe, Tv, Megaphone } from 'lucide-react'
import { useData } from '../../api/DataContext'

const TABS = ['M&E Industry', 'Television', 'Digital', 'Advertising', 'Forecasts']
const YEARS_ME = [
  { key: 'y2022', label: '2022' }, { key: 'y2023', label: '2023' },
  { key: 'y2024', label: '2024' }, { key: 'y2025', label: '2025' },
  { key: 'y2026E', label: '2026E' }, { key: 'y2028E', label: '2028E' },
]
const YEARS_AD = [
  { key: 'y2020', label: '2020' }, { key: 'y2021', label: '2021' },
  { key: 'y2022', label: '2022' }, { key: 'y2023', label: '2023' },
  { key: 'y2024', label: '2024' }, { key: 'y2025', label: '2025' },
  { key: 'y2026E', label: '2026E' },
]
const SEG_COLORS = ['#3b82f6', '#E8001D', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6b7280']
const TT = { background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }

// reshape a segment-row table into chart rows keyed by year label
function toYearSeries(rows, years, nameKey = 'segment') {
  return years.map(y => {
    const r = { year: y.label }
    rows.forEach(row => { r[row[nameKey]] = row[y.key] })
    return r
  })
}

export default function MarketStatus() {
  const [tab, setTab] = useState('M&E Industry')
  const { data } = useData()
  const {
    meSegments, meOverview, tvRevenue, tvSubscriptions, tvMetrics,
    digitalRevenue, digitalMetrics, adMarket, adMarketOverview,
  } = data.market

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Activity size={20} /> Market Status</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Indian Media &amp; Entertainment industry — <span className="text-gray-300">FICCI-EY 2026 report</span>
          <span className="text-gray-500"> · "Unlocking India's media and entertainment economy"</span>
        </p>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total M&E Sector (2025)', value: '₹2.78 Tn', sub: 'US$32 Bn', growth: `+${meOverview.growth2025}%`, icon: TrendingUp },
          { label: 'Digital Media (2025)',    value: '₹1,110 Bn', sub: 'Largest segment', growth: '+30.5%', icon: Globe },
          { label: 'Television (2025)',       value: '₹617 Bn',   sub: '2nd largest', growth: `${tvMetrics.linearRevGrowth}%`, icon: Tv },
          { label: 'Total Advertising (2025)',value: '₹1.5 Tn',   sub: `Digital ${adMarketOverview.digitalShare2025}% share`, growth: `+${adMarketOverview.growth2025}%`, icon: Megaphone },
        ].map(({ label, value, sub, growth, icon: Icon }) => {
          const neg = growth.trim().startsWith('-')
          return (
            <div key={label} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-xl font-bold mt-1">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
                <Icon size={18} className="text-gray-500 mt-0.5" />
              </div>
              <div className={`text-xs mt-2 font-medium ${neg ? 'text-red-400' : 'text-green-400'}`}>{growth} YoY</div>
            </div>
          )
        })}
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

      {/* ════════════════ 1. M&E INDUSTRY ════════════════ */}
      {tab === 'M&E Industry' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">M&E Segments — size over time (₹ Billion)</h2>
            <p className="text-xs text-gray-500 mb-3">Digital overtook Television as the largest segment in 2024.</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={toYearSeries(meSegments.slice(0, 5), YEARS_ME)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={TT} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {meSegments.slice(0, 5).map((s, i) => (
                  <Line key={s.segment} type="monotone" dataKey={s.segment} stroke={SEG_COLORS[i]} strokeWidth={2} dot={{ r: 2 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">Segment mix — 2025 (₹ Billion)</h2>
            <p className="text-xs text-gray-500 mb-3">Total ₹2,785 Bn (₹2.78 trillion).</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={meSegments} dataKey="y2025" nameKey="segment" cx="50%" cy="50%" outerRadius={110}
                  label={({ segment, y2025 }) => y2025 > 150 ? `${segment.split(' ')[0]}` : ''} labelLine={false}>
                  {meSegments.map((_, i) => <Cell key={i} fill={SEG_COLORS[i % SEG_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v} Bn`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">M&E Sector size by segment (₹ Billion, gross of taxes)</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Segment</th>
                  {YEARS_ME.map(y => <th key={y.key} className={`text-right px-3 ${y.label.includes('E') ? 'text-gray-500' : ''}`}>{y.label}</th>)}
                  <th className="text-right px-3 text-amber-400">CAGR 25–28</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {meSegments.map(s => (
                  <tr key={s.segment} className={`hover:bg-ndtv-border/20 ${s.segment === 'Television' || s.segment === 'Digital media' ? 'bg-ndtv-red/5' : ''}`}>
                    <td className="py-2 pr-3 font-medium text-white">{s.segment}</td>
                    {YEARS_ME.map(y => <td key={y.key} className={`text-right px-3 ${y.label.includes('E') ? 'text-gray-400 italic' : ''}`}>{s[y.key].toLocaleString()}</td>)}
                    <td className={`text-right px-3 font-medium ${s.cagr < 0 ? 'text-red-400' : 'text-green-400'}`}>{s.cagr > 0 ? '+' : ''}{s.cagr}%</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ndtv-border font-bold text-white">
                  <td className="py-2 pr-3">Total</td>
                  <td className="text-right px-3">2,237</td><td className="text-right px-3">2,422</td>
                  <td className="text-right px-3">2,553</td><td className="text-right px-3">2,785</td>
                  <td className="text-right px-3 italic text-gray-300">2,862</td><td className="text-right px-3 italic text-gray-300">3,301</td>
                  <td className="text-right px-3 text-green-400">+6%</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">{meOverview.note}</p>
            <p className="text-xs text-gray-600 mt-1">Source: FICCI-EY 2026, p.12. ~0.8% of India's GDP; 2.75M direct jobs.</p>
          </div>
        </div>
      )}

      {/* ════════════════ 2. TELEVISION ════════════════ */}
      {tab === 'Television' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">TV revenue — advertising vs distribution (₹ Bn)</h2>
            <p className="text-xs text-gray-500 mb-3">Linear TV revenues fell for the 4th straight year in 2025.</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={tvRevenue} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v} Bn`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="distribution" name="Distribution" stackId="a" fill="#3b82f6" />
                <Bar dataKey="advertising" name="Advertising" stackId="a" fill="#E8001D" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">TV subscriptions (millions)</h2>
            <p className="text-xs text-gray-500 mb-3">Pay TV declining; Free TV &amp; Connected TV growing.</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={tvSubscriptions} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`${v} Mn`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="payConnected" name="Pay + Connected TV" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="freeTV" name="Free TV" stackId="a" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* TV key metrics */}
          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-sm mb-3">Television — 2025 key metrics (FICCI-EY p.66)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: 'Weekly reach', v: `${tvMetrics.weeklyReachMn} Mn`, s: 'BARC all-India' },
                { l: 'TV channels', v: tvMetrics.channels, s: `${tvMetrics.ftaSharePct}% are FTA` },
                { l: 'Avg ARPU', v: `₹${tvMetrics.arpu}`, s: 'gross of taxes' },
                { l: 'Linear ad growth', v: `${tvMetrics.linearAdGrowth}%`, s: 'ad volumes −11.5%', neg: true },
                { l: 'Subscription growth', v: `${tvMetrics.subRevGrowth}%`, s: `−${tvMetrics.payTvLossMn}M Pay TV HH`, neg: true },
                { l: 'Connected TV ad', v: `₹${tvMetrics.ctvAd} Bn`, s: `+${tvMetrics.ctvAdGrowth}% (under Digital)` },
                { l: 'Linear + CTV ad', v: `₹${tvMetrics.linearPlusCtvAd} Bn`, s: 'combined, stable' },
                { l: 'Active MSOs', v: tvMetrics.msos, s: 'Sep 2025' },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className={`text-lg font-bold mt-0.5 ${m.neg ? 'text-red-400' : 'text-white'}`}>{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{tvMetrics.note}</p>
          </div>

          {/* TV table */}
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">TV revenue &amp; projections (₹ Billion)</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Year</th>
                  <th className="text-right px-3">Advertising</th>
                  <th className="text-right px-3">Distribution</th>
                  <th className="text-right px-3">Total TV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {tvRevenue.map(r => (
                  <tr key={r.year} className={`hover:bg-ndtv-border/20 ${r.year.includes('E') ? 'italic text-gray-400' : ''}`}>
                    <td className="py-2 pr-3 font-medium not-italic text-white">{r.year}</td>
                    <td className="text-right px-3">{r.advertising}</td>
                    <td className="text-right px-3">{r.distribution}</td>
                    <td className="text-right px-3 font-medium not-italic text-white">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-600 mt-2">Source: FICCI-EY 2026, p.67. Television CAGR 2025–28: −5%.</p>
          </div>
        </div>
      )}

      {/* ════════════════ 3. DIGITAL ════════════════ */}
      {tab === 'Digital' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">Digital revenue — advertising vs subscription (₹ Bn)</h2>
            <p className="text-xs text-gray-500 mb-3">First M&E segment to cross ₹1 trillion (2025).</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={digitalRevenue} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v} Bn`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="advertising" name="Advertising" stackId="a" fill="#3b82f6" />
                <Bar dataKey="subscription" name="Subscription" stackId="a" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Digital subscription revenue split — 2025 (₹ Bn)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Video OTT', value: digitalMetrics.videoSubRev },
                    { name: 'Audio/Music', value: digitalMetrics.audioSubRev },
                    { name: 'News', value: digitalMetrics.newsSubRev },
                  ]}
                  dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                  label={({ name, value }) => `${name}: ₹${value}B`} labelLine={false}>
                  {['#10b981', '#8b5cf6', '#E8001D'].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v} Bn`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Digital key metrics */}
          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-sm mb-3">Digital media — 2025 key metrics (FICCI-EY p.30–31)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: 'Digital ad growth', v: `+${digitalMetrics.adGrowth}%`, s: `${digitalMetrics.adShareOfTotalAd}% of all ads` },
                { l: 'E-commerce/POS ads', v: `₹${digitalMetrics.ecomPosAd} Bn`, s: '85% of TV ad revenue' },
                { l: 'Subscription growth', v: `+${digitalMetrics.subGrowth}%`, s: `₹163 Bn total` },
                { l: 'Video subscriptions', v: `${digitalMetrics.videoSubscriptionsMn} Mn`, s: `${digitalMetrics.videoHouseholdsMn}M households` },
                { l: 'Video sub revenue', v: `₹${digitalMetrics.videoSubRev} Bn`, s: `+${digitalMetrics.videoSubGrowth}%` },
                { l: 'Paid music subs', v: `${digitalMetrics.audioPaidMn} Mn`, s: `₹${digitalMetrics.audioSubRev}B (first time)` },
                { l: 'Connected TV homes', v: `${digitalMetrics.ctvHouseholdsMn} Mn`, s: `${digitalMetrics.ctvActiveMn}M weekly active` },
                { l: 'News subscriptions', v: `${digitalMetrics.newsSubscribersMn} Mn`, s: `only ₹${digitalMetrics.newsSubRev}B revenue` },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className="text-lg font-bold mt-0.5 text-white">{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{digitalMetrics.note}</p>
          </div>

          {/* Digital table */}
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Digital revenue &amp; projections (₹ Billion)</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Year</th>
                  <th className="text-right px-3">Advertising</th>
                  <th className="text-right px-3">Subscription</th>
                  <th className="text-right px-3">Total Digital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {digitalRevenue.map(r => (
                  <tr key={r.year} className={`hover:bg-ndtv-border/20 ${r.year.includes('E') ? 'italic text-gray-400' : ''}`}>
                    <td className="py-2 pr-3 font-medium not-italic text-white">{r.year}</td>
                    <td className="text-right px-3">{r.advertising.toLocaleString()}</td>
                    <td className="text-right px-3">{r.subscription}</td>
                    <td className="text-right px-3 font-medium not-italic text-white">{r.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-600 mt-2">Source: FICCI-EY 2026, p.30. Digital media CAGR 2025–28: +14%.</p>
          </div>
        </div>
      )}

      {/* ════════════════ 4. ADVERTISING (TV vs DIGITAL) ════════════════ */}
      {tab === 'Advertising' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">TV vs Digital advertising (₹ Bn)</h2>
            <p className="text-xs text-gray-500 mb-3">Digital overtook TV in 2022 and now dwarfs it.</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={toYearSeries(adMarket.filter(s => ['Television', 'Digital'].includes(s.segment)), YEARS_AD)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v} Bn`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Digital" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Television" stroke="#E8001D" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Ad market mix — 2025 (₹ Bn, total ₹1,504 Bn)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={adMarket} dataKey="y2025" nameKey="segment" cx="50%" cy="50%" outerRadius={105}
                  label={({ segment, y2025 }) => y2025 > 60 ? segment : ''} labelLine={false}>
                  {adMarket.map((s, i) => <Cell key={i} fill={s.segment === 'Digital' ? '#3b82f6' : s.segment === 'Television' ? '#E8001D' : SEG_COLORS[(i + 2) % SEG_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v} Bn`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Advertising revenue by medium (₹ Billion, gross of taxes)</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-ndtv-border">
                  <th className="text-left py-2 pr-3">Medium</th>
                  {YEARS_AD.map(y => <th key={y.key} className={`text-right px-3 ${y.label.includes('E') ? 'text-gray-500' : ''}`}>{y.label}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-ndtv-border/50">
                {adMarket.map(s => (
                  <tr key={s.segment} className={`hover:bg-ndtv-border/20 ${['Television', 'Digital'].includes(s.segment) ? 'bg-ndtv-red/5' : ''}`}>
                    <td className="py-2 pr-3 font-medium text-white">{s.segment}</td>
                    {YEARS_AD.map(y => <td key={y.key} className={`text-right px-3 ${y.label.includes('E') ? 'text-gray-400 italic' : ''}`}>{s[y.key].toLocaleString()}</td>)}
                  </tr>
                ))}
                <tr className="border-t-2 border-ndtv-border font-bold text-white">
                  <td className="py-2 pr-3">Total advertising</td>
                  <td className="text-right px-3">711</td><td className="text-right px-3">914</td>
                  <td className="text-right px-3">1,088</td><td className="text-right px-3">1,184</td>
                  <td className="text-right px-3">1,326</td><td className="text-right px-3">1,504</td>
                  <td className="text-right px-3 italic text-gray-300">1,662</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">{adMarketOverview.note}</p>
            <p className="text-xs text-gray-600 mt-1">Source: FICCI-EY 2026, p.234. Digital share of total ad: {adMarketOverview.digitalShare2024}% (2024) → {adMarketOverview.digitalShare2025}% (2025).</p>
          </div>
        </div>
      )}

      {/* ════════════════ 5. FORECASTS ════════════════ */}
      {tab === 'Forecasts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-sm mb-1">Segment growth — CAGR 2025–2028 (%)</h2>
            <p className="text-xs text-gray-500 mb-3">Digital, Live events &amp; Animation lead; Television and Online gaming decline.</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[...meSegments].sort((a, b) => b.cagr - a.cagr)} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} unit="%" />
                <YAxis type="category" dataKey="segment" tick={{ fontSize: 10, fill: '#9ca3af' }} width={120} />
                <Tooltip contentStyle={TT} formatter={(v) => [`${v}%`, 'CAGR 25–28']} />
                <Bar dataKey="cagr" radius={[0, 3, 3, 0]}>
                  {meSegments.slice().sort((a, b) => b.cagr - a.cagr).map((s, i) => (
                    <Cell key={i} fill={s.cagr < 0 ? '#ef4444' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">Television trajectory (₹ Bn)</h2>
            <p className="text-xs text-gray-500 mb-3">Declining at −5% CAGR through 2028.</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={tvRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v} Bn`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="total" name="Total TV" stroke="#E8001D" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">Digital trajectory (₹ Bn)</h2>
            <p className="text-xs text-gray-500 mb-3">Growing at +14% CAGR to ₹1,640 Bn by 2028.</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={digitalRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v} Bn`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="total" name="Total Digital" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: 'M&E sector 2026E', v: '₹2.86 Tn', s: `+${meOverview.growth2026E}% (8% ex-gaming)` },
                { l: 'M&E sector 2028E', v: '₹3.30 Tn', s: 'US$37.9 Bn, +6% CAGR' },
                { l: 'Digital 2028E', v: '₹1,640 Bn', s: '+14% CAGR' },
                { l: 'Television 2028E', v: '₹535 Bn', s: '−5% CAGR' },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className="text-lg font-bold mt-0.5 text-white">{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">Source: FICCI-EY 2026, p.11–12. All projections are EY estimates.</p>
          </div>
        </div>
      )}
    </div>
  )
}
