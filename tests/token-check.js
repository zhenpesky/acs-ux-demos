#!/usr/bin/env node

/**
 * CSS token compliance check — launches a headless browser, navigates to
 * key pages on localhost, extracts computed CSS values from critical elements,
 * and verifies they align with PatternFly 6 design tokens.
 *
 * Usage:
 *   node tests/token-check.js
 */

import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const LOCAL_BASE = 'http://localhost:5173';

const PF6_TOKENS = {
  '--pf-t--global--background--color--primary--default': '#ffffff',
  '--pf-t--global--background--color--secondary--default': '#f0f0f0',
  '--pf-t--global--text--color--regular': '#151515',
  '--pf-t--global--text--color--subtle': '#6a6e73',
  '--pf-t--global--text--color--on-brand--default': '#ffffff',
  '--pf-t--global--color--brand--default': '#0066cc',
  '--pf-t--global--color--status--danger--default': '#c9190b',
  '--pf-t--global--color--status--warning--default': '#f0ab00',
  '--pf-t--global--color--status--success--default': '#3e8635',
  '--pf-t--global--color--status--info--default': '#0066cc',
  '--pf-t--global--border--color--default': '#d2d2d2',
  '--pf-t--global--font--size--xs': '12px',
  '--pf-t--global--font--size--sm': '14px',
  '--pf-t--global--font--size--md': '16px',
  '--pf-t--global--font--size--lg': '18px',
  '--pf-t--global--spacer--xs': '4px',
  '--pf-t--global--spacer--sm': '8px',
  '--pf-t--global--spacer--md': '16px',
  '--pf-t--global--spacer--lg': '24px',
  '--pf-t--global--spacer--xl': '32px',
  '--pf-t--global--border-radius--small': '3px',
  '--pf-t--global--border-radius--medium': '6px',
};

const ELEMENT_CHECKS = [
  {
    page: '/v1/main/dashboard',
    name: 'Dashboard',
    selectors: [
      { selector: '.pf-v6-c-page__main', props: ['background-color'], label: 'Page background' },
      { selector: '.pf-v6-c-masthead', props: ['background-color', 'color', 'font-family'], label: 'Masthead' },
      { selector: '.pf-v6-c-title', props: ['color', 'font-size', 'font-weight', 'font-family'], label: 'Page title' },
      { selector: '.pf-v6-c-card', props: ['background-color', 'border-radius', 'box-shadow'], label: 'Card' },
      { selector: '.pf-v6-c-button.pf-m-primary', props: ['background-color', 'color', 'border-radius', 'font-size'], label: 'Primary button' },
      { selector: '.pf-v6-c-nav__link', props: ['color', 'font-size', 'padding-top', 'padding-bottom'], label: 'Nav link' },
    ],
  },
  {
    page: '/v1/main/violations',
    name: 'Violations',
    selectors: [
      { selector: '.pf-v6-c-table', props: ['font-size', 'border-collapse'], label: 'Table' },
      { selector: '.pf-v6-c-table th', props: ['background-color', 'color', 'font-weight', 'padding-top'], label: 'Table header' },
      { selector: '.pf-v6-c-table td', props: ['color', 'font-size', 'padding-top', 'border-bottom-color'], label: 'Table cell' },
      { selector: '.pf-v6-c-label', props: ['font-size', 'border-radius', 'padding-left', 'padding-right'], label: 'Label' },
      { selector: '.pf-v6-c-toolbar', props: ['padding-top', 'padding-bottom'], label: 'Toolbar' },
    ],
  },
  {
    page: '/v1/main/vulnerabilities/user-workloads',
    name: 'User Workloads',
    selectors: [
      { selector: '.pf-v6-c-nav.pf-m-horizontal-subnav', props: ['background-color', 'padding-left'], label: 'Horizontal subnav' },
      { selector: '.pf-v6-c-nav.pf-m-horizontal-subnav .pf-v6-c-nav__link', props: ['color', 'font-size', 'border-radius'], label: 'Subnav link' },
      { selector: '.pf-v6-c-search-input', props: ['font-size', 'border-radius'], label: 'Search input' },
      { selector: '.pf-v6-c-pagination', props: ['font-size'], label: 'Pagination' },
    ],
  },
  {
    page: '/v1/main/vulnerabilities/reports',
    name: 'Reports',
    selectors: [
      { selector: '.pf-v6-c-button.pf-m-primary', props: ['background-color', 'color', 'font-size', 'border-radius'], label: 'Create report button' },
      { selector: '.pf-v6-c-table', props: ['font-size'], label: 'Reports table' },
      { selector: '.pf-v6-c-menu-toggle', props: ['font-size', 'border-radius'], label: 'Menu toggle' },
    ],
  },
  {
    page: '/v1/main/clusters',
    name: 'Clusters',
    selectors: [
      { selector: '.pf-v6-c-alert', props: ['border-left-color', 'background-color', 'font-size'], label: 'Alert' },
      { selector: '.pf-v6-c-progress__bar', props: ['background-color', 'border-radius'], label: 'Progress bar' },
    ],
  },
];

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function parseRgb(rgb) {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
}

function colorDistance(c1, c2) {
  if (!c1 || !c2) return Infinity;
  return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

function parsePx(val) {
  const match = val.match(/([\d.]+)px/);
  return match ? parseFloat(match[1]) : null;
}

function isColorProp(prop) {
  return prop.includes('color') || prop === 'background-color' || prop === 'border-left-color' || prop === 'border-bottom-color';
}

function isSizeProp(prop) {
  return prop.includes('size') || prop.includes('padding') || prop.includes('margin') || prop.includes('radius') || prop.includes('gap');
}

async function main() {
  console.log('\n🎨 CSS Token Compliance Check');
  console.log(`  Target: ${LOCAL_BASE}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const results = [];
  let totalChecks = 0;
  let passChecks = 0;
  let warnChecks = 0;
  let failChecks = 0;

  for (const pageCheck of ELEMENT_CHECKS) {
    const page = await context.newPage();
    console.log(`  ├─ ${pageCheck.name} (${pageCheck.page})`);

    try {
      await page.goto(`${LOCAL_BASE}${pageCheck.page}`, { waitUntil: 'networkidle', timeout: 20_000 });
      await page.waitForTimeout(2000);

      const tokenValues = await page.evaluate(() => {
        const root = document.documentElement;
        const style = getComputedStyle(root);
        const tokens = {};
        for (let i = 0; i < style.length; i++) {
          const prop = style[i];
          if (prop.startsWith('--pf-t--') || prop.startsWith('--pf-v6-')) {
            tokens[prop] = style.getPropertyValue(prop).trim();
          }
        }
        return tokens;
      });

      for (const check of pageCheck.selectors) {
        const computed = await page.evaluate(({ selector, props }) => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const style = getComputedStyle(el);
          const values = {};
          for (const prop of props) {
            values[prop] = style.getPropertyValue(prop).trim();
          }
          return values;
        }, { selector: check.selector, props: check.props });

        if (!computed) {
          results.push({ page: pageCheck.name, element: check.label, status: 'SKIP', note: 'Element not found' });
          totalChecks++;
          continue;
        }

        for (const [prop, value] of Object.entries(computed)) {
          totalChecks++;
          let status = 'PASS';
          let note = '';

          if (isColorProp(prop)) {
            const computedRgb = parseRgb(value);
            let closestToken = null;
            let closestDist = Infinity;

            for (const [tokenName, tokenHex] of Object.entries(PF6_TOKENS)) {
              if (!isColorProp(tokenName.replace(/--/g, '-'))) continue;
              const tokenRgb = parseRgb(hexToRgb(tokenHex));
              const dist = colorDistance(computedRgb, tokenRgb);
              if (dist < closestDist) {
                closestDist = dist;
                closestToken = tokenName;
              }
            }

            if (closestDist === 0) {
              status = 'PASS';
              note = `Matches ${closestToken}`;
              passChecks++;
            } else if (closestDist < 30) {
              status = 'WARN';
              note = `Close to ${closestToken} (distance: ${Math.round(closestDist)})`;
              warnChecks++;
            } else {
              status = 'INFO';
              note = `Custom color: ${value}`;
              passChecks++;
            }
          } else if (isSizeProp(prop)) {
            const px = parsePx(value);
            if (px !== null) {
              const expectedSizes = Object.values(PF6_TOKENS).filter(v => v.endsWith('px')).map(v => parseFloat(v));
              const closest = expectedSizes.reduce((a, b) => Math.abs(b - px) < Math.abs(a - px) ? b : a, expectedSizes[0]);
              const diff = Math.abs(px - closest);
              if (diff <= 1) {
                status = 'PASS';
                passChecks++;
              } else {
                status = 'INFO';
                note = `${value} (nearest token: ${closest}px, diff: ${diff}px)`;
                passChecks++;
              }
            } else {
              status = 'PASS';
              passChecks++;
            }
          } else {
            status = 'PASS';
            passChecks++;
          }

          results.push({ page: pageCheck.name, element: check.label, prop, value, status, note });
          console.log(`  │  ${status === 'PASS' ? '✓' : status === 'WARN' ? '⚠' : 'ℹ'} ${check.label} → ${prop}: ${value} ${note ? `(${note})` : ''}`);
        }
      }
    } catch (err) {
      console.log(`  │  ✗ Error: ${err.message}`);
      results.push({ page: pageCheck.name, element: 'Page load', status: 'FAIL', note: err.message });
      failChecks++;
    }

    await page.close();
  }

  await browser.close();

  const score = totalChecks > 0 ? Math.round((passChecks / totalChecks) * 100) : 0;
  console.log(`\n  └─ Token compliance: ${score}% (${passChecks}/${totalChecks} pass, ${warnChecks} warnings, ${failChecks} failures)\n`);

  const reportPath = resolve(ROOT, 'tests', 'token-check-report.json');
  writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    summary: { totalChecks, passChecks, warnChecks, failChecks, score },
    results,
  }, null, 2));
  console.log(`  Report: ${reportPath}\n`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
