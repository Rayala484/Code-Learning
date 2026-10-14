# GoldXpert Skill Development Academy — Website

Static website for GoldXpert Skill Development Academy (Kukatpally, Hyderabad).
*From Learning to Earning for Growth.*

Live: https://goldxpert-academy.netlify.app

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and all text content |
| `styles.css` | Design (brand colours are defined at the top in `:root`) |
| `courses.js` | **Course list, fees and durations** — edit this to update courses |
| `intro.js` | Opening animation (gold bar melts and fills the GX logo mold) |
| `script.js` | Menu, course filters, course details popup, enquiry form |
| `assets/` | Logo, favicon and the self-hosted GSAP animation library |

## Updating fees and durations

Open `courses.js` and set `fee` and `duration` for each course, for example:

```js
duration: "30 days",
fee: "₹15,000"
```

Leave them as `null` to show "Call for fee" / "Call for details".
The course cards, the Fees & Batches table and the enquiry dropdown all update automatically.

## Enquiry form

The form uses Netlify Forms (form name `enquiry`). Submissions appear in the Netlify
dashboard under **Forms**, where you can also set up email notifications.
If the site is opened outside Netlify, the form falls back to sending the enquiry via WhatsApp.

## Deploying

The Netlify project `goldxpert-academy` deploys automatically on every push. No build step is needed.
