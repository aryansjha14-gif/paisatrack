# PaisaTrack

A clean, private **personal finance & expense tracker** — a single-page app that runs in the browser. English + हिन्दी. Optional **encrypted sync** across devices.

Live: https://aryansjha14-gif.github.io/paisatrack/

## Features
- Track daily income and expenses (category, date, note)
- Add, edit (click a row) and delete transactions
- **Custom categories** — pick "Other" and type your own (e.g. Pet care, EMI)
- Summary cards: balance, income, expenses, savings rate
- 6-month cash-flow bar chart + "where your money goes" doughnut
- Period filter: this month / last 30 days / this year / all time
- **Download** data as CSV; **Backup / Restore** as JSON
- Bilingual UI: English + Hindi
- Data stays in the browser (localStorage); nothing leaves the device unless you enable sync
- Zero dependencies, no build step, charts drawn as inline SVG

## Keeping your data safe
- The app asks the browser for **persistent storage** and shows the status in the "Data, backup & sync" panel.
- On iPhone/iPad, add the site to your **Home Screen** so Safari does not clear it after ~7 days.
- Press **Backup** now and then and keep the JSON file — **Restore** brings everything back.

## Cross-device sync (optional)
Turn on sync in the "Data, backup & sync" panel with an **email + passphrase**.
Use the same pair on another device to see the same data there.

- Your data is **encrypted in the browser** (AES-GCM, key derived with PBKDF2) before upload — the server only stores ciphertext under an opaque key.
- Deletions sync too (tombstones).
- Sync needs a server. This repo includes a Netlify Function at `netlify/functions/sync.js` that stores the encrypted blobs in **Netlify Blobs** (no external account needed). Sync therefore works on the **Netlify** deployment.

## Run locally
Open `index.html` in a browser. (Sync needs a server, so it works on the deployed site.)

## Deploy
**GitHub Pages** — already set up, publishes from the `main` branch root.

**Netlify — one click:** https://app.netlify.com/start/deploy
(Use Netlify if you want cross-device sync.)

## Tech
Plain HTML, CSS and JavaScript · one Netlify Function for sync.
