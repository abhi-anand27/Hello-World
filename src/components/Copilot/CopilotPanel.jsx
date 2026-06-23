import React, { useState, useRef, useEffect } from 'react'
import { X, Bot, Send, User, Settings, MessageSquare, Globe, ExternalLink, KeyRound, AlertTriangle, ShieldQuestion } from 'lucide-react'
import { useData } from '../../api/DataContext'
import { digitalTraffic as DT } from '../../data/digitalTraffic'
import { addWebResult } from '../../api/webResults'

const LS_KEY   = 'ndtv_gemini_key'
const LS_MODEL = 'ndtv_gemini_model'
const LS_WEB   = 'ndtv_gemini_web'
const DEFAULT_MODEL = 'gemini-2.5-flash'

const QUICK_PROMPTS = [
  'Summarise NDTV FY26 consolidated results',
  'How does NDTV rank on Comscore unique users?',
  'What does the FICCI 2026 report say about M&E growth?',
  'Compare NDTV vs peers on operating margin',
  'Latest news on NDTV / Adani media',
]

// Heuristic: does this query likely need fresh internet data?
const WEB_HINT = /\b(latest|today|current|now|recent|news|price|share price|stock|live|update|trending|this week|this month|2026|announce)\b/i

/* ── Build a compact context from the dashboard's own data ────────────────── */
function buildContext(data) {
  const f = data.financials || {}
  const m = data.market || {}
  const slim = (arr, keys) => (arr || []).map(r => {
    const o = {}; keys.forEach(k => { if (r[k] !== undefined) o[k] = r[k] }); return o
  })
  const csRank = (b) => {
    if (!b?.ranking) return null
    const i = b.ranking.findIndex(r => r.ndtv)
    const r = b.ranking[i]
    return r ? { rank: i + 1, value: r.value, month: b.latestMonth } : null
  }
  const ctx = {
    note: 'All INR figures in Crores. FY = Apr–Mar. Comscore ranks use Unique Users. Negative = loss.',
    financials: {
      tvStandalone:  slim(f.tvBusinessData?.annual,   ['period', 'revenue', 'opProfit', 'opm', 'pat']),
      consolidated:  slim(f.consolidatedData?.annual,  ['period', 'revenue', 'opProfit', 'opm', 'pat']),
      digital:       slim(f.convergenceData?.annual,   ['period', 'revenue', 'opProfit', 'pat']),
    },
    ficci2026: {
      meOverview: m.meOverview, segments: m.meSegments, adMarket: m.adMarket,
      digitalRevenue: m.digitalRevenue, tvRevenue: m.tvRevenue,
    },
    digitalTraffic: {
      comscoreUsers: {
        groupRank: csRank(DT.csGroup), englishRank: csRank(DT.csEnglish),
        hindiRank: csRank(DT.csHindi), profitRank: csRank(DT.csProfit),
      },
      ga4FY: DT.gaFY, gaGrowth: DT.gaFYGrowth,
      youtubeLatest: DT.ytComp,
      socialNDTV: {
        english: (DT.social?.english || []).find(c => c.ndtv),
        hindi:   (DT.social?.hindi   || []).find(c => c.ndtv),
        business:(DT.social?.business|| []).find(c => c.ndtv),
      },
    },
  }
  return JSON.stringify(ctx)
}

const SYSTEM_PROMPT = (ctxJson) => `You are the NDTV Financial & Audience Analyst assistant embedded in an internal management dashboard.
Answer questions about NDTV's financial performance, the FICCI-EY 2026 Media & Entertainment report, and digital traffic (Comscore unique users, Google Analytics, YouTube, social).
Use ONLY the DASHBOARD DATA below for NDTV-specific numbers unless the user has allowed web search and you are given fresh web results.
Be concise, use INR Crores, label years as FY, and call out when a number is a loss. Use short markdown (bold headers, bullet points). If a number isn't in the data, say so rather than inventing it.

DASHBOARD DATA (JSON):
${ctxJson}`

/* ── Gemini REST call ─────────────────────────────────────────────────────── */
async function callGemini({ key, model, system, history, web }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    generationConfig: { temperature: 0.4, maxOutputTokens: 1400 },
  }
  if (web) body.tools = [{ google_search: {} }]

  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) {
    let detail = ''
    try { detail = (await res.json())?.error?.message || '' } catch { /* ignore */ }
    throw new Error(`${res.status} ${res.statusText}${detail ? ` — ${detail}` : ''}`)
  }
  const json = await res.json()
  const cand = json.candidates?.[0]
  const text = cand?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || '(no response)'
  // Grounding / web sources
  const gm = cand?.groundingMetadata
  const sources = (gm?.groundingChunks || [])
    .map(c => c.web).filter(Boolean)
    .map(w => ({ title: w.title || w.uri, uri: w.uri }))
  const queries = gm?.webSearchQueries || []
  return { text, sources, queries }
}

/* ── Markdown-ish bubble ──────────────────────────────────────────────────── */
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
          const t = line.replace(/\*\*(.+?)\*\*/g, '$1')
          if (/^\s*#{1,3}\s/.test(line)) return <div key={i} className="font-semibold text-white mt-1 mb-0.5">{line.replace(/^#+\s/, '')}</div>
          if (line.startsWith('**') && line.endsWith('**')) return <div key={i} className="font-semibold text-white mt-1 mb-0.5">{t}</div>
          if (/^\s*[-*]\s/.test(line) || /^\s*\d+\./.test(line)) return <div key={i} className="mt-0.5 pl-1">{t}</div>
          if (line === '') return <div key={i} className="h-1" />
          return <div key={i}>{t}</div>
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
  const { data } = useData()
  const [open, setOpen]     = useState(false)
  const [mode, setMode]     = useState('chat')   // 'chat' | 'settings'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY) || '')
  const [keyInput, setKeyInput] = useState(() => localStorage.getItem(LS_KEY) || '')
  const [model, setModel]   = useState(() => localStorage.getItem(LS_MODEL) || DEFAULT_MODEL)
  const [webAllowed, setWebAllowed] = useState(() => localStorage.getItem(LS_WEB) === '1')
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m the NDTV Gemini analyst. I can analyse the **financials**, **FICCI 2026 report**, and **digital traffic** in this dashboard.\n\nAdd your Google Gemini API key in ⚙ Settings to begin. I can also pull **live data from the web** — with your permission.' }
  ])
  const [input, setInput]   = useState('')
  const [busy, setBusy]     = useState(false)
  const [pending, setPending] = useState(null)   // query awaiting web permission
  const bottomRef = useRef(null)

  useEffect(() => { if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open, pending, busy])

  const saveSettings = () => {
    const k = keyInput.trim()
    setApiKey(k)
    if (k) localStorage.setItem(LS_KEY, k); else localStorage.removeItem(LS_KEY)
    localStorage.setItem(LS_MODEL, model || DEFAULT_MODEL)
    setMode('chat')
    setMessages(p => [...p, { role: 'bot', text: k ? '✓ API key saved. Ask me anything about NDTV.' : 'API key cleared.' }])
  }

  const toggleWeb = () => {
    const next = !webAllowed
    setWebAllowed(next)
    localStorage.setItem(LS_WEB, next ? '1' : '0')
  }

  // Run a query against Gemini. web=true includes Google Search grounding.
  async function run(query, history, web) {
    if (!apiKey) { setMode('settings'); return }
    setBusy(true)
    try {
      const system = SYSTEM_PROMPT(buildContext(data))
      const { text, sources, queries } = await callGemini({ key: apiKey, model, system, history, web })
      setMessages(p => [...p, { role: 'bot', text, sources: web ? sources : undefined }])
      if (web && sources.length) {
        addWebResult(queries[0] || query, sources, text.slice(0, 280))
        setMessages(p => [...p, { role: 'bot', text: `🌐 Pulled ${sources.length} web source${sources.length > 1 ? 's' : ''} — added to **News & Trends › Live from the web**.` }])
      }
    } catch (e) {
      setMessages(p => [...p, { role: 'bot', text: `⚠️ Gemini error: ${e.message}\n\nCheck your API key/model in ⚙ Settings. Model in use: \`${model}\`.` }])
    } finally {
      setBusy(false)
    }
  }

  const send = (text) => {
    const q = (text || input).trim()
    if (!q || busy) return
    if (!apiKey) { setMode('settings'); return }
    const history = [...messages.filter(m => m.role === 'user' || m.role === 'bot'), { role: 'user', text: q }]
    setMessages(p => [...p, { role: 'user', text: q }])
    setInput('')
    // If query may need fresh data and web not yet allowed → ask permission first.
    if (WEB_HINT.test(q) && !webAllowed) {
      setPending({ q, history })
      return
    }
    run(q, history, webAllowed)
  }

  const grantWeb = (allow, persist) => {
    const { q, history } = pending
    setPending(null)
    if (allow && persist) toggleWeb()
    run(q, history, allow)
  }

  const ready = !!apiKey

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-5 right-5 z-50 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${open ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'}`}
        style={{ width: 52, height: 52 }}
        title="NDTV Gemini Analyst"
      >
        {open ? <X size={20} className="text-white" /> : <MessageSquare size={20} className="text-white" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 md:w-96 rounded-2xl shadow-2xl border border-blue-900/40 bg-[#111827] flex flex-col overflow-hidden" style={{ height: 580 }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-blue-900/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600/40 to-indigo-600/40 border border-blue-500/40 flex items-center justify-center">
                <Bot size={14} className="text-blue-300" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">NDTV Gemini Analyst</div>
                <div className="text-[10px] text-gray-400">{ready ? `Google Gemini · ${model}` : 'API key needed'}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleWeb} title={webAllowed ? 'Web access ON' : 'Web access OFF'}
                className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full transition ${webAllowed ? 'bg-green-600/30 border border-green-500/40 text-green-300' : 'text-gray-400 hover:text-white border border-transparent'}`}>
                <Globe size={11} /> Web
              </button>
              <button onClick={() => setMode(m => m === 'settings' ? 'chat' : 'settings')} className="text-gray-400 hover:text-white p-1 rounded-full transition" title="Settings">
                <Settings size={13} />
              </button>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-full transition"><X size={14} /></button>
            </div>
          </div>

          {/* Settings */}
          {mode === 'settings' && (
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div>
                <div className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5"><KeyRound size={13} /> Google Gemini API key</div>
                <div className="text-[11px] text-gray-400 leading-relaxed mb-2">
                  Stored only in this browser (localStorage) — never committed. Get a free key at{' '}
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5">aistudio.google.com/apikey <ExternalLink size={10} /></a>.
                </div>
                <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)} placeholder="AIza…"
                  className="w-full bg-[#1e2a3a] border border-blue-900/40 rounded-xl px-3 py-2 text-[11px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60" />
                <div className="text-[11px] text-gray-400 mt-3 mb-1">Model</div>
                <input value={model} onChange={e => setModel(e.target.value)} placeholder={DEFAULT_MODEL}
                  className="w-full bg-[#1e2a3a] border border-blue-900/40 rounded-xl px-3 py-2 text-[11px] text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60" />
                <p className="text-[10px] text-gray-500 mt-1">e.g. gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash</p>
                <button onClick={saveSettings} className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-xl transition font-medium">Save</button>
              </div>
              <div className="border-t border-blue-900/30 pt-3 text-[11px] text-gray-400 space-y-1.5">
                <div className="flex items-start gap-2"><AlertTriangle size={12} className="text-yellow-500 mt-0.5 flex-shrink-0" /><span>Asking a question sends the dashboard's NDTV data to Google's Gemini API. Use only with authorised data.</span></div>
                <div className="flex items-start gap-2"><Globe size={12} className="text-green-500 mt-0.5 flex-shrink-0" /><span>Web search is off by default. The bot asks permission before each web pull (or toggle Web on).</span></div>
              </div>
            </div>
          )}

          {/* Chat */}
          {mode === 'chat' && (
            <>
              <div className="px-3 py-2 border-b border-blue-900/20 flex gap-1.5 overflow-x-auto scrollbar-hide">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} onClick={() => send(p)} disabled={busy}
                    className="flex-shrink-0 text-[10px] px-2 py-1 rounded-full bg-blue-900/30 border border-blue-800/40 text-blue-300 hover:bg-blue-800/40 transition whitespace-nowrap disabled:opacity-40">
                    {p.length > 30 ? p.slice(0, 30) + '…' : p}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((m, i) => (
                  <div key={i}>
                    <ChatBubble role={m.role} text={m.text} />
                    {m.sources && m.sources.length > 0 && (
                      <div className="ml-8 mt-1 space-y-0.5">
                        {m.sources.map((s, j) => (
                          <a key={j} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 truncate">
                            <ExternalLink size={9} className="flex-shrink-0" /> {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Web permission prompt */}
                {pending && (
                  <div className="bg-[#1e2a3a] border border-yellow-700/40 rounded-2xl px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-yellow-300 font-medium mb-1"><ShieldQuestion size={13} /> Allow web search?</div>
                    <div className="text-[11px] text-gray-300 mb-2">This question may need current data from the internet. Let Gemini search the web for it?</div>
                    <div className="flex gap-1.5 flex-wrap">
                      <button onClick={() => grantWeb(true, false)} className="text-[10px] px-2.5 py-1 rounded-full bg-green-600 hover:bg-green-500 text-white">Allow once</button>
                      <button onClick={() => grantWeb(true, true)} className="text-[10px] px-2.5 py-1 rounded-full bg-green-700/60 hover:bg-green-600/60 text-white">Always allow</button>
                      <button onClick={() => grantWeb(false, false)} className="text-[10px] px-2.5 py-1 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-200">Answer offline</button>
                    </div>
                  </div>
                )}

                {busy && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center flex-shrink-0"><Bot size={12} className="text-blue-400" /></div>
                    <div className="bg-[#1e2a3a] border border-blue-900/40 rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1 items-center">
                      {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-blue-900/20 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder={ready ? 'Ask about NDTV financials, FICCI, traffic…' : 'Add API key in ⚙ Settings first'}
                  className="flex-1 bg-[#1e2a3a] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition" />
                <button onClick={() => send()} disabled={!input.trim() || busy} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-3 transition">
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
