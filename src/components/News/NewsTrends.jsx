import React, { useState } from 'react'
import { Newspaper, ExternalLink, TrendingUp, Zap, Globe, Tv } from 'lucide-react'

const NEWS_ITEMS = [
  {
    id: 1,
    category: 'Corporate',
    title: 'Adani Group consolidates NDTV stake to 64.7%, sets 5-year growth roadmap',
    summary: 'Following regulatory approvals, Adani Media Network has increased its holding in NDTV to 64.7%. Management has outlined a ₹500 Cr investment plan over FY25-29 for digital infrastructure and newsroom technology.',
    date: '2024-11-12',
    impact: 'Strategic',
    tags: ['Adani', 'Ownership', 'Investment'],
  },
  {
    id: 2,
    category: 'Market',
    title: 'Indian TV ad market expected to cross ₹5,100 Cr in FY25 — Madison Report',
    summary: 'Madison Media\'s annual report forecasts 6.3% growth in TV news advertising for FY25, driven by election-related spending and FMCG category recovery. Digital news advertising projected to grow 28% to ₹7,200 Cr.',
    date: '2024-12-05',
    impact: 'High',
    tags: ['Ad Market', 'Forecast', 'Madison'],
  },
  {
    id: 3,
    category: 'Technology',
    title: 'AI-powered newsrooms: Reuters, AP cut production costs 30% — NDTV exploring',
    summary: 'Leading global news agencies have deployed AI for automated briefs, multilingual dubbing, and sports/financial news generation. NDTV is reportedly in advanced discussions with two AI vendors for its Hindi content arm, potentially saving ₹25-30 Cr annually.',
    date: '2025-01-08',
    impact: 'High',
    tags: ['AI', 'Technology', 'Cost Savings'],
  },
  {
    id: 4,
    category: 'Regulation',
    title: 'TRAI consultation paper on news broadcaster carriage fee — outcome awaited',
    summary: 'TRAI has issued a consultation paper proposing cap on carriage fees paid by news broadcasters to cable/DTH operators. A favorable ruling could save news broadcasters ₹200-350 Cr industry-wide annually.',
    date: '2025-02-14',
    impact: 'Medium',
    tags: ['TRAI', 'Regulation', 'Carriage Fee'],
  },
  {
    id: 5,
    category: 'Competition',
    title: 'JioStar merger completes — Network18 News channels get Reliance muscle',
    summary: 'The merger of Star India and Reliance\'s Jio operations creates JioStar, potentially the largest media conglomerate in India. CNN-News18, News18 India and regional news channels now benefit from Reliance\'s ₹2L+ Cr balance sheet and JioCinema OTT platform.',
    date: '2025-01-22',
    impact: 'High',
    tags: ['JioStar', 'Competition', 'Network18'],
  },
  {
    id: 6,
    category: 'Digital',
    title: 'Connected TV viewership in India doubles YoY — news content among top genres',
    summary: 'CTV (Smart TV + Fire Stick + Apple TV etc.) viewership in India crossed 40 million households in 2024, doubling from FY23. News is the third-most-watched genre on CTV after entertainment and sports. CPMs on CTV are 5-8x higher than linear TV.',
    date: '2025-01-30',
    impact: 'High',
    tags: ['CTV', 'OTT', 'Digital'],
  },
  {
    id: 7,
    category: 'Audience',
    title: 'Gen Z news consumption shifts to YouTube Shorts, Instagram — traditional TV declines',
    summary: 'BARC data shows 18-34 year old news consumption on traditional TV has fallen 18% over 3 years. The same cohort\'s news consumption on YouTube and Instagram has grown 64%. NDTV\'s YouTube channel has 14.2M subscribers vs Aaj Tak\'s 32M.',
    date: '2025-02-03',
    impact: 'Medium',
    tags: ['Gen Z', 'YouTube', 'Audience Shift'],
  },
  {
    id: 8,
    category: 'Events',
    title: 'Bihar Assembly Elections 2025 — news channel spending window opens',
    summary: 'Bihar Assembly Elections scheduled for late 2025 will provide significant advertising uplift for news channels. Historical data shows 35-45% revenue spike during major state elections. NDTV Bihar-focused content strategy yet to be announced.',
    date: '2025-02-18',
    impact: 'High',
    tags: ['Elections', 'Bihar', 'Revenue Uplift'],
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

export default function NewsTrends() {
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filtered = filter === 'All' ? NEWS_ITEMS : NEWS_ITEMS.filter(n => n.category === filter)

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Newspaper size={20} /> News & Industry Trends</h1>
        <p className="text-sm text-gray-400 mt-0.5">Latest developments in Indian TV & Digital news business</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Market-Moving News', value: '8', icon: Zap, color: 'text-yellow-400' },
          { label: 'High Impact Items', value: '5', icon: TrendingUp, color: 'text-red-400' },
          { label: 'Digital Trends', value: '3', icon: Globe, color: 'text-blue-400' },
          { label: 'TV Industry', value: '4', icon: Tv, color: 'text-orange-400' },
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

      {/* News cards */}
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
