/*
  Live gold rate for the Trust Gold Services website (Vercel Function).
  Served at /api/gold-rate and cached on Vercel's CDN for 10 minutes,
  so the rates on the site refresh automatically through the day.

  Indian market rates track the international spot price converted to rupees,
  plus import duty and the local premium. INDIA_PREMIUM is that uplift, calibrated
  on 17 Oct 2026 against published AP/Telangana rates (24K ₹14,766/g at a spot of
  ₹12,740/g). If the site drifts from local rates, adjust this one number.
*/

const OZ_TO_GRAM = 31.1034768
const INDIA_PREMIUM = 0.159
const PURITY_22K = 0.9167
const PURITY_18K = 0.75

const getJson = async (url) => {
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (TrustGoldServices rate bot)", accept: "application/json" },
    signal: AbortSignal.timeout(6000),
  })
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.json()
}

// Spot gold in rupees per troy ounce, tried source by source.
async function spotInrPerOunce() {
  const errors = []

  try {
    const d = await getJson("https://data-asg.goldprice.org/dbXRates/INR")
    const p = Number(d?.items?.[0]?.xauPrice)
    if (p > 0) return { price: p, source: "goldprice.org", time: d?.date }
  } catch (e) { errors.push(String(e)) }

  let usd = 0
  let time
  try {
    const d = await getJson("https://api.gold-api.com/price/XAU")
    usd = Number(d?.price)
    time = d?.updatedAt
  } catch (e) { errors.push(String(e)) }

  if (usd > 0) {
    for (const [url, pick] of [
      ["https://open.er-api.com/v6/latest/USD", (d) => d?.rates?.INR],
      ["https://api.frankfurter.app/latest?from=USD&to=INR", (d) => d?.rates?.INR],
    ]) {
      try {
        const fx = Number(pick(await getJson(url)))
        if (fx > 0) return { price: usd * fx, source: "gold-api.com", time }
      } catch (e) { errors.push(String(e)) }
    }
  }

  throw new Error(errors.join(" | ") || "no gold price source answered")
}

export default {
  async fetch() {
    try {
      const spot = await spotInrPerOunce()
      const spotPerGram = spot.price / OZ_TO_GRAM
      const k24 = Math.round(spotPerGram * (1 + INDIA_PREMIUM))
      return Response.json(
        {
          k24,
          k22: Math.round(k24 * PURITY_22K),
          k18: Math.round(k24 * PURITY_18K),
          spotPerGram: Math.round(spotPerGram),
          source: spot.source,
          marketTime: spot.time ?? null,
          updated: new Date().toISOString(),
        },
        {
          headers: {
            "cache-control": "public, max-age=300",
            "vercel-cdn-cache-control": "public, s-maxage=600, stale-while-revalidate=300",
          },
        },
      )
    } catch (e) {
      console.error("gold-rate failed:", e)
      return Response.json({ error: "rate unavailable" }, { status: 503, headers: { "cache-control": "no-store" } })
    }
  },
}
