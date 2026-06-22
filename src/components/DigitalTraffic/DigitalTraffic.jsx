import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from 'recharts'
import { Activity, Globe, Youtube, Smartphone, Clock, BarChart3 } from 'lucide-react'
import { digitalTraffic as DT } from '../../data/digitalTraffic'

const TABS = ['Comscore (CS)', 'Google Analytics (GA)', 'YouTube & Social']
const TT = { background: '#16213e', border: '1px solid #0f3460', borderRadius: 8, fontSize: 12 }
const NDTV_RED = '#E8001D'
const SERIES_COLORS = ['#E8001D', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']
// short month label e.g. 2025-10 -> Oct'25
function ml(m) {
  if (typeof m !== 'string' || !m.includes('-')) return m
  const [y, mo] = m.split('-')
  const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${names[+mo] || mo}'${y.slice(2)}`
}

function Foot({ notes }) {
  if (!notes || !notes.length) return null
  return (
    <div className="mt-3 pt-2 border-t border-ndtv-border/40 space-y-0.5">
      {notes.map((n, i) => (
        <p key={i} className="text-[11px] text-gray-500 leading-snug">
          <span className="text-gray-600">▪</span> {n}
        </p>
      ))}
    </div>
  )
}

function SubCard({ title, subtitle, icon: Icon, children, notes, span }) {
  return (
    <div className={`card ${span ? 'lg:col-span-2' : ''}`}>
      <div className="flex items-start gap-2 mb-1">
        {Icon && <Icon size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />}
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
      <Foot notes={notes} />
    </div>
  )
}

// horizontal ranking bar (latest month), NDTV highlighted
function RankBar({ data, unit = '', height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: '#cbd5e1' }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#f1f5f9' }} width={190} interval={0} />
        <Tooltip contentStyle={TT} formatter={v => [`${v}${unit}`, 'Value']} cursor={{ fill: '#ffffff08' }} />
        <Bar dataKey="value" radius={[0, 3, 3, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.ndtv ? NDTV_RED : '#3b82f6'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// multi-line trend; only the FIRST ndtv-named series gets red, all others get palette colors
function TrendLines({ data, series, unit = '', height = 260 }) {
  const firstNdtvIdx = series.findIndex(s => s.toLowerCase().includes('ndtv'))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
        <XAxis dataKey="month" tickFormatter={ml} tick={{ fontSize: 9, fill: '#9ca3af' }} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
        <Tooltip contentStyle={TT} labelFormatter={ml} formatter={(v, n) => [`${v}${unit}`, n]} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        {series.map((s, i) => {
          const isNdtv = i === firstNdtvIdx
          // non-NDTV series cycle through the non-red palette so none repeat red or render undefined
          const pool = SERIES_COLORS.slice(1)
          const color = isNdtv ? NDTV_RED : pool[i % pool.length]
          return (
            <Line key={s} type="monotone" dataKey={s}
              stroke={color}
              strokeWidth={isNdtv ? 2.6 : 1.5} dot={false} />
          )
        })}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function DigitalTraffic() {
  const [tab, setTab] = useState('Comscore (CS)')

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Activity size={20} /> Digital Traffic</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          NDTV vs competition across <span className="text-gray-300">Comscore, Google Analytics, YouTube &amp; Social</span>
          <span className="text-gray-500"> · monthly unique users, time-spent, app &amp; video metrics</span>
        </p>
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

      {tab === 'Comscore (CS)' && <ComscoreSection />}
      {tab === 'Google Analytics (GA)' && <GASection />}
      {tab === 'YouTube & Social' && <YouTubeSection />}
    </div>
  )
}

/* ════════════════════════ COMSCORE (CS) ════════════════════════ */
function ComscoreSection() {
  const pubBlocks = [
    { key: 'csGroup', title: 'Publisher Groups — Unique Users', icon: BarChart3 },
    { key: 'csEnglish', title: 'English News Sites — Unique Users', icon: Globe },
    { key: 'csHindi', title: 'Hindi News Sites — Unique Users', icon: Globe },
    { key: 'csProfit', title: 'Business News Sites — Unique Users', icon: Globe },
    { key: 'csMarathi', title: 'Marathi News Sites — Unique Users', icon: Globe },
  ]
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* NDTV headline strip */}
      <div className="card lg:col-span-2">
        <h3 className="font-semibold text-sm mb-3">NDTV — Comscore snapshot (latest month)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: 'Group rank', v: `#${DT.csGroup.ranking.findIndex(r => r.ndtv) + 1}`, s: `${ndtvVal(DT.csGroup)} Mn users · ${ml(DT.csGroup.latestMonth)}` },
            { l: 'English rank', v: `#${DT.csEnglish.ranking.findIndex(r => r.ndtv) + 1}`, s: `${ndtvVal(DT.csEnglish)} Mn · NDTV.com` },
            { l: 'Hindi rank', v: `#${DT.csHindi.ranking.findIndex(r => r.ndtv) + 1}`, s: `${ndtvVal(DT.csHindi)} Mn · NDTV.in` },
            { l: 'App engagement', v: `${DT.csAppMins.rows.find(r => r.ndtv)?.avgMins} min`, s: 'Avg mins/user — #1 on engagement' },
          ].map(m => (
            <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
              <div className="text-xs text-gray-400">{m.l}</div>
              <div className="text-lg font-bold mt-0.5 text-white">{m.v}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{m.s}</div>
            </div>
          ))}
        </div>
        <Foot notes={['Comscore India unique users (millions). NDTV highlighted in red across all charts below.']} />
      </div>

      {pubBlocks.map(b => {
        const d = DT[b.key]
        return (
          <React.Fragment key={b.key}>
            <SubCard title={b.title} subtitle={`Latest-month ranking · ${ml(d.latestMonth)}`} icon={b.icon} notes={d.footnotes}>
              <RankBar data={d.ranking} unit=" Mn" />
            </SubCard>
            <SubCard title={`${b.title.split(' —')[0]} — trend`} subtitle="NDTV vs top competitors (monthly, Mn)" icon={Activity} notes={['Monthly unique users (millions), Comscore India.']}>
              <TrendLines data={d.trend} series={d.trendSeries} unit=" Mn" />
            </SubCard>
          </React.Fragment>
        )
      })}

      {/* App unique users */}
      <SubCard title="News Apps — Unique Users" subtitle={`Comscore app reach (000) · ${ml(DT.csApp.latestMonth)}`} icon={Smartphone} notes={DT.csApp.footnotes}>
        <RankBar data={DT.csApp.ranking} unit="k" />
      </SubCard>
      <SubCard title="News Apps — reach trend" subtitle="NDTV vs top apps (000s)" icon={Activity} notes={['Unique app users in thousands, Comscore India.']}>
        <TrendLines data={DT.csApp.trend} series={DT.csApp.trendSeries} unit="k" />
      </SubCard>

      {/* App engagement (mins) */}
      <SubCard title="App Engagement — Avg Mins / User" subtitle={`Comscore · ${DT.csAppMins.month}`} icon={Clock} notes={DT.csAppMins.footnotes}>
        <RankBar data={DT.csAppMins.rows.map(r => ({ name: r.name, value: r.avgMins, ndtv: r.ndtv }))} unit=" min" />
      </SubCard>

      {/* Time spent group */}
      <SubCard title="Time Spent — Group Websites" subtitle="Million minutes, NDTV vs peers (monthly)" icon={Clock} notes={DT.csTimespent.footnotes}>
        <TrendLines data={DT.csTimespent.trend} series={DT.csTimespent.trendSeries} unit=" Mn min" />
      </SubCard>

      {/* Internal NDTV CS — all 4 series are NDTV properties, use distinct palette (no competitor red) */}
      <SubCard title="NDTV — Comscore by property" subtitle="NDTV Group / .com / .in / Profit (Mn users)" icon={Activity} span notes={DT.csInternal.footnotes}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={DT.csInternal.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
            <XAxis dataKey="month" tickFormatter={ml} tick={{ fontSize: 9, fill: '#9ca3af' }} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <Tooltip contentStyle={TT} labelFormatter={ml} formatter={(v, n) => [`${v} Mn`, n]} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {DT.csInternal.series.map((s, i) => (
              <Line key={s} type="monotone" dataKey={s}
                stroke={[NDTV_RED, '#3b82f6', '#f59e0b', '#10b981'][i] || SERIES_COLORS[i % SERIES_COLORS.length]}
                strokeWidth={i === 0 ? 2.6 : 1.8} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </SubCard>

      {/* Snapshot ranking */}
      <SubCard title="CS Ranking Snapshot" subtitle={`Unique users by genre · ${ml(DT.csSnapshot.month)}`} icon={BarChart3} span notes={DT.csSnapshot.footnotes}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[['Group', DT.csSnapshot.group], ['English', DT.csSnapshot.english], ['Hindi', DT.csSnapshot.hindi], ['Business', DT.csSnapshot.business]].map(([lbl, rows]) => (
            <div key={lbl}>
              <div className="text-xs text-gray-400 mb-1 font-medium">{lbl}</div>
              <RankBar data={rows} unit=" Mn" height={Math.max(140, rows.length * 22)} />
            </div>
          ))}
        </div>
      </SubCard>
    </div>
  )
}
function ndtvVal(block) {
  const r = block.ranking.find(x => x.ndtv)
  return r ? r.value : '—'
}

/* ════════════════════════ GOOGLE ANALYTICS (GA) ════════════════════════ */
function GASection() {
  const fy = DT.gaFY
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* FY KPI strip */}
      <div className="card lg:col-span-2">
        <h3 className="font-semibold text-sm mb-3">NDTV Group — GA4 yearly summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: 'Users FY24-25', v: `${fy[1].users.toLocaleString('en-IN')} Mn`, g: `+${DT.gaFYGrowth.users}%` },
            { l: 'Sessions FY24-25', v: `${fy[1].sessions.toLocaleString('en-IN')} Mn`, g: `${DT.gaFYGrowth.sessions}%` },
            { l: 'Pageviews FY24-25', v: `${fy[1].pageviews.toLocaleString('en-IN')} Mn`, g: `+${DT.gaFYGrowth.pageviews}%` },
            { l: 'Latest month users', v: `${DT.gaNDTV.trend.at(-1).users} Mn`, g: ml(DT.gaNDTV.trend.at(-1).month) },
          ].map(m => {
            const neg = String(m.g).trim().startsWith('-')
            return (
              <div key={m.l} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
                <div className="text-xs text-gray-400">{m.l}</div>
                <div className="text-lg font-bold mt-0.5 text-white">{m.v}</div>
                <div className={`text-[11px] mt-0.5 ${m.g.includes('%') ? (neg ? 'text-red-400' : 'text-green-400') : 'text-gray-500'}`}>{m.g}{m.g.includes('%') ? ' YoY' : ''}</div>
              </div>
            )
          })}
        </div>
        <Foot notes={DT.gaNDTV.footnotes} />
      </div>

      <SubCard title="NDTV Group — Users & Pageviews" subtitle="GA4 monthly (millions)" icon={Activity} span notes={DT.gaNDTV.footnotes}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={DT.gaNDTV.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
            <XAxis dataKey="month" tickFormatter={ml} tick={{ fontSize: 9, fill: '#9ca3af' }} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <Tooltip contentStyle={TT} labelFormatter={ml} formatter={(v, n) => [`${v} Mn`, n]} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="users" name="Users" stroke={NDTV_RED} strokeWidth={2.6} dot={false} />
            <Line type="monotone" dataKey="pageviews" name="Pageviews" stroke="#3b82f6" strokeWidth={1.8} dot={false} />
            <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </SubCard>

      <SubCard title="NDTV — Users by property" subtitle="NDTV.com / NDTV.in / Profit (Mn)" icon={Globe} notes={['GA4 monthly users (millions) by property.']}>
        <TrendLines data={DT.gaNDTV.trend} series={['comUsers', 'inUsers', 'profitUsers']} unit=" Mn" />
        <p className="text-[11px] text-gray-500 mt-1">Legend: comUsers = NDTV.com · inUsers = NDTV.in · profitUsers = NDTV Profit</p>
      </SubCard>

      <SubCard title="Regional editions — Users" subtitle="MPCG / Rajasthan / Marathi (Mn)" icon={Globe} notes={DT.gaRegional.footnotes}>
        <TrendLines data={DT.gaRegional.trend} series={DT.gaRegional.series} unit=" Mn" />
      </SubCard>

      <SubCard title="Apps — Users by edition" subtitle="GA monthly active users" icon={Smartphone} notes={DT.gaApps.footnotes}>
        <RankBar data={DT.gaApps.editions.map(e => ({ name: e.name, value: e.value, ndtv: false }))} />
      </SubCard>

      <SubCard title="Apps — platform & engagement" subtitle="Android vs iOS users · avg session by vertical" icon={Smartphone} notes={['GA app users by OS (latest month) and average session length (mins) by app vertical.']}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Users by OS</div>
            <RankBar data={DT.gaApps.platform.map(p => ({ name: p.name, value: p.users, ndtv: false }))} height={140} />
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Avg session (mins)</div>
            <RankBar data={DT.gaApps.session.map(s => ({ name: s.name, value: s.mins, ndtv: s.name.includes('TV') }))} unit=" min" height={140} />
          </div>
        </div>
      </SubCard>

      <SubCard title="Apps — content vertical split" subtitle="Screen views by vertical (latest month)" icon={BarChart3} span notes={['GA app screen views by content vertical (latest month).']}>
        <RankBar data={DT.gaApps.vertical.map(v => ({ name: v.name, value: v.value, ndtv: v.name === 'News' }))} height={220} />
      </SubCard>
    </div>
  )
}

/* ════════════════════════ YOUTUBE & SOCIAL ════════════════════════ */
const SOCIAL_PLATFORMS = [
  { key: 'yt', label: 'YouTube' },
  { key: 'fb', label: 'Facebook' },
  { key: 'insta', label: 'Instagram' },
  { key: 'x', label: 'X (Twitter)' },
  { key: 'wa', label: 'WhatsApp' },
]
function YouTubeSection() {
  const yt = DT.ytNative.trend
  const [platform, setPlatform] = useState('yt')
  const platMeta = SOCIAL_PLATFORMS.find(p => p.key === platform)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SubCard title="NDTV YouTube — Views trend" subtitle="NDTV / NDTV India / NDTV Profit (Mn views)" icon={Youtube} span notes={DT.ytNative.footnotes}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yt}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" vertical={false} />
            <XAxis dataKey="month" tickFormatter={ml} tick={{ fontSize: 9, fill: '#9ca3af' }} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <Tooltip contentStyle={TT} labelFormatter={ml} formatter={(v, n) => [`${v} Mn`, n]} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="ndtvViews" name="NDTV 24x7" stroke={NDTV_RED} strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="indiaViews" name="NDTV India" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="profitViews" name="NDTV Profit" stroke="#10b981" strokeWidth={1.8} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </SubCard>

      <SubCard title="YouTube — English news views" subtitle={`Channel views (Mn) · ${ml(DT.ytComp.month)}`} icon={Youtube} notes={DT.ytComp.footnotes}>
        <RankBar data={DT.ytComp.english} unit=" Mn" height={220} />
      </SubCard>
      <SubCard title="YouTube — Hindi news views" subtitle={`Channel views (Mn) · ${ml(DT.ytComp.month)}`} icon={Youtube} notes={DT.ytComp.footnotes}>
        <RankBar data={DT.ytComp.hindi} unit=" Mn" height={260} />
      </SubCard>
      <SubCard title="YouTube — Business news views" subtitle={`Channel views (Mn) · ${ml(DT.ytComp.month)}`} icon={Youtube} notes={DT.ytComp.footnotes}>
        <RankBar data={DT.ytComp.business} unit=" Mn" height={200} />
      </SubCard>
      <SubCard title="YouTube — English news (historical)" subtitle="NDTV 24x7 vs CNN-News18 vs India Today (Mn views)" icon={Activity} notes={DT.ytPlayboard.footnotes}>
        <TrendLines data={DT.ytPlayboard.trend} series={DT.ytPlayboard.series} unit=" Mn" />
        <p className="text-[11px] text-gray-500 mt-1">Legend: ndtv = NDTV 24x7 · cnn = CNN-News18 · indiaToday = India Today</p>
      </SubCard>

      {/* Social platform selector */}
      <div className="card lg:col-span-2">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Globe size={15} className="text-gray-400" /> Social followers by platform
          </h3>
          <div className="flex gap-1 bg-ndtv-dark border border-ndtv-border rounded-lg p-1 flex-wrap">
            {SOCIAL_PLATFORMS.map(p => (
              <button key={p.key} onClick={() => setPlatform(p.key)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${platform === p.key ? 'tab-active' : 'tab-inactive'}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500">{platMeta.label} followers (Mn) · NDTV vs peers · as of {ml(DT.social.updated)}</p>
      </div>
      {[['english', 'English channels'], ['hindi', 'Hindi channels'], ['business', 'Business channels']].map(([key, lbl]) => {
        const rows = DT.social[key]
          .map(c => ({ name: c.channel, value: c[platform] ?? 0, ndtv: c.ndtv }))
          .filter(r => r.value > 0)
          .sort((a, b) => b.value - a.value)
        return (
          <SubCard key={key} title={`${platMeta.label} — ${lbl}`} subtitle={`Followers (Mn) · ${ml(DT.social.updated)}`} icon={Youtube} notes={DT.social.footnotes}>
            {rows.length
              ? <RankBar data={rows} unit=" Mn" height={Math.max(160, rows.length * 26)} />
              : <p className="text-xs text-gray-500 py-8 text-center">No {platMeta.label} data reported for these channels.</p>}
          </SubCard>
        )
      })}

      {/* Social platform table */}
      <SubCard title="Social footprint — NDTV vs key peers" subtitle="Followers in millions across platforms" icon={Globe} span notes={DT.social.footnotes}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-ndtv-border">
                <th className="text-left py-2 pr-3">Channel</th>
                <th className="text-left py-2 pr-3">Category</th>
                <th className="text-right px-3">YouTube</th>
                <th className="text-right px-3">Facebook</th>
                <th className="text-right px-3">Instagram</th>
                <th className="text-right px-3">X</th>
                <th className="text-right px-3">WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ndtv-border/50">
              {[
                ...DT.social.english.map(c => ({ ...c, _cat: 'English' })),
                ...DT.social.hindi.map(c => ({ ...c, _cat: 'Hindi' })),
                ...DT.social.business.map(c => ({ ...c, _cat: 'Business' })),
              ].map(c => (
                <tr key={`${c._cat}-${c.channel}`} className={`hover:bg-ndtv-border/20 ${c.ndtv ? 'bg-ndtv-red/5' : ''}`}>
                  <td className="py-1.5 pr-3 font-medium text-white">
                    {c.channel}{c.ndtv && <span className="ml-1 badge-red">NDTV</span>}
                  </td>
                  <td className="py-1.5 pr-3 text-gray-400">{c._cat}</td>
                  <td className="text-right px-3">{c.yt ?? '—'}</td>
                  <td className="text-right px-3">{c.fb ?? '—'}</td>
                  <td className="text-right px-3">{c.insta ?? '—'}</td>
                  <td className="text-right px-3">{c.x ?? '—'}</td>
                  <td className="text-right px-3">{c.wa ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubCard>
    </div>
  )
}
