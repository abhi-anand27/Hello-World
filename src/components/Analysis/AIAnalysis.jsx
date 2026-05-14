import React, { useState, useRef, useEffect } from 'react'
import { BrainCircuit, Send, User, Bot, Sparkles, ChevronDown } from 'lucide-react'

const SUGGESTED_PROMPTS = [
  { label: 'Revenue Analysis', prompt: 'Analyze NDTV\'s revenue growth trajectory for TV and Digital business. What are the key drivers and risks?' },
  { label: 'Margin Improvement', prompt: 'How can NDTV improve its EBITDA margin from 11.9% to 18%+ over the next 3 years? Outline specific levers.' },
  { label: 'Digital Profitability', prompt: 'What is NDTV\'s path to digital profitability? Break down the steps needed to achieve EBITDA breakeven in the Convergence business.' },
  { label: 'Competitive Strategy', prompt: 'NDTV is losing market share to Aaj Tak and Republic TV. What should be the competitive strategy to recapture share?' },
  { label: 'Market Opportunity', prompt: 'Assess the CTV and OTT opportunity for NDTV. What is the potential revenue and investment required?' },
  { label: 'Election Revenue', prompt: 'Analyze the expected revenue impact of the Bihar 2025 elections and upcoming election cycle on NDTV.' },
  { label: 'AI in Newsroom', prompt: 'What is the business case for AI implementation in NDTV\'s newsroom? Estimate cost savings and revenue opportunities.' },
  { label: 'Adani Synergies', prompt: 'What are the potential synergies between NDTV and the Adani Group? How can these be monetized?' },
]

const INITIAL_CONTEXT = `You are analyzing NDTV's financial dashboard. Here is the key context:

**NDTV Group (FY24 Actuals):**
- Consolidated Revenue: ₹973 Cr (+5.9% YoY)
- EBITDA: ₹116 Cr (+26.1% YoY), Margin: 11.9%
- TV Business Revenue: ₹670 Cr, EBITDA Margin: 16.1%
- Digital/Convergence Revenue: ₹303 Cr, EBITDA: ₹8 Cr (near breakeven)
- Digital MAU: 235M+, YoY growth: +22%

**Market Context:**
- TV News Ad Market: ₹4,800 Cr (+7.2% YoY)
- Digital News Ad Market: ₹5,600 Cr (+22.4% YoY)
- NDTV viewership share: ~7.8% (declining from 8.9% in Q1 FY23)
- Key competitors: Aaj Tak (10.8% share), Republic TV (11.4% primetime)

**Ownership:** Adani Group holds 64.7% stake.`

function Message({ role, content }) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'justify-end' : ''}`}>
      {role === 'assistant' && (
        <div className="w-7 h-7 rounded-full bg-ndtv-red/20 border border-ndtv-red/40 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={14} className="text-ndtv-red" />
        </div>
      )}
      <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
        role === 'user'
          ? 'bg-ndtv-red/20 border border-ndtv-red/30 text-white'
          : 'bg-ndtv-border/50 border border-ndtv-border text-gray-200'
      }`}>
        {content.split('\n').map((line, i) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return <div key={i} className="font-semibold text-white mt-1">{line.replace(/\*\*/g, '')}</div>
          }
          if (line.startsWith('- ') || line.startsWith('• ')) {
            return <div key={i} className="flex gap-2 mt-1"><span className="text-ndtv-red mt-0.5">•</span><span>{line.slice(2)}</span></div>
          }
          if (line.match(/^\d+\./)) {
            return <div key={i} className="mt-1 pl-1">{line}</div>
          }
          if (line === '') return <div key={i} className="h-2" />
          return <span key={i}>{line} </span>
        })}
      </div>
      {role === 'user' && (
        <div className="w-7 h-7 rounded-full bg-ndtv-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={14} className="text-gray-400" />
        </div>
      )}
    </div>
  )
}

// Simple rule-based analyst response engine (no API key required)
function generateAnalysis(question) {
  const q = question.toLowerCase()

  if (q.includes('revenue') && (q.includes('growth') || q.includes('trajec') || q.includes('driver'))) {
    return `**NDTV Revenue Growth Analysis**

**TV Business (₹670 Cr, FY24):**
- Advertising (82% of TV revenue) is the primary driver — tied to GRP/TRP performance
- Q3 seasonality (Oct-Dec) consistently delivers 25-30% higher revenue than Q1
- NDTV Profit's business content is premium ad inventory — ARPU higher than news peers
- Risk: Viewership share declining from 8.9% to 7.8% puts pricing power at risk

**Digital/Convergence (₹303 Cr, FY24):**
- Digital advertising (+11.2% YoY) driven by video ads on NDTV apps & web
- Subscription is nascent (19% of digital revenue) but has high margin potential
- MAU growth of 22% is outpacing revenue growth — monetization gap to close

**Key Growth Levers:**
1. Recover viewership share via content investment (impact: ₹40-60 Cr incremental ad revenue)
2. CTV inventory launch — premium CPMs of ₹800-1200 vs ₹150-180 linear
3. Digital subscription product with Adani Group bundling
4. Bihar election cycle FY26 — estimated ₹25-35 Cr uplift for NDTV

**Key Risks:**
- Republic TV primetime dominance limiting ad yield improvement
- Digital ad revenue competition from Google, Meta eating publisher share
- Talent stability post-ownership transition`
  }

  if (q.includes('margin') || q.includes('ebitda') || q.includes('profitab')) {
    return `**NDTV Margin Improvement Roadmap**

Current EBITDA margin: 11.9% consolidated (TV: 16.1%, Digital: 2.6%)
Target: 18%+ by FY27

**Levers to Improve TV Margin (16.1% → 20%):**
1. **AI Newsroom Implementation** — Automate Hindi dubbing, captions, summaries
   - Estimated savings: ₹20-28 Cr/year (15-20% of content costs)
2. **Reduce carriage fees** — Negotiate post-TRAI consultation paper ruling
   - Potential saving: ₹15-25 Cr/year
3. **Premium inventory pricing** — CTV launch at 5-8x CPMs
   - Revenue uplift: ₹30-50 Cr/year at scale

**Levers to Improve Digital Margin (-ve → 8-10%):**
1. MAU monetization improvement — current ad revenue per MAU is ₹0.92 Cr vs ₹1.02 Cr for peers
2. Subscription launch — target 500K paying users at ₹400 ARPU = ₹20 Cr high-margin revenue
3. Content cost rationalization — leverage AI and repurposed TV content

**Financial Impact (FY27 Estimate):**
- Consolidated revenue: ~₹1,180 Cr (+21% over FY24)
- Consolidated EBITDA: ~₹215 Cr (+85% over FY24)
- Consolidated margin: ~18.2%`
  }

  if (q.includes('digital profit') || q.includes('convergence')) {
    return `**Digital Profitability Path — NDTV Convergence**

**Current State (FY24):**
- Revenue: ₹303 Cr | EBITDA: ₹8 Cr (2.6% margin) | PAT: -₹8 Cr

**Path to EBITDA Breakeven (Q4 FY25E → Actual Profitability):**

**Phase 1 (FY25):** Operational Breakeven
- Cost rationalization: ₹15 Cr savings via tech stack optimization
- Video advertising yield improvement: +₹12 Cr (better programmatic fill rates)
- Subscription beta launch: ₹8-10 Cr incremental

**Phase 2 (FY26):** Growth Mode
- CTV app launch on Fire Stick, Apple TV, Samsung TV
- NDTV Premium subscription: Target 300-500K subscribers
- Election advertising windfall: +₹20-30 Cr
- AI content cost savings: ₹15-20 Cr

**Phase 3 (FY27):** Scale Profitability
- MAU target: 300M (28% growth from 235M)
- Revenue target: ₹420-450 Cr
- EBITDA margin: 10-12%

**Critical Dependencies:**
- Adani Group advertising commitment (B2B media partnerships)
- Subscriber acquisition marketing investment of ₹40-50 Cr
- Editorial independence perception — key to maintaining premium advertiser trust`
  }

  if (q.includes('compet') || q.includes('market share') || q.includes('strategy')) {
    return `**Competitive Strategy for NDTV**

**Current Position:**
- TV viewership share: 7.8% (down from 8.9%, Q1 FY23)
- Primetime: #3 English, #4-5 Hindi
- Digital: #3 (235M MAU), behind Aaj Tak (310M) and TOI (285M)

**Recommended Competitive Strategy:**

**1. Double Down on Premium Positioning**
- Don't compete with Republic on sensationalism — own the "credible" space
- NDTV Profit: Become India's CNBC — financial content is high-value real estate
- Premium advertiser CPM premium: ₹250-400 vs ₹120-180 for mass channels

**2. Hindi News Revival (NDTV India)**
- Hire marquee anchors to challenge Aaj Tak in primetime
- Election coverage as differentiator — invest in ground reporting
- Estimated viewership recovery of 1.5-2% share within 18 months

**3. Digital-First Strategy**
- Build on #3 digital position — gap to #1 is closeable (235M vs 310M MAU)
- YouTube strategy: NDTV at 14.2M subs vs Aaj Tak at 32M — 3x gap to close
- Short-form newsroom: Dedicated 20-person Reels/Shorts team

**4. Leverage Adani Infrastructure**
- Airport media: 25+ Adani airports — NDTV content on screens
- Green energy coverage: ESG content moat
- B2B content partnerships for Adani group companies`
  }

  if (q.includes('ctv') || q.includes('ott') || q.includes('connected tv')) {
    return `**CTV/OTT Opportunity for NDTV**

**Market Size:**
- CTV households in India: 40M+ (FY24), growing 45% YoY
- News is 3rd most watched genre on CTV (after entertainment and sports)
- CTV CPMs: ₹800-1,200 vs linear TV CPMs of ₹120-180

**NDTV CTV Opportunity:**

**Revenue Model:**
- AVOD (Ad-supported): 10-15M CTV-reached users × ₹400-500 ARPU = ₹40-75 Cr/year
- SVOD (Subscription): Premium live + archive at ₹299/month
- Total CTV revenue potential: ₹80-120 Cr by FY27

**Investment Required:**
- App development & certification for 5+ platforms: ₹8-12 Cr
- Content licensing & exclusives for CTV: ₹20-30 Cr/year
- Marketing for CTV acquisition: ₹10-15 Cr
- Total capex: ~₹40-50 Cr + ₹30-35 Cr annual opex

**Implementation Plan:**
1. Q1 FY25: Launch on Samsung TV, LG TV, JioFiber TV
2. Q2 FY25: Apple TV, Fire TV, Android TV
3. Q3 FY25: Programmatic CTV inventory activation
4. FY26: NDTV Premium CTV-exclusive content

**ROI:** 3-4 year payback, ₹100-150 Cr NPV at 12% discount rate`
  }

  if (q.includes('election') || q.includes('bihar')) {
    return `**Election Revenue Opportunity — FY26 Cycle**

**Historical Election Impact on NDTV:**
- Q3 FY24 (vs Q3 FY23): +4.5% incremental growth attributable to state elections
- General Elections FY24: ~12-15% full-year TV revenue uplift estimated
- Bihar elections historically drive 8-12% of total annual ad revenue during election quarter

**FY26 Election Calendar:**
- Bihar Assembly Elections: Scheduled late 2025/early 2026
- West Bengal local body elections
- Multiple district council elections (7-8 states)

**Revenue Uplift Estimate for NDTV:**

**TV Business:**
- Base Q3 FY26 TV revenue (ex-elections): ~₹195 Cr
- Election uplift: 35-45% → incremental ₹65-85 Cr
- Full FY26 uplift: ₹35-45 Cr net additional vs FY25

**Digital Business:**
- Digital news consumption spikes 80-120% during elections
- Election digital ad packages at premium CPMs: +₹20-30 Cr incremental

**Total Election Windfall (FY26): ₹55-75 Cr incremental revenue**

**Preparation Checklist:**
- Early advertiser lockouts: Start Q3 FY25 (6 months advance)
- Bihar-focused content team: 15-20 person ground unit
- Digital election tracker product (high traffic → high ads)
- OB van deployment for live election results`
  }

  if (q.includes('ai') || q.includes('newsroom') || q.includes('technology')) {
    return `**AI Newsroom — Business Case for NDTV**

**Global Precedents:**
- Reuters: 30% reduction in production costs, 24/7 automated financial/sports briefs
- AP: 12x more earnings reports covered using AI automation
- NDTV equivalent opportunity: ₹20-35 Cr annual savings + revenue uplift

**AI Applications in NDTV Context:**

**Cost Savings:**
1. Automated Hindi dubbing/translation of English content: ₹8-12 Cr/year savings
2. Auto-captioning & transcription: ₹3-4 Cr/year
3. Financial news automation (NDTV Profit): 60% of routine earnings coverage
   Savings: ₹5-7 Cr/year in journalist time
4. Video clipping & tagging automation: ₹3-5 Cr/year

**Total Annual Savings: ₹19-28 Cr**

**Revenue Opportunities:**
1. Personalized news feeds (app engagement +25-35% → better ad yields): +₹15-20 Cr
2. Multilingual expansion at low cost (12 → 20 languages): +₹10-15 Cr
3. AI-generated regional content for digital: +₹8-12 Cr

**Investment Required:**
- Enterprise AI licensing (3-5 vendors): ₹8-12 Cr/year
- Integration & custom development: ₹15-20 Cr one-time
- Reskilling program: ₹3-5 Cr

**Net ROI: 2x in 3 years on cost savings alone. Payback period: 18-24 months.**`
  }

  if (q.includes('adani') || q.includes('synerg')) {
    return `**Adani Group — NDTV Synergy Analysis**

**Adani Group Overview:**
- Revenue: ₹2.4L Cr (FY24)
- Businesses: Ports, Airports, Power, Green Energy, Cement, Real Estate, Food
- 25+ airports, 13 ports, 11+ GW power capacity

**Potential Synergies with NDTV:**

**1. Captive Advertising Revenue (₹80-120 Cr potential)**
- Adani Group companies: Currently minimal NDTV advertising
- Post-consolidation opportunity: 5-10% of Adani Group media budget
- Adani Energy, Adani Ports, APSEZ, Adani Green — all large ad spenders

**2. Airport Media Network (₹25-40 Cr)**
- 25+ Adani airports including Mumbai, Ahmedabad, Jaipur, Lucknow
- NDTV content on airport screens → ad inventory at premium CPMs
- Estimated 500-800K captive viewers daily

**3. B2B Content & Intelligence**
- Adani Group requires: ESG reporting, infrastructure policy coverage
- White-label content for Adani investor communications
- Business intelligence subscription service

**4. Distribution Advantages**
- Adani's ₹500 Cr investment commitment → newsroom upgrades
- Technology infrastructure support (Adani Data Networks)
- International bureau expansion using Adani global network

**5. Brand Building**
- NDTV credibility enhances Adani Group's public image (post-Hindenburg)
- Structured editorial firewall critical to maintain advertiser trust

**Near-term Monetizable Synergy: ₹100-150 Cr over FY25-26**`
  }

  // Default analytical response
  return `**Analysis — ${question.slice(0, 60)}...**

Based on NDTV's financial data and market position, here is my assessment:

**Key Observations:**
- NDTV consolidated revenue of ₹973 Cr represents a business at an inflection point
- TV business (69% of revenue) remains the profit engine with 16.1% EBITDA margin
- Digital business is approaching profitability — EBITDA turned positive in FY24

**Relevant Data Points:**
- TV advertising market growing at 7.2% — NDTV needs to outperform this to gain share
- Digital news market growing at 22.4% — significant headroom for NDTV digital
- Viewership share at 7.8% vs 8.9% 18 months ago — needs intervention

**Recommendation:**
Focus on 3 priorities simultaneously:
1. Content & talent investment to halt TV viewership decline
2. Digital subscription product launch (high-margin revenue diversification)
3. CTV/OTT presence to capture premium ad inventory

For a more specific analysis, try asking about a particular business area, financial metric, or competitive scenario. The suggested prompts on the left cover the most strategic questions.`
}

export default function AIAnalysis() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Welcome to NDTV's AI Financial Analysis module.

I have full context on NDTV's financial performance, competitive landscape, market position, and industry trends from this dashboard.

You can ask me anything about:
- Revenue & profitability analysis
- Competitive strategy recommendations
- Market opportunity sizing
- Digital transformation roadmap
- Election revenue projections
- Any specific business questions for management

Use the suggested prompts below or type your own question.`,
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text) => {
    const q = text || input
    if (!q.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: q }])
    setInput('')
    setIsLoading(true)

    // Simulate analysis generation delay
    setTimeout(() => {
      const response = generateAnalysis(q)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsLoading(false)
    }, 800 + Math.random() * 600)
  }

  return (
    <div className="space-y-4 max-w-screen-xl h-full flex flex-col">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><BrainCircuit size={20} /> AI Financial Analysis</h1>
        <p className="text-sm text-gray-400 mt-0.5">Ask any question about NDTV's financials, strategy, or market position</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Suggested prompts */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card h-full">
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-medium uppercase tracking-wide">
              <Sparkles size={12} />
              Suggested Prompts
            </div>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map(p => (
                <button
                  key={p.label}
                  onClick={() => sendMessage(p.prompt)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg bg-ndtv-border/40 hover:bg-ndtv-border text-gray-300 hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="card flex-1 overflow-y-auto space-y-4 mb-3 min-h-[400px] max-h-[600px]">
            {messages.map((msg, i) => (
              <Message key={i} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-ndtv-red/20 border border-ndtv-red/40 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-ndtv-red" />
                </div>
                <div className="bg-ndtv-border/50 border border-ndtv-border rounded-xl px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask about financials, strategy, market trends..."
              className="flex-1 bg-ndtv-card border border-ndtv-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-ndtv-red/60 transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-ndtv-red hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
