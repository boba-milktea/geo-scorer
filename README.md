# GEO Scorer

A fully client-side Generative Engine Optimization content analyzer. No backend, no API keys, no data stored.

## How it works

1. User pastes content → instant heuristic scoring (Flesch readability, structure, factual density, authority signals)
2. Results show score breakdown + ranked issues
3. "Get AI suggestions" button generates a tailored prompt and opens Claude.ai or ChatGPT

## Setup

```bash
npm install
npm run dev
```

## Deploy to Netlify

1. Push to GitHub
2. Connect in Netlify dashboard
3. Build command: `npm run build` · Publish dir: `dist`
4. No environment variables needed

## Stack

- React 18 + TypeScript
- Vite
- Zero runtime dependencies beyond React
