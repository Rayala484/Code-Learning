# Trust Gold Services — redesigned website

Static site (no build step). Open `index.html`, or deploy the `trust-gold/` folder to Netlify / any static host.

## Before launch — fill in `js/config.js`
Phone, WhatsApp, email, address, Google Maps link, hours, today's gold rate, real reviews and
social links all live in `js/config.js`. Anything left empty is hidden or falls back gracefully.
Set `doorstep: true` **only** if you really offer doorstep service.

## Files
| File | Purpose |
| --- | --- |
| `index.html` | Page structure and English copy |
| `css/style.css` | Design system — brand colours are the variables at the top (`:root`) |
| `js/config.js` | **Your business details** |
| `js/i18n.js` | Telugu translations (key = `data-i18n` in the HTML) |
| `js/main.js` | Loader, smooth scroll, parallax, 3D, cursor, tilt, calculator, form |

## Enquiry form
Submissions go to Netlify Forms (form name `enquiry`) and, if `whatsapp` is set, also open a
pre-filled WhatsApp chat.
