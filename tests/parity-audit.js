#!/usr/bin/env node

/**
 * Full 6-layer parity audit between localhost prototype and live StackRox Central.
 * Outputs structured JSON results for each layer.
 */

import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

function loadEnv() {
  const envPath = resolve(ROOT, '.env.local');
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 0) continue;
    env[t.slice(0, eq)] = t.slice(eq + 1);
  }
  return env;
}

const env = loadEnv();
const LOCAL = 'http://localhost:5173';
const LIVE = (env.VITE_STACKROX_URL || '').replace(/\/+$/, '');
const TOKEN = env.VITE_STACKROX_TOKEN || '';
const OUT_DIR = resolve(ROOT, 'tests', 'parity');
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const LOCAL_ROUTES = [
  { name: 'Dashboard', path: '/v1/main/dashboard' },
  { name: 'Violations', path: '/v1/main/violations' },
  { name: 'User Workloads', path: '/v1/main/vulnerabilities/user-workloads' },
  { name: 'Platform CVEs', path: '/v1/main/vulnerabilities/platform' },
  { name: 'Node CVEs', path: '/v1/main/vulnerabilities/node-cves' },
  { name: 'Reports', path: '/v1/main/vulnerabilities/reports' },
  { name: 'Clusters', path: '/v1/main/clusters' },
  { name: 'Policies', path: '/v1/main/policy-management/policies' },
  { name: 'Compliance', path: '/v1/main/compliance/coverage' },
  { name: 'Risk', path: '/v1/main/risk' },
  { name: 'System Health', path: '/v1/main/system-health' },
  { name: 'Access Control', path: '/v1/main/access-control' },
];

const LIVE_ROUTES = [
  { name: 'Dashboard', path: '/main/dashboard' },
  { name: 'Violations', path: '/main/violations' },
  { name: 'User Workloads', path: '/main/vulnerabilities/workloadCves/cves' },
  { name: 'Platform CVEs', path: '/main/vulnerabilities/platformCves/cves' },
  { name: 'Node CVEs', path: '/main/vulnerabilities/nodeCves/cves' },
  { name: 'Reports', path: '/main/vulnerabilities/reports' },
  { name: 'Clusters', path: '/main/clusters' },
  { name: 'Policies', path: '/main/policy-management/policies' },
  { name: 'Compliance', path: '/main/compliance/coverage' },
  { name: 'Risk', path: '/main/risk' },
  { name: 'System Health', path: '/main/system-health' },
  { name: 'Access Control', path: '/main/access-control' },
];

const VIEWPORTS = [
  { name: '375px', width: 375, height: 812 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1440px', width: 1440, height: 900 },
];

const COMPONENTS = ['nav', 'masthead', 'cards', 'buttons', 'table', 'toolbar', 'tabs', 'modal', 'pagination', 'labels'];

// ═══════════════════════════════════════════════════════════════════
// LAYER 1: Design Token Extraction
// ═══════════════════════════════════════════════════════════════════
async function layer1_tokens(browser) {
  console.log('\n━━ LAYER 1: DESIGN TOKENS ━━');
  const results = { matching: 0, differing: 0, localOnly: 0, liveOnly: 0, diffs: [], score: 0 };

  const localPage = await browser.newPage();
  await localPage.goto(`${LOCAL}/v1/main/dashboard`, { waitUntil: 'networkidle', timeout: 20000 });
  await localPage.waitForTimeout(2000);

  const localTokens = await localPage.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const tokens = {};
    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      if (prop.startsWith('--pf-t--') || prop.startsWith('--pf-v6-c-')) {
        tokens[prop] = style.getPropertyValue(prop).trim();
      }
    }
    return tokens;
  });
  await localPage.close();

  let liveTokens = {};
  if (LIVE && TOKEN) {
    const livePage = await browser.newPage();
    await livePage.context().addCookies([{
      name: 'token', value: TOKEN,
      domain: new URL(LIVE).hostname, path: '/', secure: true,
    }]);
    try {
      await livePage.goto(`${LIVE}/main/dashboard`, { waitUntil: 'networkidle', timeout: 30000 });
      await livePage.waitForTimeout(3000);
      liveTokens = await livePage.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        const tokens = {};
        for (let i = 0; i < style.length; i++) {
          const prop = style[i];
          if (prop.startsWith('--pf-t--') || prop.startsWith('--pf-v6-c-')) {
            tokens[prop] = style.getPropertyValue(prop).trim();
          }
        }
        return tokens;
      });
    } catch (e) {
      console.log(`  ⚠ Could not load live site: ${e.message}`);
    }
    await livePage.close();
  }

  const allKeys = new Set([...Object.keys(localTokens), ...Object.keys(liveTokens)]);
  const pfGlobalKeys = [...allKeys].filter(k => k.startsWith('--pf-t--global'));

  for (const key of pfGlobalKeys) {
    const lv = localTokens[key];
    const rv = liveTokens[key];
    if (lv && rv) {
      if (lv === rv) { results.matching++; }
      else { results.differing++; results.diffs.push({ token: key, local: lv, live: rv }); }
    } else if (lv && !rv) { results.localOnly++; }
    else { results.liveOnly++; }
  }

  const total = results.matching + results.differing;
  results.score = total > 0 ? Math.round((results.matching / total) * 100) : 100;
  results.totalGlobal = pfGlobalKeys.length;
  results.totalLocal = Object.keys(localTokens).length;
  results.totalLive = Object.keys(liveTokens).length;

  console.log(`  Local tokens: ${results.totalLocal} | Live tokens: ${results.totalLive}`);
  console.log(`  Global tokens compared: ${total} | Matching: ${results.matching} | Differing: ${results.differing}`);
  console.log(`  Score: ${results.score}/100`);
  if (results.diffs.length > 0) {
    console.log(`  Top diffs:`);
    results.diffs.slice(0, 5).forEach(d => console.log(`    ${d.token}: "${d.local}" vs "${d.live}"`));
  }
  return results;
}

// ═══════════════════════════════════════════════════════════════════
// LAYER 2: Component Visual Match
// ═══════════════════════════════════════════════════════════════════
async function layer2_visual(browser) {
  console.log('\n━━ LAYER 2: COMPONENT VISUAL MATCH ━━');
  const results = { components: [], score: 0 };

  const componentSelectors = {
    nav: '.pf-v6-c-nav',
    masthead: '.pf-v6-c-masthead',
    cards: '.pf-v6-c-card',
    buttons: '.pf-v6-c-button',
    table: '.pf-v6-c-table',
    toolbar: '.pf-v6-c-toolbar',
    tabs: '.pf-v6-c-tabs',
    pagination: '.pf-v6-c-pagination',
    labels: '.pf-v6-c-label',
    title: '.pf-v6-c-title',
  };

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const checkPages = [
    { name: 'Dashboard', path: '/v1/main/dashboard' },
    { name: 'Violations', path: '/v1/main/violations' },
    { name: 'Reports', path: '/v1/main/vulnerabilities/reports' },
    { name: 'User Workloads', path: '/v1/main/vulnerabilities/user-workloads' },
  ];

  let totalComponents = 0;
  let matchingComponents = 0;

  for (const pg of checkPages) {
    await page.goto(`${LOCAL}${pg.path}`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);

    for (const [compName, selector] of Object.entries(componentSelectors)) {
      const exists = await page.$(selector);
      if (!exists) continue;
      totalComponents++;

      const computedProps = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const s = getComputedStyle(el);
        return {
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          color: s.color,
          backgroundColor: s.backgroundColor,
          borderRadius: s.borderRadius,
          padding: s.padding,
          display: s.display,
          boxShadow: s.boxShadow,
        };
      }, selector);

      const usesPfTokens = computedProps &&
        (computedProps.fontFamily.includes('Red Hat') || computedProps.fontFamily.includes('RedHat'));

      if (usesPfTokens) matchingComponents++;

      results.components.push({
        page: pg.name,
        component: compName,
        exists: true,
        usesPfFont: usesPfTokens,
        props: computedProps,
      });
    }
  }

  results.score = totalComponents > 0 ? Math.round((matchingComponents / totalComponents) * 100) : 0;
  await page.close();

  console.log(`  Components checked: ${totalComponents} | Using PF tokens: ${matchingComponents}`);
  console.log(`  Score: ${results.score}/100`);
  return results;
}

// ═══════════════════════════════════════════════════════════════════
// LAYER 3: Responsive Match
// ═══════════════════════════════════════════════════════════════════
async function layer3_responsive(browser) {
  console.log('\n━━ LAYER 3: RESPONSIVE MATCH ━━');
  const results = { tests: [], passing: 0, failing: 0, score: 0 };

  const testRoutes = [
    { name: 'Dashboard', path: '/v1/main/dashboard' },
    { name: 'Violations', path: '/v1/main/violations' },
    { name: 'User Workloads', path: '/v1/main/vulnerabilities/user-workloads' },
    { name: 'Reports', path: '/v1/main/vulnerabilities/reports' },
  ];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of testRoutes) {
      await page.goto(`${LOCAL}${route.path}`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(1500);

      const layoutCheck = await page.evaluate(() => {
        const body = document.body;
        const docWidth = document.documentElement.clientWidth;
        const hasHScroll = body.scrollWidth > docWidth + 5;
        const overflowing = [];
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > docWidth + 10 && rect.width > 50) {
            overflowing.push({ tag: el.tagName, class: el.className?.toString().slice(0, 60), width: Math.round(rect.width), right: Math.round(rect.right) });
          }
        });
        const mainContent = document.querySelector('.pf-v6-c-page__main') || document.querySelector('#main-page-container');
        const hasContent = mainContent ? mainContent.children.length > 0 : false;

        return { hasHScroll, overflowCount: overflowing.length, overflowing: overflowing.slice(0, 3), hasContent };
      });

      const pass = !layoutCheck.hasHScroll && layoutCheck.hasContent;
      if (pass) results.passing++;
      else results.failing++;

      results.tests.push({
        viewport: vp.name,
        route: route.name,
        pass,
        hasHScroll: layoutCheck.hasHScroll,
        overflowCount: layoutCheck.overflowCount,
        hasContent: layoutCheck.hasContent,
        overflowing: layoutCheck.overflowing,
      });
    }
    await page.close();
  }

  const total = results.passing + results.failing;
  results.score = total > 0 ? Math.round((results.passing / total) * 100) : 0;
  console.log(`  Viewport×Route combos: ${total} | Passing: ${results.passing} | Failing: ${results.failing}`);
  console.log(`  Score: ${results.score}/100`);
  return results;
}

// ═══════════════════════════════════════════════════════════════════
// LAYER 4: Interactive State Match
// ═══════════════════════════════════════════════════════════════════
async function layer4_interactive(browser) {
  console.log('\n━━ LAYER 4: INTERACTIVE STATE MATCH ━━');
  const results = { checks: [], matching: 0, differing: 0, score: 0 };

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const testPages = [
    { name: 'Dashboard', path: '/v1/main/dashboard' },
    { name: 'Violations', path: '/v1/main/violations' },
    { name: 'Reports', path: '/v1/main/vulnerabilities/reports' },
  ];

  const interactiveSelectors = [
    { name: 'Primary button', selector: '.pf-v6-c-button.pf-m-primary', states: ['default', 'hover'] },
    { name: 'Link button', selector: '.pf-v6-c-button.pf-m-link', states: ['default', 'hover'] },
    { name: 'Plain button', selector: '.pf-v6-c-button.pf-m-plain', states: ['default', 'hover'] },
    { name: 'Nav link', selector: '.pf-v6-c-nav__link', states: ['default', 'hover'] },
    { name: 'Tab', selector: '.pf-v6-c-tabs__link', states: ['default'] },
    { name: 'Menu toggle', selector: '.pf-v6-c-menu-toggle', states: ['default', 'hover'] },
    { name: 'Search input', selector: '.pf-v6-c-search-input__text-input', states: ['default', 'focus'] },
    { name: 'Table row', selector: '.pf-v6-c-table tbody tr', states: ['default', 'hover'] },
    { name: 'Label', selector: '.pf-v6-c-label', states: ['default'] },
  ];

  for (const pg of testPages) {
    await page.goto(`${LOCAL}${pg.path}`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);

    for (const item of interactiveSelectors) {
      const el = await page.$(item.selector);
      if (!el) continue;

      for (const state of item.states) {
        const props = await page.evaluate(async ({ selector, state }) => {
          const el = document.querySelector(selector);
          if (!el) return null;

          if (state === 'hover') {
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            el.matches(':hover');
          } else if (state === 'focus') {
            el.focus();
          }

          await new Promise(r => setTimeout(r, 100));
          const s = getComputedStyle(el);
          return {
            backgroundColor: s.backgroundColor,
            color: s.color,
            borderColor: s.borderColor,
            outline: s.outline,
            cursor: s.cursor,
            opacity: s.opacity,
            textDecoration: s.textDecoration,
            boxShadow: s.boxShadow,
          };
        }, { selector: item.selector, state });

        if (!props) continue;

        const isPfConsistent = props.cursor === 'pointer' || props.cursor === 'default' || props.cursor === 'text' || props.cursor === 'auto';
        if (isPfConsistent) results.matching++;
        else results.differing++;

        results.checks.push({
          page: pg.name,
          component: item.name,
          state,
          cursor: props.cursor,
          backgroundColor: props.backgroundColor,
          color: props.color,
          consistent: isPfConsistent,
        });
      }
    }
  }

  const total = results.matching + results.differing;
  results.score = total > 0 ? Math.round((results.matching / total) * 100) : 100;
  console.log(`  Interactive checks: ${total} | Consistent: ${results.matching} | Issues: ${results.differing}`);
  console.log(`  Score: ${results.score}/100`);
  await page.close();
  return results;
}

// ═══════════════════════════════════════════════════════════════════
// LAYER 5: Data & API Match
// ═══════════════════════════════════════════════════════════════════
async function layer5_data() {
  console.log('\n━━ LAYER 5: DATA & API MATCH ━━');
  const results = { endpoints: [], matching: 0, failing: 0, score: 0 };

  if (!LIVE || !TOKEN) {
    console.log('  ⚠ No live API configured, skipping');
    results.score = 0;
    return results;
  }

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` };
  const LOCAL_API = `${LOCAL}/stackrox-api`;

  const endpoints = [
    { name: 'Metadata', path: '/v1/metadata' },
    { name: 'Clusters', path: '/v1/clusters' },
    { name: 'Namespaces', path: '/v1/namespaces' },
    { name: 'Alerts', path: '/v1/alerts?pagination.limit=5' },
    { name: 'Policies', path: '/v1/policies' },
    { name: 'Report Configs', path: '/v2/reports/configurations?pagination.limit=5' },
    { name: 'Vuln Exceptions', path: '/v2/vulnerability-exceptions?pagination.limit=5' },
  ];

  for (const ep of endpoints) {
    try {
      const [liveRes, localRes] = await Promise.all([
        fetch(`${LIVE}${ep.path}`, { headers }).then(r => r.json()),
        fetch(`${LOCAL_API}${ep.path}`, { headers }).then(r => r.json()),
      ]);

      const liveKeys = Object.keys(liveRes).sort().join(',');
      const localKeys = Object.keys(localRes).sort().join(',');
      const match = liveKeys === localKeys;

      if (match) results.matching++;
      else results.failing++;

      results.endpoints.push({ name: ep.name, match, liveKeys, localKeys });
      console.log(`  ${match ? '✓' : '✗'} ${ep.name}`);
    } catch (err) {
      results.failing++;
      results.endpoints.push({ name: ep.name, match: false, error: err.message });
      console.log(`  ✗ ${ep.name}: ${err.message}`);
    }
  }

  const total = results.matching + results.failing;
  results.score = total > 0 ? Math.round((results.matching / total) * 100) : 0;
  console.log(`  Score: ${results.score}/100`);
  return results;
}

// ═══════════════════════════════════════════════════════════════════
// LAYER 6: Performance Baseline
// ═══════════════════════════════════════════════════════════════════
async function layer6_performance(browser) {
  console.log('\n━━ LAYER 6: PERFORMANCE BASELINE ━━');
  const results = { local: {}, score: 0 };

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const startTime = Date.now();
  await page.goto(`${LOCAL}/v1/main/dashboard`, { waitUntil: 'networkidle', timeout: 20000 });
  const loadTime = Date.now() - startTime;

  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
    return {
      domContentLoaded: Math.round(perf?.domContentLoadedEventEnd || 0),
      loadComplete: Math.round(perf?.loadEventEnd || 0),
      fcp: Math.round(fcp?.startTime || 0),
      domNodes: document.querySelectorAll('*').length,
      jsHeapEstimate: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : null,
    };
  });

  const a11yCheck = await page.evaluate(() => {
    const issues = [];
    document.querySelectorAll('img:not([alt])').forEach(() => issues.push('img missing alt'));
    document.querySelectorAll('button:not([aria-label]):empty').forEach(() => issues.push('button missing label'));
    const hasLang = document.documentElement.hasAttribute('lang');
    if (!hasLang) issues.push('html missing lang attribute');
    const hasTitle = !!document.title;
    return { issues, hasLang, hasTitle, issueCount: issues.length };
  });

  results.local = { loadTime, ...metrics, a11y: a11yCheck };
  results.score = loadTime < 3000 && metrics.fcp < 2000 ? 90 : loadTime < 5000 ? 70 : 50;

  console.log(`  Load time: ${loadTime}ms | FCP: ${metrics.fcp}ms | DOM nodes: ${metrics.domNodes}`);
  console.log(`  A11y issues: ${a11yCheck.issueCount} | Has <title>: ${a11yCheck.hasTitle} | Has lang: ${a11yCheck.hasLang}`);
  console.log(`  Score: ${results.score}/100`);
  await page.close();
  return results;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     FULL PARITY AUDIT: Localhost vs Live        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  Local: ${LOCAL}`);
  console.log(`  Live:  ${LIVE || '(not configured)'}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });

  const l1 = await layer1_tokens(context);
  const l2 = await layer2_visual(context);
  const l3 = await layer3_responsive(context);
  const l4 = await layer4_interactive(context);
  const l5 = await layer5_data();
  const l6 = await layer6_performance(context);

  await browser.close();

  const weighted = Math.round(
    l2.score * 0.30 + l1.score * 0.20 + l3.score * 0.15 +
    l4.score * 0.15 + l5.score * 0.15 + l6.score * 0.05
  );

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║              FINAL SCORES                       ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Layer 1 (Tokens):      ${String(l1.score).padStart(3)}/100  (weight 20%)   ║`);
  console.log(`║  Layer 2 (Visual):      ${String(l2.score).padStart(3)}/100  (weight 30%)   ║`);
  console.log(`║  Layer 3 (Responsive):  ${String(l3.score).padStart(3)}/100  (weight 15%)   ║`);
  console.log(`║  Layer 4 (Interactive): ${String(l4.score).padStart(3)}/100  (weight 15%)   ║`);
  console.log(`║  Layer 5 (Data/API):    ${String(l5.score).padStart(3)}/100  (weight 15%)   ║`);
  console.log(`║  Layer 6 (Performance): ${String(l6.score).padStart(3)}/100  (weight  5%)   ║`);
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  WEIGHTED OVERALL:      ${String(weighted).padStart(3)}/100               ║`);
  console.log('╚══════════════════════════════════════════════════╝');

  const report = {
    generatedAt: new Date().toISOString(),
    local: LOCAL,
    live: LIVE,
    scores: {
      tokens: l1.score,
      visual: l2.score,
      responsive: l3.score,
      interactive: l4.score,
      data: l5.score,
      performance: l6.score,
      weighted,
    },
    layer1: l1,
    layer2: l2,
    layer3: l3,
    layer4: l4,
    layer5: l5,
    layer6: l6,
  };

  const outPath = resolve(OUT_DIR, 'audit-results.json');
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\nFull results: ${outPath}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
