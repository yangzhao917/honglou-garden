import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const outputDir = "docs/screenshots";
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1600, height: 1050 } });

// 文档截图只验证已实现的界面，不触发付费图片生成。
await page.route("**/api/poem-image", (route) =>
  route.fulfill({
    status: 503,
    contentType: "application/json",
    body: JSON.stringify({ error: "disabled_during_documentation_capture" }),
  }),
);

await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "游览潇湘馆", exact: true }).waitFor();
await page.waitForTimeout(2500);
await page.screenshot({ path: `${outputDir}/garden-overview.png`, fullPage: true });

await page.getByRole("navigation").getByRole("button", { name: "人物" }).click();
await page.getByRole("textbox", { name: "搜索人物" }).fill("黛玉");
await page.locator(".person-card").first().click();
await page.locator(".relation-graph").waitFor();
await page.waitForTimeout(800);
await page.screenshot({ path: `${outputDir}/character-relations.png`, fullPage: true });

await page.getByRole("button", { name: "关闭" }).click();
await page.getByRole("navigation").getByRole("button", { name: "诗词" }).click();
await page.getByRole("textbox", { name: "搜索诗词" }).fill("半卷湘帘");
await page.locator(".poem-card").first().click();
await page.getByRole("dialog").waitFor();
await page.waitForTimeout(500);
await page.screenshot({ path: `${outputDir}/poem-reader.png`, fullPage: true });

const overlay = await page.locator(".vite-error-overlay").count();
const hasContent = (await page.locator("body").innerText()).trim().length > 0;
if (overlay || !hasContent) process.exitCode = 1;

await browser.close();
