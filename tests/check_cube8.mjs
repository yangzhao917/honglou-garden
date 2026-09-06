import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5173/');
await page.waitForLoadState('networkidle');
await page.click('text=诗词');
await page.waitForTimeout(500);
await page.locator('.poem-card').first().click();
await page.waitForTimeout(2500); // 等图片加载

const analysis = await page.evaluate(() => {
  const canvas = document.querySelector('.poem-cube-stage canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  const w = 80, h = 80;
  const px = new Uint8Array(w*h*4);
  gl.readPixels(gl.drawingBufferWidth/2 - w/2, gl.drawingBufferHeight/2 - h/2, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  let nonDark = 0;
  const avg = [0,0,0];
  for (let i=0;i<px.length;i+=4){
    const lum=(px[i]+px[i+1]+px[i+2])/3;
    if (lum>60){nonDark++;avg[0]+=px[i];avg[1]+=px[i+1];avg[2]+=px[i+2];}
  }
  if(nonDark>0){avg[0]=Math.round(avg[0]/nonDark);avg[1]=Math.round(avg[1]/nonDark);avg[2]=Math.round(avg[2]/nonDark);}
  return { w: gl.drawingBufferWidth, h: gl.drawingBufferHeight, nonDark, total: w*h, avgColor: avg };
});
console.log('text face center:', JSON.stringify(analysis));

// 切到意境再测
await page.locator('button[role="tab"]', { hasText: '意境' }).click();
await page.waitForTimeout(1500);
const analysisArt = await page.evaluate(() => {
  const canvas = document.querySelector('.poem-cube-stage canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  const w = 80, h = 80;
  const px = new Uint8Array(w*h*4);
  gl.readPixels(gl.drawingBufferWidth/2 - w/2, gl.drawingBufferHeight/2 - h/2, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  let nonDark = 0;
  const avg = [0,0,0];
  for (let i=0;i<px.length;i+=4){
    const lum=(px[i]+px[i+1]+px[i+2])/3;
    if (lum>60){nonDark++;avg[0]+=px[i];avg[1]+=px[i+1];avg[2]+=px[i+2];}
  }
  if(nonDark>0){avg[0]=Math.round(avg[0]/nonDark);avg[1]=Math.round(avg[1]/nonDark);avg[2]=Math.round(avg[2]/nonDark);}
  return { nonDark, total: w*h, avgColor: avg };
});
console.log('art face center:', JSON.stringify(analysisArt));
await browser.close();
