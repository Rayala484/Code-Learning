# Trust Gold Services — Website

Static website for **Trust Gold Services**, Vijayawada (owner: V. Manohar) —
pledged gold release from banks / NBFCs and old gold buying.
Deployed on Netlify (project `trust-gold-services`). No build step; the live gold rate needs Netlify Functions.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and all English text |
| `config.js` | **Gold rate, phone, WhatsApp, email and social links — edit this daily** |
| `i18n.js` | Telugu translations (key → Telugu text) |
| `styles.css` | Design — navy & gold brand colours at the top in `:root` |
| `script.js` | Theme, language, gold rates, calculator, menu, WhatsApp form |
| `netlify/functions/gold-rate.mts` | Live gold rate endpoint (`/api/gold-rate`) |
| `assets/` | Logo, founder photos, favicon, social share image |

## Gold rate (updates automatically)

`netlify/functions/gold-rate.mts` serves `/api/gold-rate`. It reads the live international gold
price, converts it to rupees per gram and adds the Indian market premium (`INDIA_PREMIUM`,
calibrated to Vijayawada / AP rates). Netlify caches it for 10 minutes, and open pages refresh
it every 10 minutes, so the rate strip, rate cards, calculator and example stay current all day.

In `config.js`:

- `liveRates: true` (default) shows the live rate.
- `liveRates: false` shows exactly the numbers typed in `rates` (use this to publish your own buying rate).
- The `rates` numbers are also the fallback if the live price is ever unavailable.

If the site's rate drifts from local published rates, adjust `INDIA_PREMIUM` in the function.

## Themes and language

- **Light / Dark / Default** (Default follows the visitor's phone or computer setting). Remembered per device.
- **EN / తెలుగు** switches the whole site. To change Telugu text, edit `i18n.js`.

## Enquiry form

The form opens WhatsApp with the customer's details pre-filled and sends them to the business number
in `config.js` — no server needed.

## Hero slideshow

The four banners in the hero are `assets/hero-1.webp` … `hero-4.webp` (1280×720). They cross-fade every
5 seconds in an endless loop; visitors can also tap the dots or swipe. To change a banner, replace the file
with a 16:9 image of the same name.

## Customer reviews

Add real customer reviews to `reviews` in `config.js`, for example
`{ name: "Ravi K.", place: "Vijayawada", rating: 5, text: "..." }`. They appear as cards under
"Hear it from our customers". With no reviews listed, only the Google Reviews / social buttons show.

## Social links

Instagram, Facebook, YouTube and WhatsApp links are set in `config.js`. Clearing a link hides its icon
(YouTube only).
