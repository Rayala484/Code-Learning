/*
  Vercel build step: fetches the site files from the public GitHub repository at a
  pinned commit and writes them to public/, which Vercel serves.
  To publish a newer version, change SOURCE_SHA to the new commit and redeploy.
*/
import { mkdir, writeFile } from "node:fs/promises"
import { dirname } from "node:path"

const SOURCE_SHA = process.env.SOURCE_SHA || "893084e4b668e24033cade3f4a1575ffef8b5eff"
const BASE = `https://raw.githubusercontent.com/rayala484/code-learning/${SOURCE_SHA}/trust-gold-services/`
const FILES = [
  "index.html", "styles.css", "script.js", "i18n.js", "config.js",
  "assets/apple-touch-icon.png", "assets/favicon.png", "assets/logo.webp", "assets/og-image.jpg",
  "assets/owner-office.webp", "assets/hero-1.webp", "assets/hero-2.webp", "assets/hero-3.webp", "assets/hero-4.webp",
]

for (const f of FILES) {
  const res = await fetch(BASE + f)
  if (!res.ok) throw new Error(`Could not fetch ${f}: ${res.status}`)
  const out = "public/" + f
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, Buffer.from(await res.arrayBuffer()))
  console.log("fetched", f)
}
