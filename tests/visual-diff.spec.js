/**
 * Visual regression test — screenshots every major route on localhost,
 * compares against the live StackRox Central UI at LIVE_URL,
 * and generates DIFF_REPORT.html with side-by-side comparisons.
 *
 * Usage:
 *   npx playwright test tests/visual-diff.spec.js
 *
 * Prerequisites:
 *   - Dev server running at http://localhost:5173
 *   - .env.local configured with VITE_STACKROX_URL and VITE_STACKROX_TOKEN
 */

import { test } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

function loadEnv() {
  const envPath = resolve(ROOT, '.env.local');
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
  }
  return env;
}

const env = loadEnv();
const LOCAL_BASE = 'http://localhost:5173';
const LIVE_BASE = (env.VITE_STACKROX_URL || '').replace(/\/+$/, '');
const API_TOKEN = env.VITE_STACKROX_TOKEN || '';

const SCREENSHOT_DIR = resolve(ROOT, 'tests', 'screenshots');
const DIFF_DIR = resolve(SCREENSHOT_DIR, 'diffs');

const V1_ROUTES = [
  { name: 'Dashboard', path: '/v1/main/dashboard' },
  { name: 'Network Graph', path: '/v1/main/network-graph' },
  { name: 'Violations', path: '/v1/main/violations' },
  { name: 'Compliance Coverage', path: '/v1/main/compliance/coverage' },
  { name: 'Compliance Schedules', path: '/v1/main/compliance/schedules' },
  { name: 'User Workloads', path: '/v1/main/vulnerabilities/user-workloads' },
  { name: 'Platform CVEs', path: '/v1/main/vulnerabilities/platform' },
  { name: 'Node CVEs', path: '/v1/main/vulnerabilities/node-cves' },
  { name: 'All Vulnerabilities', path: '/v1/main/vulnerabilities/all' },
  { name: 'Exception Management', path: '/v1/main/vulnerabilities/exception-management' },
  { name: 'Reports', path: '/v1/main/vulnerabilities/reports' },
  { name: 'Risk', path: '/v1/main/risk' },
  { name: 'Config Management', path: '/v1/main/configmanagement' },
  { name: 'Policies', path: '/v1/main/policy-management/policies' },
  { name: 'Clusters', path: '/v1/main/clusters' },
  { name: 'Collections', path: '/v1/main/collections' },
  { name: 'Integrations', path: '/v1/main/integrations' },
  { name: 'Access Control', path: '/v1/main/access-control' },
  { name: 'System Config', path: '/v1/main/systemconfig' },
  { name: 'System Health', path: '/v1/main/system-health' },
  { name: 'Administration Events', path: '/v1/main/administration-events' },
  { name: 'Listening Endpoints', path: '/v1/main/listening-endpoints' },
];

const LIVE_ROUTES = [
  { name: 'Dashboard', path: '/main/dashboard' },
  { name: 'Network Graph', path: '/main/network-graph' },
  { name: 'Violations', path: '/main/violations' },
  { name: 'Compliance Coverage', path: '/main/compliance/coverage' },
  { name: 'Compliance Schedules', path: '/main/compliance/schedules' },
  { name: 'User Workloads', path: '/main/vulnerabilities/workloadCves/cves' },
  { name: 'Platform CVEs', path: '/main/vulnerabilities/platformCves/cves' },
  { name: 'Node CVEs', path: '/main/vulnerabilities/nodeCves/cves' },
  { name: 'Exception Management', path: '/main/vulnerabilities/exceptionManagement/requests' },
  { name: 'Reports', path: '/main/vulnerabilities/reports' },
  { name: 'Risk', path: '/main/risk' },
  { name: 'Config Management', path: '/main/configmanagement' },
  { name: 'Policies', path: '/main/policy-management/policies' },
  { name: 'Clusters', path: '/main/clusters' },
  { name: 'Collections', path: '/main/collections' },
  { name: 'Integrations', path: '/main/integrations' },
  { name: 'Access Control', path: '/main/access-control' },
  { name: 'System Config', path: '/main/systemconfig' },
  { name: 'System Health', path: '/main/system-health' },
  { name: 'Administration Events', path: '/main/administration-events' },
  { name: 'Listening Endpoints', path: '/main/listening-endpoints' },
];

for (const dir of [SCREENSHOT_DIR, DIFF_DIR, resolve(SCREENSHOT_DIR, 'local'), resolve(SCREENSHOT_DIR, 'live')]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function diffImages(img1Path, img2Path, diffPath) {
  try {
    const img1 = PNG.sync.read(readFileSync(img1Path));
    const img2 = PNG.sync.read(readFileSync(img2Path));

    const width = Math.min(img1.width, img2.width);
    const height = Math.min(img1.height, img2.height);

    const img1Cropped = new PNG({ width, height });
    const img2Cropped = new PNG({ width, height });

    PNG.bitblt(img1, img1Cropped, 0, 0, width, height, 0, 0);
    PNG.bitblt(img2, img2Cropped, 0, 0, width, height, 0, 0);

    const diff = new PNG({ width, height });
    const mismatchedPixels = pixelmatch(
      img1Cropped.data, img2Cropped.data, diff.data,
      width, height,
      { threshold: 0.1, alpha: 0.3, diffColor: [255, 0, 0] }
    );

    writeFileSync(diffPath, PNG.sync.write(diff));

    const totalPixels = width * height;
    const mismatchPct = ((mismatchedPixels / totalPixels) * 100).toFixed(2);
    return { mismatchedPixels, totalPixels, mismatchPct: parseFloat(mismatchPct), width, height };
  } catch (err) {
    return { error: err.message, mismatchPct: 100 };
  }
}

test.describe('Visual Regression — Localhost Screenshots', () => {
  test.setTimeout(120_000);

  for (const route of V1_ROUTES) {
    test(`Screenshot: ${route.name}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${LOCAL_BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.waitForTimeout(2000);

      const slug = slugify(route.name);
      await page.screenshot({
        path: resolve(SCREENSHOT_DIR, 'local', `${slug}.png`),
        fullPage: true,
      });
    });
  }
});

test.describe('Visual Regression — Live Product Screenshots', () => {
  test.setTimeout(120_000);

  test.skip(!LIVE_BASE || !API_TOKEN, 'Live product URL or token not configured');

  for (const route of LIVE_ROUTES) {
    test(`Screenshot: ${route.name}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await page.context().addCookies([{
        name: 'token',
        value: API_TOKEN,
        domain: new URL(LIVE_BASE).hostname,
        path: '/',
        httpOnly: false,
        secure: true,
      }]);

      await page.goto(`${LIVE_BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.waitForTimeout(3000);

      const slug = slugify(route.name);
      await page.screenshot({
        path: resolve(SCREENSHOT_DIR, 'live', `${slug}.png`),
        fullPage: true,
      });
    });
  }
});

test.describe('Visual Diff — Compare Local vs Live', () => {
  test.setTimeout(60_000);

  test('Generate diff report', async () => {
    const localDir = resolve(SCREENSHOT_DIR, 'local');
    const liveDir = resolve(SCREENSHOT_DIR, 'live');

    if (!existsSync(localDir) || !existsSync(liveDir)) {
      test.skip(true, 'Screenshots not yet captured');
      return;
    }

    const localFiles = existsSync(localDir) ? readdirSync(localDir).filter(f => f.endsWith('.png')) : [];
    const liveFiles = existsSync(liveDir) ? readdirSync(liveDir).filter(f => f.endsWith('.png')) : [];

    const allSlugs = [...new Set([
      ...localFiles.map(f => f.replace('.png', '')),
      ...liveFiles.map(f => f.replace('.png', '')),
    ])].sort();

    const results = [];

    for (const slug of allSlugs) {
      const localPath = resolve(localDir, `${slug}.png`);
      const livePath = resolve(liveDir, `${slug}.png`);
      const diffPath = resolve(DIFF_DIR, `${slug}-diff.png`);

      const hasLocal = existsSync(localPath);
      const hasLive = existsSync(livePath);

      if (hasLocal && hasLive) {
        const result = diffImages(localPath, livePath, diffPath);
        results.push({ slug, status: result.mismatchPct <= 2 ? 'PASS' : 'FAIL', ...result });
      } else {
        results.push({
          slug,
          status: 'SKIP',
          mismatchPct: 0,
          note: hasLocal ? 'No live screenshot' : 'No local screenshot',
        });
      }
    }

    const html = generateDiffReport(results, allSlugs);
    const reportPath = resolve(ROOT, 'DIFF_REPORT.html');
    writeFileSync(reportPath, html);
    console.log(`\nDiff report written to: ${reportPath}`);
    console.log(`Total: ${results.length} | Pass: ${results.filter(r => r.status === 'PASS').length} | Fail: ${results.filter(r => r.status === 'FAIL').length} | Skip: ${results.filter(r => r.status === 'SKIP').length}`);
  });
});

function generateDiffReport(results, slugs) {
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const skipCount = results.filter(r => r.status === 'SKIP').length;
  const total = results.length;
  const score = total > 0 ? Math.round((passCount / (total - skipCount)) * 100) : 0;

  const rows = results.map(r => {
    const statusColor = r.status === 'PASS' ? '#3E8635' : r.status === 'FAIL' ? '#C9190B' : '#6A6E73';
    const statusBg = r.status === 'PASS' ? '#E7F4E4' : r.status === 'FAIL' ? '#FAEAE8' : '#F0F0F0';
    return `
      <tr>
        <td>${r.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
        <td><span style="background:${statusBg};color:${statusColor};padding:2px 8px;border-radius:12px;font-weight:600;font-size:12px">${r.status}</span></td>
        <td>${r.mismatchPct !== undefined ? r.mismatchPct + '%' : '—'}</td>
        <td>${r.mismatchedPixels !== undefined ? r.mismatchedPixels.toLocaleString() : r.note || '—'}</td>
        <td>
          ${r.status !== 'SKIP' ? `
            <details><summary>View</summary>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px">
                <div><strong>Local</strong><br><img src="tests/screenshots/local/${r.slug}.png" style="max-width:100%;border:1px solid #ddd"></div>
                <div><strong>Live</strong><br><img src="tests/screenshots/live/${r.slug}.png" style="max-width:100%;border:1px solid #ddd"></div>
                <div><strong>Diff</strong><br><img src="tests/screenshots/diffs/${r.slug}-diff.png" style="max-width:100%;border:1px solid #ddd"></div>
              </div>
            </details>
          ` : '—'}
        </td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Visual Diff Report — ACS Prototype</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'RedHatText', 'Helvetica Neue', Arial, sans-serif; background: #f0f0f0; color: #151515; }
    .header { background: #151515; color: #fff; padding: 24px 32px; }
    .header h1 { font-size: 24px; margin-bottom: 8px; }
    .header .meta { color: #b8bbbe; font-size: 14px; }
    .score-bar { display: flex; gap: 24px; padding: 16px 32px; background: #fff; border-bottom: 1px solid #d2d2d2; }
    .score-item { text-align: center; }
    .score-item .value { font-size: 28px; font-weight: 700; }
    .score-item .label { font-size: 12px; color: #6a6e73; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin: 16px 32px; max-width: calc(100% - 64px); background: #fff; border-radius: 8px; overflow: hidden; }
    th { background: #f0f0f0; padding: 10px 12px; text-align: left; font-size: 13px; font-weight: 600; border-bottom: 2px solid #d2d2d2; }
    td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; vertical-align: top; }
    tr:hover { background: #fafafa; }
    details summary { cursor: pointer; color: #0066cc; font-size: 12px; }
    img { border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Visual Diff Report</h1>
    <div class="meta">ACS Prototype vs Live Product — Generated ${new Date().toLocaleString()}</div>
  </div>
  <div class="score-bar">
    <div class="score-item"><div class="value" style="color:${score >= 90 ? '#3E8635' : score >= 70 ? '#EC7A08' : '#C9190B'}">${score}%</div><div class="label">Match Score</div></div>
    <div class="score-item"><div class="value">${total}</div><div class="label">Total Pages</div></div>
    <div class="score-item"><div class="value" style="color:#3E8635">${passCount}</div><div class="label">Pass (&le;2%)</div></div>
    <div class="score-item"><div class="value" style="color:#C9190B">${failCount}</div><div class="label">Fail (&gt;2%)</div></div>
    <div class="score-item"><div class="value" style="color:#6a6e73">${skipCount}</div><div class="label">Skipped</div></div>
  </div>
  <table>
    <thead><tr><th>Page</th><th>Status</th><th>Mismatch</th><th>Details</th><th>Comparison</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}
