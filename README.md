# PaisaTrack

A clean, private **personal finance & expense tracker** — a single-page app that runs in the browser.
Now in **23 languages** (English + 22 Indian languages). Optional **encrypted sync** across devices.

## Live
- **Netlify** (full app, cross-device sync): https://paisatrack-app.netlify.app/
- **GitHub Pages** (static): https://aryansjha14-gif.github.io/paisatrack/

## Features
- Track daily income and expenses (category, date, note)
- Add, edit (click a row) and **delete any transaction** — with an Undo
- **Custom categories** — pick "Other" and type your own (e.g. Pet care, EMI)
- Summary cards: balance, income, expenses, savings rate
- 6-month cash-flow bar chart + "where your money goes" doughnut
- Period filter: this month / last 30 days / this year / all time
- **Download** data as CSV; **Backup / Restore** as JSON
- **23 languages**: English, हिन्दी, বাংলা, मराठी, తెలుగు, தமிழ், ગુજરાતી, ಕನ್ನಡ, മലയാളം, ଓଡ଼ିଆ,
  ਪੰਜਾਬੀ, অসমীয়া, اردو, नेपाली, संस्कृतम्, मैथिली, कोंकणी, کٲشُر, سنڌي, डोगरी, মৈতৈলোন, बड़ो, ᱥᱟᱱᱛᱟᱲᱤ
  (Urdu, Kashmiri and Sindhi render right-to-left.)
- Data stays in the browser (localStorage); nothing leaves the device unless you enable sync

## Keeping your data safe
- The app requests **persistent storage** and shows the status in the "Data, backup & sync" panel.
- On iPhone/iPad, add the site to your **Home Screen** so Safari does not clear it after ~7 days.
- Press **Backup** now and then — **Restore** brings everything back.

## Cross-device sync (optional)
Turn on sync in the "Data, backup & sync" panel with an **email + passphrase**; use the same pair on another device.

- Data is **encrypted in the browser** (AES-GCM, key derived with PBKDF2) before upload.
- Deletions sync too (tombstones).
- `netlify/functions/sync.js` stores the encrypted blobs in **Netlify Blobs**, so sync works on the **Netlify** deployment.

## Tech
Plain HTML, CSS and JavaScript · one Netlify Function for sync.
