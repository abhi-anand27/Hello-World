# NDTV Financial Dashboard

A dynamic management dashboard for NDTV financial results — TV business, Digital/Convergence,
competitor benchmarking, market status, AI analysis, and an embedded Copilot chatbot.

Data is served from a backend API and is **editable live** via the built-in Data Editor —
no rebuild needed to change the numbers.

## Architecture

```
┌─────────────┐   /api (proxied)   ┌──────────────┐   read/write   ┌──────────────┐
│  React (Vite)│ ─────────────────▶ │ Express API   │ ─────────────▶ │ JSON store    │
│  localhost   │ ◀───────────────── │ localhost:3001│ ◀───────────── │ server/data/  │
│  :5173       │     live data      └──────────────┘                 └──────────────┘
└─────────────┘
```

- **Frontend** (`src/`) — React + Vite + Tailwind + Recharts. Fetches all data on load via
  `src/api/DataContext.jsx`; every chart reads from that context.
- **Backend** (`server/`) — Express API serving `financials`, `competitors`, `market` from
  JSON files, with `GET` / `PUT` / `PATCH` endpoints. Edits persist to disk.
- **Data Editor** (sidebar → *Data Editor*) — edit numbers in a table or raw JSON, click
  Save, and the change is persisted and reflected everywhere instantly.

## Run locally

You need [Node.js](https://nodejs.org) (LTS).

```bash
npm install      # one-time
npm run dev      # starts BOTH the API (:3001) and the web app (:5173)
```

Open **http://localhost:5173**. The terminal shows colour-coded `API` and `WEB` logs.

### Individual processes (optional)

```bash
npm run server   # just the Express API on :3001
npm run client   # just the Vite dev server on :5173
```

## Test the dynamic nature

1. Run `npm run dev` and open http://localhost:5173
2. Note a figure on the **Overview** page (e.g. FY26 consolidated revenue ₹528 Cr)
3. Go to **Data Editor** in the sidebar → select *Consolidated (Annual)*
4. Change the FY26 revenue value → click **Save changes**
5. Return to **Overview** — the KPI and charts now show your new number
6. The change is saved in `server/data/financials.json` and survives restarts

## API reference

| Method | Endpoint                         | Purpose                              |
|--------|----------------------------------|--------------------------------------|
| GET    | `/api/health`                    | Health check                         |
| GET    | `/api/all/data`                  | All datasets (used by the frontend)  |
| GET    | `/api/:dataset`                  | One dataset                          |
| PUT    | `/api/:dataset`                  | Replace a whole dataset              |
| PATCH  | `/api/:dataset`                  | Update one key `{ key, value }`      |

`:dataset` ∈ `financials` | `competitors` | `market`

## Production build

```bash
npm run build    # outputs dist/  (static SPA)
```

> Note: the static build expects the API to be reachable at `/api`. For a fully static,
> no-backend deployment, use the bundled `NDTV-Financial-Dashboard.html` (data baked in).

## Data source

Financial figures are sourced from BSE filings (via finology.in, the same underlying data as
Moneycontrol). Seed data lives in `src/data/*.js` and is loaded into `server/data/*.json`.
