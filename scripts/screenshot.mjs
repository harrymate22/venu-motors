/**
 * Reusable dev screenshot helper (kept in the repo so we never reinstall puppeteer).
 *
 * Usage:
 *   node scripts/screenshot.mjs --out=hero
 *   node scripts/screenshot.mjs --out=portfolio --w=1440 --h=900 --selector="section.bg-white"
 *   node scripts/screenshot.mjs --out=full --full           (full-page capture)
 *   node scripts/screenshot.mjs --out=modal --click='button[aria-label^="Play"]'
 *
 * Flags: --url --w --h --out --selector (scrollIntoView) --scrollY --click --full --wait
 * Output: .screenshots/<out>.png
 */
import { mkdirSync } from "node:fs"
import puppeteer from "puppeteer-core"

const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const s = a.replace(/^--/, "")
    const i = s.indexOf("=")
    return i === -1 ? [s, true] : [s.slice(0, i), s.slice(i + 1)]
  })
)

const {
  url = "http://localhost:5173/",
  w = "1440",
  h = "900",
  out = "shot",
  selector,
  scrollY,
  click,
  full,
  wait = "900",
} = args

mkdirSync(".screenshots", { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars"],
})
const page = await browser.newPage()
await page.setViewport({ width: Number(w), height: Number(h) })
await page.goto(url, { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 800))

if (selector) {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: "center" })
  }, selector)
}
if (scrollY) await page.evaluate((y) => window.scrollTo(0, Number(y)), scrollY)
if (click) {
  await page.click(String(click))
}
await new Promise((r) => setTimeout(r, Number(wait)))

const path = `.screenshots/${out}.png`
await page.screenshot({ path, fullPage: Boolean(full) })
await browser.close()
console.log(`saved ${path}`)
