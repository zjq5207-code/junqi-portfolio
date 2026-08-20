const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

(async () => {
  const videos = walk(process.env.PORTFOLIO_VIDEO_ROOT).filter(file => file.toLowerCase().endsWith('.mp4'));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PORTFOLIO_BROWSER });
  const page = await browser.newPage({ viewport: { width: 1440, height: Math.ceil(videos.length / 3) * 360 } });
  await page.setContent(`<style>
    *{box-sizing:border-box}body{margin:0;padding:20px;background:#08080a;color:white;font:18px sans-serif;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
    figure{margin:0;background:#151519;padding:10px}video{width:100%;height:280px;object-fit:cover;background:#000}figcaption{padding:10px 2px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  </style>${videos.map((file, i) => `<figure><video id="v${i}" muted preload="auto" src="${pathToFileURL(file).href}"></video><figcaption>${path.basename(file)}</figcaption></figure>`).join('')}`);
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    const items = [...document.querySelectorAll('video')];
    await Promise.all(items.map(v => new Promise(resolve => {
      const seek = () => { v.currentTime = Math.max(0.2, v.duration * .35); };
      const done = () => resolve();
      v.addEventListener('loadedmetadata', seek, { once: true });
      v.addEventListener('seeked', done, { once: true });
      v.addEventListener('error', done, { once: true });
      if (v.readyState >= 1) seek();
      setTimeout(done, 7000);
    })));
  });
  await page.screenshot({ path: process.env.PORTFOLIO_SHEET_OUT, fullPage: true });
  await browser.close();
})();
