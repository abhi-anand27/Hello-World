import React, { useState, useRef, useEffect } from 'react'
import { X, Bot, Send, User, Sparkles, MessageSquare, ExternalLink, Settings, ChevronRight } from 'lucide-react'

// ── Copilot Studio embed URL ─────────────────────────────────────────────────
// Replace with your tenant's Copilot Studio webchat URL once available.
// Get it from: Copilot Studio → Your Bot → Settings → Channels → Custom Website
// Format: https://copilotstudio.microsoft.com/environments/{env-id}/bots/{bot-id}/webchat?__version__=2
const DEFAULT_COPILOT_URL = ''   // leave blank to show built-in chat

// ── Updated financial context (FY25 & FY26 actuals) ─────────────────────────
const CONTEXT = {
  tv: {
    fy25: { revenue: 262, opProfit: -165, opm: -63, pat: -200, eps: -24.61 },
    fy26: { revenue: 332, opProfit: -235, opm: -71, pat: -298, eps: -36.76 },
  },
  consolidated: {
    fy25: { revenue: 465, opProfit: -173, opm: -37, pat: -218, eps: -19.16 },
    fy26: { revenue: 528, opProfit: -261, opm: -49, pat: -323, eps: -28.59 },
  },
  digital: {
    fy25: { revenue: 203, opProfit: -8,  pat: -18 },
    fy26: { revenue: 196, opProfit: -26, pat: -25 },
  },
}

const QUICK_PROMPTS = [
  'What is NDTV\'s FY26 revenue and PAT?',
  'Compare NDTV FY25 vs FY26 performance',
  'Why is NDTV operating margin negative?',
  'How does NDTV compare to TV Today (Aaj Tak)?',
  'What is the digital business trajectory?',
  'What are the key risks for NDTV management?',
]

function buildAnswer(q) {
  const ql = q.toLowerCase()

  if (ql.includes('fy26') || ql.includes('latest') || ql.includes('recent')) {
    return `**NDTV Latest Financials — FY26 (Apr 25 – Mar 26)**

**Consolidated Group:**
- Revenue: ₹528 Cr (+13.5% vs FY25 ₹465 Cr)
- Operating Profit: -₹261 Cr (OPM: -49%)
- PAT: -₹323 Cr | EPS: ₹-28.59

**TV Standalone:**
- Revenue: ₹332 Cr (+26.8% vs FY25 ₹262 Cr)
- Operating Profit: -₹235 Cr (OPM: -71%)
- PAT: -₹298 Cr | EPS: ₹-36.76

**Digital (Convergence):**
- Revenue: ₹196 Cr (vs ₹203 Cr in FY25)
- Operating Profit: -₹26 Cr
- PAT: -₹25 Cr

Revenue is growing but losses are widening — driven by heavy restructuring, impairment charges, and content investment post-Adani acquisition.`
  }

  if (ql.includes('compare') || ql.includes('fy25') || ql.includes('vs')) {
    return `**NDTV FY25 vs FY26 Comparison (Consolidated)**

| Metric         | FY25      | FY26      | Change   |
|----------------|-----------|-----------|----------|
| Revenue        | ₹465 Cr   | ₹528 Cr   | +13.5%   |
| Op. Profit     | -₹173 Cr  | -₹261 Cr  | worse    |
| OPM %          | -37%      | -49%      | -12 pp   |
| PAT            | -₹218 Cr  | -₹323 Cr  | worse    |
| EPS            | ₹-19.16   | ₹-28.59   | worse    |

**TV Standalone FY25 vs FY26:**
- Revenue: ₹262 Cr → ₹332 Cr (+26.8%)
- PAT: -₹200 Cr → -₹298 Cr (widening)

Revenue growth is positive but cost structure has expanded faster — management focus should be on opex discipline alongside revenue scaling.`
  }

  if (ql.includes('margin') || ql.includes('negative') || ql.includes('loss') || ql.includes('why')) {
    return `**Why is NDTV's Operating Margin Negative?**

NDTV's OPM turned negative in FY24 and has worsened:
- FY23: +9% → FY24: -9% → FY25: -63% (TV standalone)

**Key drivers of the losses:**

1. **Restructuring & impairment charges** — Post-Adani acquisition write-downs of ₹100–150 Cr/year
2. **Content & talent reinvestment** — New programming, anchor hiring, newsroom upgrades
3. **Digital investment burn** — Building scale before monetisation catches up
4. **Revenue base still modest** — ₹528 Cr consolidated with high fixed costs

**What's different from peers:**
- TV Today (Aaj Tak): OPM +10% (FY25) — lean ops, no restructuring
- Sun TV: OPM +54% — regional monopoly, minimal competition

The FY26 margin contraction (-49% OPM) suggests restructuring is still ongoing. Recovery expected from FY27 as one-time costs normalise.`
  }

  if (ql.includes('competitor') || ql.includes('aaj tak') || ql.includes('tv today') || ql.includes('compare') || ql.includes('peer')) {
    return `**NDTV vs TV Today (Aaj Tak) — FY25 Peer Comparison**

| Metric      | NDTV (Consol.) | TV Today   |
|-------------|----------------|------------|
| Revenue     | ₹465 Cr        | ₹993 Cr    |
| Op. Profit  | -₹173 Cr       | +₹100 Cr   |
| OPM %       | -37%           | +10%       |
| PAT         | -₹218 Cr       | +₹75 Cr    |
| EPS         | ₹-19.16        | ₹13.87     |

**Key takeaways:**
- TV Today has 2x NDTV's revenue with 10% OPM — lean, profitable
- NDTV's losses are restructuring-driven, not operational at the revenue line
- TV Today's margin has also compressed (26% in FY22 → 10% in FY25) — industry-wide pressure
- Sun TV leads the sector at 54% OPM (regional monopoly advantage)

Long-term, if NDTV normalises restructuring costs, there is a path to 10–15% OPM.`
  }

  if (ql.includes('digital') || ql.includes('convergence') || ql.includes('online')) {
    return `**NDTV Digital (Convergence) Business**

**FY26 Actuals:**
- Revenue: ₹196 Cr (vs ₹203 Cr FY25 — slight dip)
- Op. Profit: -₹26 Cr (vs -₹8 Cr FY25 — worsening)
- PAT: -₹25 Cr

**Traffic Metrics (latest):**
- MAU: 235M+ (industry rank #3)
- MAU Growth: +22% YoY
- YouTube: 14.2M subscribers
- Page Views: 2,240M/month

**Key concerns:**
- Revenue declined slightly FY25→FY26 despite MAU growth — monetisation gap
- Operating losses widening — cost investments outpacing revenue
- Peers: AajTak.in (310M MAU, rank #1), TOI.com (285M MAU, rank #2)

**Path forward:**
- Subscription product launch could add ₹15–25 Cr high-margin revenue
- Digital ad yield improvement (currently below peer avg)
- CTV expansion for premium inventory`
  }

  if (ql.includes('risk') || ql.includes('management') || ql.includes('concern')) {
    return `**Key Risks for NDTV Management — FY26**

**Financial Risks:**
1. Losses widening: PAT -₹323 Cr (consolidated FY26), cash burn rate a concern
2. Borrowings up: ₹316 Cr (Mar 25) vs ₹3 Cr (Mar 22) — leverage increasing
3. Negative book value: -₹10.2/share (Mar 25) — equity erosion

**Operational Risks:**
1. TV viewership share: ~7.8% declining trend — revenue at risk
2. Digital revenue soft: ₹196 Cr FY26 vs ₹203 Cr FY25 despite MAU growth
3. Talent stability: Post-acquisition leadership transitions ongoing

**Market Risks:**
1. Network18/JioStar scale advantage in distribution
2. Digital ad revenue competition from Google/Meta eating publisher share
3. BARC measurement changes affecting TV ad pricing

**Mitigants:**
- Adani Group financial backing (₹500 Cr committed)
- Strong NDTV brand — #3 digital portal, trusted advertiser
- Revenue growing (+13.5% FY26) even if losses persist`
  }

  // Default
  return `**NDTV Financial Summary — FY26**

**Consolidated (Group):** Revenue ₹528 Cr | OPM -49% | PAT -₹323 Cr
**TV Standalone:** Revenue ₹332 Cr | OPM -71% | PAT -₹298 Cr
**Digital:** Revenue ₹196 Cr | OPM -ve | MAU 235M+

**Top 5 peer comparison (FY25 OPM):**
1. Sun TV: +54% 🟢
2. TV Today: +10% 🟡
3. Zee Entmt: +13% 🟡
4. Network18: +2% 🔴
5. HT Media: ~0% 🔴
6. NDTV: -37% 🔴

For specific analysis, try the quick prompts or ask about revenue, margins, digital business, competitor benchmarks, or investment risks.

_Tip: Connect Microsoft Copilot 365 via Settings (⚙) for deeper AI-powered analysis with live data._`
}

function ChatBubble({ role, text }) {
  return (
    <div className={`flex gap-2 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'bot' && (
        <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={12} className="text-blue-400" />
        </div>
      )}
      <div className={`max-w-[85%] text-xs rounded-2xl px-3 py-2 leading-relaxed whitespace-pre-wrap ${
        role === 'user'
          ? 'bg-ndtv-red/25 border border-ndtv-red/30 text-white rounded-br-sm'
          : 'bg-[#1e2a3a] border border-blue-900/40 text-gray-200 rounded-bl-sm'
      }`}>
        {text.split('\n').map((line, i) => {
          if (line.startsWith('**') && line.endsWith('**'))
            return <div key={i} className="font-semibold text-white mt-1 mb-0.5">{line.replace(/\*\*/g, '')}</div>
          if (line.startsWith('- ') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.'))
            return <div key={i} className="mt-0.5 pl-1">{line}</div>
          if (line === '') return <div key={i} className="h-1" />
          return <span key={i}>{line} </span>
        })}
      </div>
      {role === 'user' && (
        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
          <User size={11} className="text-gray-300" />
        </div>
      )}
    </div>
  )
}

export default function CopilotPanel() {
  const [open, setOpen]           = useState(false)
  const [mode, setMode]           = useState('chat')   // 'chat' | 'copilot' | 'settings'
  const [copilotUrl, setCopilotUrl] = useState(DEFAULT_COPILOT_URL)
  const [urlInput, setUrlInput]   = useState(DEFAULT_COPILOT_URL)
  const [messages, setMessages]   = useState([
    { role: 'bot', text: 'Hi! I\'m your NDTV financial analyst. Ask me about FY25/FY26 results, competitor benchmarks, or business strategy.\n\nOr connect **Microsoft Copilot 365** via ⚙ Settings for advanced AI analysis.' }
  ])
  const [input, setInput]         = useState('')
  const [typing, setTyping]       = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = (text) => {
    const q = (text || input).trim()
    if (!q) return
    setMessages(p => [...p, { role: 'user', text: q }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(p => [...p, { role: 'bot', text: buildAnswer(q) }])
      setTyping(false)
    }, 700 + Math.random() * 500)
  }

  const saveCopilotUrl = () => {
    setCopilotUrl(urlInput.trim())
    setMode(urlInput.trim() ? 'copilot' : 'chat')
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-5 right-5 z-50 w-13 h-13 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-blue-600 hover:bg-blue-500'
        }`}
        style={{ width: 52, height: 52 }}
        title="Copilot / AI Analysis"
      >
        {open
          ? <X size={20} className="text-white" />
          : <MessageSquare size={20} className="text-white" />
        }
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 md:w-96 rounded-2xl shadow-2xl border border-blue-900/40 bg-[#111827] flex flex-col overflow-hidden"
          style={{ height: 560 }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-blue-900/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
                <Bot size={14} className="text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">NDTV Copilot</div>
                <div className="text-[10px] text-gray-400">{copilotUrl ? 'Microsoft Copilot 365' : 'Built-in AI Analyst'}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Mode switcher */}
              {copilotUrl && (
                <>
                  <button onClick={() => setMode('chat')}
                    className={`text-[10px] px-2 py-0.5 rounded-full transition ${mode === 'chat' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                    Built-in
                  </button>
                  <button onClick={() => setMode('copilot')}
                    className={`text-[10px] px-2 py-0.5 rounded-full transition ${mode === 'copilot' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                    Copilot 365
                  </button>
                </>
              )}
              <button onClick={() => setMode(m => m === 'settings' ? (copilotUrl ? 'copilot' : 'chat') : 'settings')}
                className="text-gray-400 hover:text-white p-1 rounded-full transition" title="Settings">
                <Settings size={13} />
              </button>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-full transition">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Settings panel */}
          {mode === 'settings' && (
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div>
                <div className="text-xs font-semibold text-white mb-2">Microsoft Copilot 365 Integration</div>
                <div className="text-[11px] text-gray-400 leading-relaxed mb-3">
                  Paste your <span className="text-blue-400">Copilot Studio webchat URL</span> to enable Microsoft Copilot 365. Get it from:<br/>
                  <span className="text-gray-500">Copilot Studio → Your Bot → Channels → Custom Website</span>
                </div>
                <textarea
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://copilotstudio.microsoft.com/environments/.../bots/.../webchat?__version__=2"
                  className="w-full bg-[#1e2a3a] border border-blue-900/40 rounded-xl px-3 py-2 text-[11px] text-white placeholder-gray-600 resize-none h-20 focus:outline-none focus:border-blue-500/60"
                />
                <button onClick={saveCopilotUrl}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-xl transition font-medium">
                  {urlInput.trim() ? 'Connect Copilot 365' : 'Use Built-in AI'}
                </button>
              </div>
              <div className="border-t border-blue-900/30 pt-3">
                <div className="text-[10px] text-gray-500 font-medium uppercase mb-2">How to get the URL</div>
                {[
                  'Sign in to copilotstudio.microsoft.com',
                  'Open your NDTV analysis bot (or create one)',
                  'Go to Settings → Channels → Custom Website',
                  'Copy the webchat embed URL and paste above',
                ].map((step, i) => (
                  <div key={i} className="flex gap-2 text-[11px] text-gray-400 mb-1.5">
                    <span className="text-blue-500 font-bold flex-shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
                <a href="https://copilotstudio.microsoft.com" target="_blank" rel="noreferrer"
                  className="mt-2 flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition">
                  Open Copilot Studio <ExternalLink size={11} />
                </a>
              </div>
            </div>
          )}

          {/* Copilot 365 iframe */}
          {mode === 'copilot' && copilotUrl && (
            <iframe
              src={copilotUrl}
              title="Microsoft Copilot 365"
              frameBorder="0"
              allow="camera; microphone; *"
              className="flex-1 w-full"
            />
          )}

          {/* Built-in chat */}
          {mode === 'chat' && (
            <>
              {/* Quick prompts */}
              <div className="px-3 py-2 border-b border-blue-900/20 flex gap-1.5 overflow-x-auto scrollbar-hide">
                {QUICK_PROMPTS.slice(0, 4).map(p => (
                  <button key={p} onClick={() => send(p)}
                    className="flex-shrink-0 text-[10px] px-2 py-1 rounded-full bg-blue-900/30 border border-blue-800/40 text-blue-300 hover:bg-blue-800/40 transition whitespace-nowrap">
                    {p.length > 28 ? p.slice(0, 28) + '…' : p}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((m, i) => (
                  <ChatBubble key={i} role={m.role} text={m.text} />
                ))}
                {typing && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-blue-400" />
                    </div>
                    <div className="bg-[#1e2a3a] border border-blue-900/40 rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-blue-900/20 flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask about NDTV financials..."
                  className="flex-1 bg-[#1e2a3a] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition"
                />
                <button onClick={() => send()} disabled={!input.trim() || typing}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-3 transition">
                  <Send size={13} className="text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
