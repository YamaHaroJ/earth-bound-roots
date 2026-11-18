// Records the live 3D bowl scene into picture sequences (Apple-style scroll film), plus where the bowl
// is in each picture so clicks on it still work.
// 1) npm run dev -- --port 5191   2) npm run capture   (uses the Chrome already installed on the Mac)
import { chromium } from 'playwright-core'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'

const BASE = process.env.CAPTURE_URL || 'http://localhost:5191/'
const QUALITY = Number(process.env.CAPTURE_QUALITY || 0.74)
const SETS = [
  // 1600x1000 at 92%, rendered at 3x and shrunk (crisp, and still ~9 ms a picture on Jay's Mac = smooth)
  { name: 'desktop', width: 1440, height: 900, dpr: 3, count: 320, quality: 0.92, out: [1600, 1000] },
  { name: 'mobile', width: 430, height: 932, dpr: 1.5, count: 240, quality: 0.9 },
]
const only = process.argv[2]

const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (const set of SETS.filter((s) => !only || s.name === only)) {
    // record into a side folder, swap in when complete (the live site never loses its pictures)
    const final = new URL(`../public/frames/${set.name}/`, import.meta.url)
    const dir = new URL(`../public/frames/${set.name}.recording/`, import.meta.url)
    await rm(dir, { recursive: true, force: true })
    await mkdir(dir, { recursive: true })
    const page = await browser.newPage({ viewport: { width: set.width, height: set.height }, deviceScaleFactor: 1 })
    await page.goto(`${BASE}?capture=1&dpr=${set.dpr}`)
    await page.waitForFunction(() => window.__capture)
    await page.waitForTimeout(800)
    await page.evaluate(() => (window.__capture.set(0), window.__capture.shot(), window.__capture.shot()))
    const bowl = []
    let bytes = 0
    const t0 = Date.now()
    for (let i = 0; i < set.count; i++) {
      const p = i / (set.count - 1)
      const r = await page.evaluate(([p, q, ow, oh]) => (window.__capture.set(p), window.__capture.shot(), window.__capture.shot(q, ow, oh)), [p, set.quality || QUALITY, ...(set.out || [0, 0])])
      const buf = Buffer.from(r.url.split(',')[1], 'base64')
      bytes += buf.length
      bowl.push(r.bowl)
      await writeFile(new URL(`f${String(i).padStart(3, '0')}.webp`, dir), buf)
    }
    await writeFile(
      new URL('manifest.json', dir),
      JSON.stringify({ count: set.count, width: set.out ? set.out[0] : set.width * set.dpr, height: set.out ? set.out[1] : set.height * set.dpr, bowl }),
    )
    await rm(final, { recursive: true, force: true })
    await rename(dir, final)
    console.log(`${set.name}: ${set.count} frames, ${(bytes / 1e6).toFixed(1)} MB, ${((Date.now() - t0) / 1000).toFixed(0)} s`)
    await page.close()
  }
} finally {
  await browser.close()
}
