import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
// 监听控制台错误
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('PAGE: ' + e.message));

await page.goto('http://localhost:5173/');
await page.waitForLoadState('networkidle');
await page.click('text=诗词');
await page.waitForTimeout(500);
await page.locator('.poem-card').first().click();
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const stage = document.querySelector('.poem-cube-stage');
  const canvas = stage.querySelector('canvas');
  const actions = document.querySelector('.poem-cube-actions');
  return {
    canvas: canvas ? `${canvas.width}x${canvas.height}` : null,
    actions: actions ? actions.textContent.trim() : null,
    stageBg: getComputedStyle(stage).background,
  };
});
console.log('info:', JSON.stringify(info, null, 2));
console.log('errors:', JSON.stringify(errors.slice(0, 10), null, 2));

await page.screenshot({ path: '/tmp/cube_final_text.png', clip: { x: 350, y: 60, width: 700, height: 800 } });

// 点意境
await page.locator('button[role="tab"]', { hasText: '意境' }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/cube_final_mid.png', clip: { x: 350, y: 60, width: 700, height: 800 } });
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/cube_final_art.png', clip: { x: 350, y: 60, width: 700, height: 800 } });

await browser.close();
