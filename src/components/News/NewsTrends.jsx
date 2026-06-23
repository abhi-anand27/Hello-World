import React, { useState } from 'react'
import { Newspaper, ExternalLink, TrendingUp, Zap, Globe, Tv, Bot, Trash2, Radio } from 'lucide-react'
import { useWebResults, clearWebResults } from '../../api/webResults'

const NEWS_ITEMS = [
  {
    id: 1,
    category: 'Corporate',
    title: 'NDTV FY26 results: revenue ₹528 Cr (+13.5%), losses widen on content & restructuring',
    summary: 'NDTV reported FY26 (Apr 25 – Mar 26) consolidated revenue of ₹528 Cr, up 13.5% YoY, but operating losses widened to -₹261 Cr (OPM -49%) and PAT to -₹323 Cr as the Adani-era investment in newsrooms, digital infrastructure and regional expansion continued ahead of monetisation.',
    date: '2026-05-22',
    impact: 'Strategic',
    tags: ['Results', 'FY26', 'Adani'],
  },
  {
    id: 2,
    category: 'Market',
    title: 'FICCI-EY 2026: Indian M&E sector crosses ₹2.78 lakh Cr, digital now the largest segment',
    summary: 'The FICCI-EY Media & Entertainment 2026 report pegs the industry at ~₹2,78,500 Cr for CY2025, with digital media overtaking television as the single largest segment. Digital advertising and a recovering subscription business drive growth; news remains a small but resilient slice.',
    date: '2026-03-18',
    impact: 'High',
    tags: ['FICCI', 'M&E', 'Digital'],
  },
  {
    id: 3,
    category: 'Audience',
    title: 'NDTV.com ranks #1 English news site on Comscore unique users',
    summary: 'Latest Comscore India data shows NDTV.com leading English news sites on monthly unique users, while the NDTV group ranks #7 across all publisher groups. App engagement (avg mins/user) remains best-in-class, underlining loyal audience depth even where reach trails larger Hindi networks.',
    date: '2026-05-05',
    impact: 'High',
    tags: ['Comscore', 'Unique Users', 'Digital'],
  },
  {
    id: 4,
    category: 'Digital',
    title: 'NDTV India YouTube views surge past 2,900 Mn/month on viral news cycles',
    summary: 'Databeing/Playboard tracking shows NDTV India\'s YouTube monthly views spiking to the top of the Hindi news pack in early 2026, with NDTV 24x7 also leading English broadcaster channels in several months. Short-form and live coverage are the primary drivers.',
    date: '2026-04-12',
    impact: 'Medium',
    tags: ['YouTube', 'NDTV India', 'Video'],
  },
  {
    id: 5,
    category: 'Technology',
    title: 'AI newsrooms scale up: NDTV expands automated briefs and multilingual dubbing',
    summary: 'Following industry moves by Reuters and AP, NDTV has expanded AI-assisted workflows — automated briefs, multilingual dubbing and financial/sports summaries — across its Hindi and regional arms, targeting double-digit Cr in annual production savings.',
    date: '2026-02-28',
    impact: 'Medium',
    tags: ['AI', 'Newsroom', 'Cost'],
  },
  {
    id: 6,
    category: 'Competition',
    title: 'JioStar consolidates distribution muscle; news players recalibrate carriage strategy',
    summary: 'The merged JioStar entity continues to reshape distribution economics across linear and OTT. News broadcasters, including NDTV, are recalibrating carriage and bundling strategies as the platform\'s scale influences placement and ad inventory.',
    date: '2026-01-20',
    impact: 'High',
    tags: ['JioStar', 'Competition', 'Distribution'],
  },
  {
    id: 7,
    category: 'Regulation',
    title: 'TRAI carriage-fee framework: clarity expected to ease news broadcaster costs',
    summary: 'A revised TRAI framework on carriage fees paid by news broadcasters to cable/DTH operators is expected to bring cost relief industry-wide. A favourable outcome would directly aid loss-making news networks managing high distribution costs.',
    date: '2026-04-02',
    impact: 'Medium',
    tags: ['TRAI', 'Regulation', 'Carriage'],
  },
  {
    id: 8,
    category: 'Digital',
    title: 'Connected TV crosses 68 Mn homes — premium news inventory opportunity grows',
    summary: 'CTV penetration in India has crossed ~68 million homes per FICCI-EY 2026, with news among the top genres. CPMs on CTV remain multiples of linear TV, opening a premium inventory pool that NDTV is targeting via its apps and OTT presence.',
    date: '2026-03-30',
    impact: 'High',
    tags: ['CTV', 'OTT', 'Inventory'],
  },
]

const CATEGORIES = ['All', 'Corporate', 'Market', 'Technology', 'Regulation', 'Competition', 'Digital', 'Audience', 'Events']
const IMPACT_CONFIG = {
  High: 'badge-red',
  Medium: 'badge-yellow',
  Strategic: 'bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full font-medium',
}
const CAT_CONFIG = {
  Corporate: 'bg-blue-500/20 text-blue-400',
  Market: 'bg-green-500/20 text-green-400',
  Technology: 'bg-purple-500/20 text-purple-400',
  Regulation: 'bg-yellow-500/20 text-yellow-400',
  Competition: 'bg-red-500/20 text-red-400',
  Digital: 'bg-cyan-500/20 text-cyan-400',
  Audience: 'bg-orange-500/20 text-orange-400',
  Events: 'bg-pink-500/20 text-pink-400',
}

function timeAgo(iso) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

/* ── Live web feed populated by the Gemini chatbot (with permission) ──────── */
function WebFeed() {
  const results = useWebResults()
  return (
    <div className="card border border-blue-900/40">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Radio size={15} className="text-green-400" /> Live from the web
          <span className="text-[10px] font-normal text-gray-500">pulled by the Gemini analyst, with permission</span>
        </h2>
        {results.length > 0 && (
          <button onClick={clearWebResults} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition">
            <Trash2 size={12} /> Clear
          </button>
        )}
      </div>
      {results.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bot size={26} className="mx-auto mb-2 opacity-40" />
          <p className="text-xs">No live web data yet.</p>
          <p className="text-[11px] mt-1">Open the Gemini analyst (bottom-right), ask something current (e.g. “latest NDTV news”) and allow web search. Sources appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(r => (
            <div key={r.id} className="bg-ndtv-dark border border-ndtv-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium flex items-center gap-1"><Globe size={9} /> Web</span>
                <span className="text-xs font-medium text-white truncate">{r.query}</span>
                <span className="text-[10px] text-gray-500 ml-auto flex-shrink-0">{timeAgo(r.ts)}</span>
              </div>
              {r.summary && <p className="text-[12px] text-gray-300 leading-relaxed mb-2">{r.summary}{r.summary.length >= 280 ? '…' : ''}</p>}
              <div className="space-y-0.5">
                {r.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 truncate">
                    <ExternalLink size={10} className="flex-shrink-0" /> {s.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function NewsTrends() {
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filtered = filter === 'All' ? NEWS_ITEMS : NEWS_ITEMS.filter(n => n.category === filter)

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Newspaper size={20} /> News & Industry Trends</h1>
        <p className="text-sm text-gray-400 mt-0.5">Latest developments in Indian TV & Digital news business · curated to {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Tracked Items', value: String(NEWS_ITEMS.length), icon: Zap, color: 'text-yellow-400' },
          { label: 'High Impact', value: String(NEWS_ITEMS.filter(n => n.impact === 'High').length), icon: TrendingUp, color: 'text-red-400' },
          { label: 'Digital / Audience', value: String(NEWS_ITEMS.filter(n => ['Digital', 'Audience'].includes(n.category)).length), icon: Globe, color: 'text-blue-400' },
          { label: 'TV / Competition', value: String(NEWS_ITEMS.filter(n => ['Competition', 'Regulation'].includes(n.category)).length), icon: Tv, color: 'text-orange-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <Icon size={20} className={color} />
            <div>
              <div className="text-xl font-bold">{value}</div>
              <div className="text-xs text-gray-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Live web feed (Gemini) */}
      <WebFeed />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === cat ? 'bg-ndtv-red text-white' : 'bg-ndtv-border/50 text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Curated news cards */}
      <div className="space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            className="card border border-ndtv-border/60 hover:border-ndtv-border cursor-pointer transition-all"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_CONFIG[item.category] || 'bg-gray-500/20 text-gray-400'}`}>
                    {item.category}
                  </span>
                  <span className={IMPACT_CONFIG[item.impact] || 'badge-yellow'}>
                    {item.impact} Impact
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h3 className="font-semibold text-sm leading-snug">{item.title}</h3>
                {expanded === item.id && (
                  <p className="text-sm text-gray-300 mt-2 leading-relaxed">{item.summary}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-xs bg-ndtv-border/40 text-gray-400 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Newspaper size={32} className="mx-auto mb-3 opacity-30" />
          <p>No news items in this category</p>
        </div>
      )}
    </div>
  )
}
