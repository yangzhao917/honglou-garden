import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5173/');
await page.waitForLoadState('networkidle');
await page.click('text=诗词');
await page.waitForTimeout(500);
await page.locator('.poem-card').first().click();
await page.waitForTimeout(2000);

// 用 2D canvas 重新绘制并采样 —— 先截图再在浏览器里分析
const buf = await page.locator('.poem-cube-stage canvas').screenshot();
const analysis = await page.evaluate(async (b64) => {
  // 把截图路径放回，用 Image + 2d canvas 分析
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      // 中心 100x100 采样
      const data = ctx.getImageData(c.width/2-50, c.height/2-50, 100, 100).data;
      let nonDark = 0, darkBg = 0;
      const avg = [0,0,0];
      for (let i=0;i<data.length;i+=4){
        const lum = (data[i]+data[i+1]+data[i+2])/3;
        if (lum > 60) { nonDark++; avg[0]+=data[i];avg[1]+=data[i+1];avg[2]+=data[i+2]; }
        else darkBg++;
      }
      if (nonDark>0){avg[0]/=nonDark;avg[1]/=nonDark;avg[2]/=nonDark;}
      resolve({ w: img.width, h: img.height, nonDark, darkBg, avgColor: avg.map(Math.round) });
    };
    img.src = 'data:image/png;base64,' + b64;
  });
}, buf.toString('base64'));
console.log('analysis:', JSON.stringify(analysis));
await browser.close();
