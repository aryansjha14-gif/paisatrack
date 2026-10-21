# PaisaTrack

A clean, private **personal finance & expense tracker** — a single-page dashboard that runs entirely in the browser.

## Features
- Track daily income and expenses with category, date and note
- Live summary cards: balance, income, expenses and savings rate
- 6-month cash-flow bar chart (income vs. expenses)
- "Where your money goes" doughnut chart by category
- Period filter: this month / last 30 days / this year / all time
- Data stored in the browser (localStorage) — nothing leaves the device
- One-click JSON export
- Zero dependencies: no frameworks, no build step, no CDN — charts are hand-drawn with inline SVG

## Run locally
Just open `index.html` in any browser.

## Deploy to Netlify
**Option A — drag & drop (fastest):** open https://app.netlify.com/drop and drag this folder onto the page.

**Option B — continuous deployment from Git:** in Netlify choose *Add new site -> Import an existing project*, pick this repository. Build command: leave empty. Publish directory: `.` (already set in `netlify.toml`). Every push to `main` then auto-deploys.

## Tech
Plain HTML, CSS and JavaScript.
