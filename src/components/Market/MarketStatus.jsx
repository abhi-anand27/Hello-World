import React, { useState, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { TrendingUp, Activity, Globe, Tv, Megaphone, BookOpen } from 'lucide-react'
import { useData } from '../../api/DataContext'
import FICCIPDFModal from './FICCIPDFModal'

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
const SEG_COLORS = ['#3b82f6','#E8001D','#f59e0b','#10b981','#8b5cf6','#ec4899','#06b6d4','#f97316','#84cc16','#6b7280']
const TT = { background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }

function toYearSeries(rows, years, nameKey = 'segment') {
  return years.map(y => {
    const r = { year: y.label }
    rows.forEach(row => { r[row[nameKey]] = row[y.key] })
    return r
  })
}

// Source attribution row with a clickable "View in report" button
function Src({ text, page, onView }) {
  return (
    <div className="flex items-center gap-2 mt-2 flex-wrap">
      <p className="text-xs text-gray-600">Source: {text}</p>
      {page && (
        <button
          onClick={() => onView(page)}
          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2 py-0.5 rounded-full"
        >
          <BookOpen size={10} /> View p.{page} in report
        </button>
      )}
    </div>
  )
}

export default function MarketStatus() {
  const [tab, setTab]         = useState('M&E Industry')
  const [pdfPage, setPdfPage] = useState(null)   // null = closed

  const openPDF = useCallback(page => setPdfPage(page), [])
  const closePDF = useCallback(() => setPdfPage(null), [])

  const { data } = useData()
  const {
    meSegments, meOverview, tvRevenue, tvSubscriptions, tvMetrics,
    digitalRevenue, digitalMetrics, adMarket, adMarketOverview,
    vodMetrics, appMetrics, onlineVideoMetrics,
  } = data.market

  return (
    <div className="space-y-6 max-w-screen-xl">
      {pdfPage && <FICCIPDFModal page={pdfPage} onClose={closePDF} />}

      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Activity size={20} /> M&amp;E Industry FICCI Report</h1>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <p className="text-sm text-gray-400">
            <span className="text-gray-300">FICCI-EY 2026</span>
            <span className="text-gray-500"> · "Unlocking India's media and entertainment economy"</span>
          </p>
          <button onClick={() => openPDF(1)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-500/60 bg-blue-500/5 hover:bg-blue-500/10 px-2.5 py-1 rounded-full transition-colors">
            <BookOpen size={11} /> Open full report (323 pp.)
          </button>
        </div>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total M&E Sector (2025)', value: '₹2,78,500 Cr', sub: 'US$32 Bn (~0.8% GDP)', growth: `+${meOverview.growth2025}%`, icon: TrendingUp, page: 11 },
          { label: 'Digital Media (2025)',    value: '₹1,11,000 Cr', sub: '1st segment > ₹1 lakh Cr', growth: '+30.5%',                   icon: Globe,      page: 30 },
          { label: 'Television (2025)',       value: '₹61,700 Cr',   sub: '2nd largest segment',      growth: `${tvMetrics.linearRevGrowth}%`, icon: Tv,    page: 66 },
          { label: 'Total Advertising (2025)',value: '₹1,50,400 Cr', sub: `Digital ${adMarketOverview.digitalShare2025}% share`, growth: `+${adMarketOverview.growth2025}%`, icon: Megaphone, page: 234 },
        ].map(({ label, value, sub, growth, icon: Icon, page }) => {
          const neg = growth.trim().startsWith('-')
          return (
            <div key={label} className="card group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-xl font-bold mt-1">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Icon size={18} className="text-gray-500" />
                  <button onClick={() => openPDF(page)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-xs text-blue-500 hover:text-blue-300">
                    <BookOpen size={10} /> p.{page}
                  </button>
                </div>
              </div>
              <div className={`text-xs mt-2 font-medium ${neg ? 'text-red-400' : 'text-green-400'}`}>{growth} YoY</div>
            </div>
          )
        })}
      </div>
      <Src text="FICCI-EY 2026. All figures INR Crores, gross of taxes, calendar years. EY estimates." page={11} onView={openPDF} />

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
            <h2 className="font-semibold text-sm mb-1">M&amp;E Segments — size over time (₹ Crores)</h2>
            <p className="text-xs text-gray-500 mb-3">Digital overtook Television as the largest segment in 2024.</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={toYearSeries(meSegments.slice(0, 5), YEARS_ME)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')} Cr`, n]} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {meSegments.slice(0, 5).map((s, i) => (
                  <Line key={s.segment} type="monotone" dataKey={s.segment} stroke={SEG_COLORS[i]} strokeWidth={2} dot={{ r: 2 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <Src text="FICCI-EY 2026, p.12" page={12} onView={openPDF} />
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">Segment mix — 2025 (₹ Crores)</h2>
            <p className="text-xs text-gray-500 mb-3">Total ₹2,78,500 Cr (₹2.78 lakh crore).</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={meSegments} dataKey="y2025" nameKey="segment" cx="50%" cy="50%" outerRadius={110}
                  label={({ segment, y2025 }) => y2025 > 15000 ? `${segment.split(' ')[0]}` : ''} labelLine={false}>
                  {meSegments.map((_, i) => <Cell key={i} fill={SEG_COLORS[i % SEG_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')} Cr`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <Src text="FICCI-EY 2026, p.12" page={12} onView={openPDF} />
          </div>
          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">M&amp;E Sector size by segment (₹ Crores, gross of taxes)</h2>
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
                    {YEARS_ME.map(y => <td key={y.key} className={`text-right px-3 ${y.label.includes('E') ? 'text-gray-400 italic' : ''}`}>{s[y.key].toLocaleString('en-IN')}</td>)}
                    <td className={`text-right px-3 font-medium ${s.cagr < 0 ? 'text-red-400' : 'text-green-400'}`}>{s.cagr > 0 ? '+' : ''}{s.cagr}%</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ndtv-border font-bold text-white">
                  <td className="py-2 pr-3">Total</td>
                  <td className="text-right px-3">2,23,700</td><td className="text-right px-3">2,42,200</td>
                  <td className="text-right px-3">2,55,300</td><td className="text-right px-3">2,78,500</td>
                  <td className="text-right px-3 italic text-gray-300">2,86,200</td><td className="text-right px-3 italic text-gray-300">3,30,100</td>
                  <td className="text-right px-3 text-green-400">+6%</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">{meOverview.note}</p>
            <Src text="FICCI-EY 2026, p.12. ~0.8% of India's GDP; 2.75M direct jobs, 10M indirect jobs." page={12} onView={openPDF} />
          </div>
        </div>
      )}

      {/* ════════════════ 2. TELEVISION ════════════════ */}
      {tab === 'Television' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">TV revenue — advertising vs distribution (₹ Cr)</h2>
            <p className="text-xs text-gray-500 mb-3">Linear TV revenues fell for the 4th straight year in 2025.</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={tvRevenue} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')} Cr`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="distribution" name="Distribution" stackId="a" fill="#3b82f6" />
                <Bar dataKey="advertising" name="Advertising" stackId="a" fill="#E8001D" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <Src text="FICCI-EY 2026, p.67" page={67} onView={openPDF} />
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
            <Src text="FICCI-EY 2026, p.66" page={66} onView={openPDF} />
          </div>

          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-sm mb-3">Television — 2025 key metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: 'Weekly reach',        v: `${tvMetrics.weeklyReachMn} Mn`,                              s: 'BARC all-India' },
                { l: 'TV channels',         v: tvMetrics.channels,                                            s: `${tvMetrics.ftaSharePct}% are FTA` },
                { l: 'Avg ARPU',            v: `₹${tvMetrics.arpu}`,                                          s: 'gross of taxes, per subscriber' },
                { l: 'Linear ad growth',    v: `${tvMetrics.linearAdGrowth}%`,                                s: 'ad volumes −11.5%', neg: true },
                { l: 'Subscription rev',    v: `${tvMetrics.subRevGrowth}%`,                                  s: `−${tvMetrics.payTvLossMn}M Pay TV HH lost`, neg: true },
                { l: 'Connected TV ad rev', v: `₹${tvMetrics.ctvAd.toLocaleString('en-IN')} Cr`,             s: `+${tvMetrics.ctvAdGrowth}% (under Digital)` },
                { l: 'Linear + CTV ad',     v: `₹${tvMetrics.linearPlusCtvAd.toLocaleString('en-IN')} Cr`,  s: 'combined, broadly stable' },
                { l: 'Active MSOs',         v: tvMetrics.msos,                                                s: 'Sep 2025' },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className={`text-lg font-bold mt-0.5 ${m.neg ? 'text-red-400' : 'text-white'}`}>{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{tvMetrics.note}</p>
            <Src text="FICCI-EY 2026, p.66–67. BARC viewership data." page={66} onView={openPDF} />
          </div>

          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">TV revenue &amp; projections (₹ Crores)</h2>
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
                    <td className="text-right px-3">{r.advertising.toLocaleString('en-IN')}</td>
                    <td className="text-right px-3">{r.distribution.toLocaleString('en-IN')}</td>
                    <td className="text-right px-3 font-medium not-italic text-white">{r.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Src text="FICCI-EY 2026, p.67. Television CAGR 2025–28: −5%." page={67} onView={openPDF} />
          </div>
        </div>
      )}

      {/* ════════════════ 3. DIGITAL ════════════════ */}
      {tab === 'Digital' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">Digital revenue — advertising vs subscription (₹ Cr)</h2>
            <p className="text-xs text-gray-500 mb-3">First M&amp;E segment to cross ₹1 lakh crore (2025).</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={digitalRevenue} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')} Cr`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="advertising" name="Advertising" stackId="a" fill="#3b82f6" />
                <Bar dataKey="subscription" name="Subscription" stackId="a" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <Src text="FICCI-EY 2026, p.30" page={30} onView={openPDF} />
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Digital subscription mix — 2025 (₹ Crores)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Video OTT', value: digitalMetrics.videoSubRev },
                    { name: 'Audio/Music', value: digitalMetrics.audioSubRev },
                    { name: 'News', value: digitalMetrics.newsSubRev },
                  ]}
                  dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                  label={({ name, value }) => `${name}: ₹${value.toLocaleString('en-IN')} Cr`} labelLine={false}>
                  {['#10b981', '#8b5cf6', '#E8001D'].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')} Cr`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <Src text="FICCI-EY 2026, p.31–32" page={31} onView={openPDF} />
          </div>

          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-sm mb-3">Digital media — 2025 key metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: 'Digital ad growth',    v: `+${digitalMetrics.adGrowth}%`,                              s: `${digitalMetrics.adShareOfTotalAd}% of all India ad revenue` },
                { l: 'E-commerce/POS ads',   v: `₹${digitalMetrics.ecomPosAd.toLocaleString('en-IN')} Cr`,  s: '23% of digital ad revenue' },
                { l: 'Subscription growth',  v: `+${digitalMetrics.subGrowth}%`,                             s: `₹${digitalMetrics.videoSubRev.toLocaleString('en-IN')} Cr video sub rev` },
                { l: 'Video subscriptions',  v: `${digitalMetrics.videoSubscriptionsMn} Mn`,                 s: `${digitalMetrics.videoHouseholdsMn}M paying households` },
                { l: 'Video sub revenue',    v: `₹${digitalMetrics.videoSubRev.toLocaleString('en-IN')} Cr`, s: `+${digitalMetrics.videoSubGrowth}%` },
                { l: 'Paid music subs',      v: `${digitalMetrics.audioPaidMn} Mn`,                          s: `₹${digitalMetrics.audioSubRev.toLocaleString('en-IN')} Cr (first time)` },
                { l: 'Connected TV homes',   v: `${digitalMetrics.ctvHouseholdsMn} Mn`,                      s: `${digitalMetrics.ctvActiveMn}M weekly active` },
                { l: 'News subscriptions',   v: `${digitalMetrics.newsSubscribersMn} Mn`,                    s: `only ₹${digitalMetrics.newsSubRev} Cr revenue` },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className="text-lg font-bold mt-0.5 text-white">{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{digitalMetrics.note}</p>
            <Src text="FICCI-EY 2026, p.30–32" page={30} onView={openPDF} />
          </div>

          {/* VOD */}
          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-sm mb-3">VOD / Video OTT — 2025 highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: 'Video sub revenue',    v: `₹${vodMetrics.videoSubRevCr.toLocaleString('en-IN')} Cr`, s: `+${vodMetrics.videoSubGrowth}% YoY` },
                { l: 'Paid video subs',      v: `${vodMetrics.videoSubscriptionsMn} Mn`,                   s: `${vodMetrics.videoHouseholdsMn}M HH paying` },
                { l: 'IPL 2025 online reach',v: `${vodMetrics.iplOnlineReachMn} Mn`,                       s: 'JioHotstar — total unique viewers' },
                { l: 'IPL peak concurrency', v: `${vodMetrics.iplPeakConcurrencyMn} Mn+`,                  s: 'simultaneous streams (peak)' },
                { l: 'JioHotstar peak subs', v: `${vodMetrics.jiohotstarPeakSubsMn} Mn`,                   s: 'total subscribers at IPL peak' },
                { l: 'Sports/Ent OTT ads',   v: '+34%',                                                    s: 'sports & entertainment OTT ad rev' },
                { l: 'CTV ad rev 2028E',     v: `₹${vodMetrics.ctvAdRev2028ECr.toLocaleString('en-IN')} Cr`, s: `+${vodMetrics.ctvAdGrowth}% CAGR` },
                { l: 'TVOD market 2028E',    v: `₹${vodMetrics.tvodRev2028ECr} Cr`,                        s: 'affordable cinema alternative' },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className="text-lg font-bold mt-0.5 text-white">{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{vodMetrics.note}</p>
            <Src text="FICCI-EY 2026, p.32–33. JioHotstar IPL 2025 data." page={32} onView={openPDF} />
          </div>

          {/* Digital Traffic */}
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Digital traffic — video &amp; social (2025)</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Online video viewers', v: `${onlineVideoMetrics.videoViewersMn} Mn`,    s: `+${onlineVideoMetrics.videoViewersGrowth}% (21M added)` },
                { l: 'Video hrs consumed',   v: `${onlineVideoMetrics.timeSpentVideoBnHrs} Bn hrs`, s: `+${onlineVideoMetrics.timeSpentVideoGrowth}% YoY` },
                { l: 'Social media users',   v: `${onlineVideoMetrics.socialUsersMn} Mn`,      s: `${onlineVideoMetrics.socialHoursBn} Bn hours (+5%)` },
                { l: 'Online news reach',    v: `${onlineVideoMetrics.onlineNewsReachChange}%`, s: 'AI search summaries cited cause', neg: true },
                { l: 'Audio streamers',      v: `${onlineVideoMetrics.audioStreamingUsersMn} Mn`, s: `${onlineVideoMetrics.audioPaidSubsMn}M paid (+37%)` },
                { l: 'Regional content',     v: `${onlineVideoMetrics.regionalContentPct}%`,   s: 'of digital content in regional langs' },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className={`text-lg font-bold mt-0.5 ${m.neg ? 'text-red-400' : 'text-white'}`}>{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{onlineVideoMetrics.note}</p>
            <Src text="FICCI-EY 2026, p.37–39. Sensor Tower, BARC." page={37} onView={openPDF} />
          </div>

          {/* App & Device */}
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">App &amp; device metrics — 2025</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Smartphone users',   v: `${appMetrics.smartphoneUsersMn} Mn`,        s: `${appMetrics.smartphonePctPopulation}% of India's population` },
                { l: 'Phone hours spent',  v: `${appMetrics.phoneHoursTrillion} Tn hrs`,   s: `+${appMetrics.phoneHoursGrowth}% YoY` },
                { l: 'M&E share of phone', v: `${appMetrics.meShareOfPhoneTime}%`,          s: '731 Bn hrs on media' },
                { l: 'Data per smartphone',v: `${appMetrics.dataPerSmartphoneGB} GB/mo`,   s: 'India vs 21 GB global avg' },
                { l: 'CTV households',     v: `${appMetrics.ctvHouseholdsMn} Mn`,           s: 'unique sets connecting monthly' },
                { l: 'CTV weekly active',  v: `${appMetrics.ctvWeeklyActiveMn} Mn`,         s: `up from 30M in 2024 (+${appMetrics.ctvActiveGrowth}%)` },
                { l: 'CTV OTT hours',      v: `${appMetrics.ctvOTTHoursPerMonth} hrs/mo`,  s: `vs ${appMetrics.ctvLinearHoursPerMonth} hrs linear TV` },
                { l: '5G subscriptions',   v: `${appMetrics.sub5GMn} Mn`,                   s: `+${appMetrics.sub5GGrowth}% (32% of telecom)` },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className="text-lg font-bold mt-0.5 text-white">{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{appMetrics.note}</p>
            <Src text="FICCI-EY 2026, p.35–36. Sensor Tower State of Mobile 2026; TRAI; Ericsson Mobility Report." page={35} onView={openPDF} />
          </div>

          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Digital revenue &amp; projections (₹ Crores)</h2>
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
                    <td className="text-right px-3">{r.advertising.toLocaleString('en-IN')}</td>
                    <td className="text-right px-3">{r.subscription.toLocaleString('en-IN')}</td>
                    <td className="text-right px-3 font-medium not-italic text-white">{r.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Src text="FICCI-EY 2026, p.30. Digital media CAGR 2025–28: +14%." page={30} onView={openPDF} />
          </div>
        </div>
      )}

      {/* ════════════════ 4. ADVERTISING ════════════════ */}
      {tab === 'Advertising' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">TV vs Digital advertising (₹ Cr)</h2>
            <p className="text-xs text-gray-500 mb-3">Digital overtook TV in 2022 and now dwarfs it.</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={toYearSeries(adMarket.filter(s => ['Television', 'Digital'].includes(s.segment)), YEARS_AD)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')} Cr`, n]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Digital" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Television" stroke="#E8001D" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <Src text="FICCI-EY 2026, p.234" page={234} onView={openPDF} />
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-3">Ad market mix — 2025 (₹ Cr, total ₹1,50,400 Cr)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={adMarket} dataKey="y2025" nameKey="segment" cx="50%" cy="50%" outerRadius={105}
                  label={({ segment, y2025 }) => y2025 > 6000 ? segment : ''} labelLine={false}>
                  {adMarket.map((s, i) => <Cell key={i} fill={s.segment === 'Digital' ? '#3b82f6' : s.segment === 'Television' ? '#E8001D' : SEG_COLORS[(i + 2) % SEG_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')} Cr`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <Src text="FICCI-EY 2026, p.234" page={234} onView={openPDF} />
          </div>

          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-sm mb-3">Advertising market — 2025 overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: 'Total ad market 2025', v: `₹${adMarketOverview.total2025.toLocaleString('en-IN')} Cr`, s: `+${adMarketOverview.growth2025}% YoY` },
                { l: 'Digital ad revenue',   v: `₹${adMarketOverview.digitalAd2025.toLocaleString('en-IN')} Cr`, s: `${adMarketOverview.digitalShare2025}% of total ads` },
                { l: 'TV ad revenue',        v: `₹${adMarketOverview.tvAd2025.toLocaleString('en-IN')} Cr`,   s: 'declining; CTV separately under Digital' },
                { l: 'Ad growth 2026E',      v: `+${adMarketOverview.growth2026E}%`,                          s: `₹${adMarketOverview.total2026E.toLocaleString('en-IN')} Cr total` },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className="text-lg font-bold mt-0.5 text-white">{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card lg:col-span-2 overflow-x-auto">
            <h2 className="font-semibold text-sm mb-3">Advertising revenue by medium (₹ Crores, gross of taxes)</h2>
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
                    {YEARS_AD.map(y => <td key={y.key} className={`text-right px-3 ${y.label.includes('E') ? 'text-gray-400 italic' : ''}`}>{s[y.key].toLocaleString('en-IN')}</td>)}
                  </tr>
                ))}
                <tr className="border-t-2 border-ndtv-border font-bold text-white">
                  <td className="py-2 pr-3">Total advertising</td>
                  <td className="text-right px-3">71,100</td><td className="text-right px-3">91,400</td>
                  <td className="text-right px-3">1,08,800</td><td className="text-right px-3">1,18,400</td>
                  <td className="text-right px-3">1,32,600</td><td className="text-right px-3">1,50,400</td>
                  <td className="text-right px-3 italic text-gray-300">1,66,200</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">{adMarketOverview.note}</p>
            <Src text={`FICCI-EY 2026, p.234. Digital share: ${adMarketOverview.digitalShare2024}% (2024) → ${adMarketOverview.digitalShare2025}% (2025).`} page={234} onView={openPDF} />
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
            <Src text="FICCI-EY 2026, p.12. EY estimates." page={12} onView={openPDF} />
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">Television trajectory (₹ Cr)</h2>
            <p className="text-xs text-gray-500 mb-3">Declining at −5% CAGR through 2028.</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={tvRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')} Cr`, n]} />
                <Line type="monotone" dataKey="total" name="Total TV" stroke="#E8001D" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <Src text="FICCI-EY 2026, p.67" page={67} onView={openPDF} />
          </div>
          <div className="card">
            <h2 className="font-semibold text-sm mb-1">Digital trajectory (₹ Cr)</h2>
            <p className="text-xs text-gray-500 mb-3">Growing at +14% CAGR to ₹1,64,000 Cr by 2028.</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={digitalRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={TT} formatter={(v, n) => [`₹${v.toLocaleString('en-IN')} Cr`, n]} />
                <Line type="monotone" dataKey="total" name="Total Digital" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <Src text="FICCI-EY 2026, p.30" page={30} onView={openPDF} />
          </div>
          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-sm mb-3">2026E–2028E outlook</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: 'M&E sector 2026E',      v: '₹2,86,200 Cr',                                           s: `+${meOverview.growth2026E}% (8% ex-gaming)` },
                { l: 'M&E sector 2028E',      v: '₹3,30,100 Cr',                                           s: 'US$37.9 Bn, +6% CAGR' },
                { l: 'Digital 2028E',          v: '₹1,64,000 Cr',                                          s: '+14% CAGR' },
                { l: 'Television 2028E',       v: '₹53,500 Cr',                                             s: '−5% CAGR' },
                { l: 'Video OTT subs 2028E',   v: `${vodMetrics.videoSubsMn2028E} Mn`,                      s: `${vodMetrics.videoHH2028E}M homes` },
                { l: 'Video sub rev 2028E',    v: `₹${vodMetrics.videoSubRev2028ECr.toLocaleString('en-IN')} Cr`, s: 'video OTT subscriptions' },
                { l: 'Smartphones 2028E',      v: `${appMetrics.smartphoneUsersMn2028E} Mn`,                s: 'up from 584M in 2025' },
                { l: 'CTV homes 2028E',        v: `${appMetrics.ctvHouseholdsMn2028E} Mn+`,                 s: `${appMetrics.ctvWeeklyActiveMn2028E}M weekly active` },
              ].map(m => (
                <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                  <div className="text-xs text-gray-400">{m.l}</div>
                  <div className="text-lg font-bold mt-0.5 text-white">{m.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.s}</div>
                </div>
              ))}
            </div>
            <Src text="FICCI-EY 2026, p.11–12, 30–33. All projections are EY estimates, INR Crores, gross of taxes." page={11} onView={openPDF} />
          </div>
        </div>
      )}
    </div>
  )
}
