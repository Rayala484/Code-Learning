# Trust Gold Services — Website

Static website for **Trust Gold Services**, Vijayawada (owner: V. Manohar) —
pledged gold release from banks / NBFCs and old gold buying.
No build step: open `index.html` or deploy the folder to any static host (Netlify, etc.).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and all English text |
| `config.js` | **Gold rate, phone, WhatsApp, email and social links — edit this daily** |
| `i18n.js` | Telugu translations (key → Telugu text) |
| `styles.css` | Design — navy & gold brand colours at the top in `:root` |
| `script.js` | Theme, language, gold rates, calculator, menu, WhatsApp form |
| `assets/` | Logo, founder photos, favicon, social share image |

## Updating the gold rate

Open `config.js` and change:

```js
rates: {
  updated: "2026-10-16T10:00",
  k24: 15200,
  k22: 13700
}
```

The rate strip, rate cards, calculator and the worked example all update automatically.
The processing fee (1%) is `processingFee` in the same file.

## Themes and language

- **Light / Dark / Default** (Default follows the visitor's phone or computer setting). Remembered per device.
- **EN / తెలుగు** switches the whole site. To change Telugu text, edit `i18n.js`.

## Enquiry form

The form opens WhatsApp with the customer's details pre-filled and sends them to the business number
in `config.js` — no server needed.

## YouTube

Paste the channel link into `youtube` in `config.js` and the YouTube icon appears automatically.
