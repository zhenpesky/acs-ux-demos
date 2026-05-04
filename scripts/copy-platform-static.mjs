#!/usr/bin/env node
/**
 * Copy static UI assets from the StackRox platform tree into this prototype so
 * global styling / branding match the monorepo the user runs on :8443.
 *
 * Does NOT copy application logic (TS/TSX) — those live in ui/apps/platform and
 * are not drop-in compatible with this Vite + PF6 prototype.
 *
 * Vulnerability reporting + workload results flows stay in src/pages/* (prototype).
 *
 * Resolution order for platform root:
 *   1. STACKROX_PLATFORM_ROOT env (absolute or relative to this repo root)
 *   2. ../stackrox (sibling clone: Documents/ACS-workspace/stackrox)
 *   3. ./stackrox-upstream (legacy shallow clone inside this repo)
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

function pickPlatformRoot() {
  const env = process.env.STACKROX_PLATFORM_ROOT?.trim();
  if (env) {
    const p = resolve(ROOT, env);
    if (existsSync(join(p, 'ui', 'apps', 'platform', 'src'))) return p;
    console.warn(`STACKROX_PLATFORM_ROOT set but invalid: ${p}`);
  }
  const sibling = resolve(ROOT, '..', 'stackrox');
  if (existsSync(join(sibling, 'ui', 'apps', 'platform', 'src'))) return sibling;
  const legacy = resolve(ROOT, 'stackrox-upstream');
  if (existsSync(join(legacy, 'ui', 'apps', 'platform', 'src'))) return legacy;
  throw new Error(
    'No StackRox checkout found. Set STACKROX_PLATFORM_ROOT, or place a clone at ../stackrox, or keep stackrox-upstream/.'
  );
}

function copyGlob(srcDir, pattern, destDir) {
  mkdirSync(destDir, { recursive: true });
  const names = readdirSync(srcDir).filter((n) => pattern.test(n));
  for (const name of names) {
    const from = join(srcDir, name);
    copyFileSync(from, join(destDir, name));
    console.log(`  ${basename(destDir)}/${name}`);
  }
  return names.length;
}

function appendNavCss(platformSrc, destDir) {
  const navDir = join(platformSrc, 'Containers', 'MainPage', 'Navigation');
  const pieces = ['NavigationSidebar.css', 'HorizontalSubnav.css'].map((f) => join(navDir, f));
  let out = '/* Assembled from StackRox ui/apps/platform MainPage Navigation (synced; do not edit by hand) */\n\n';
  for (const p of pieces) {
    if (!existsSync(p)) continue;
    out += `/* ---- ${basename(p)} ---- */\n`;
    out += readFileSync(p, 'utf8');
    out += '\n\n';
  }
  const dest = join(destDir, 'platform-navigation.css');
  writeFileSync(dest, out);
  console.log(`  styles/${basename(dest)}`);
}

const platformRoot = pickPlatformRoot();
const platformSrc = join(platformRoot, 'ui', 'apps', 'platform', 'src');
const cssSrc = join(platformSrc, 'css');
const imgSrc = join(platformSrc, 'images');
const stylesDest = join(ROOT, 'src', 'styles');
const assetsDest = join(ROOT, 'src', 'assets');
const publicDest = join(ROOT, 'public');

console.log(`\n📦 copy-platform-static — source: ${platformRoot}\n`);

let n = copyGlob(cssSrc, /\.css$/i, stylesDest);
if (n === 0) console.warn('  (no css/*.css copied)');

appendNavCss(platformSrc, stylesDest);

mkdirSync(assetsDest, { recursive: true });
const logo = join(imgSrc, 'RHACS-Logo.svg');
const fav = join(imgSrc, 'rh-favicon.ico');
if (existsSync(logo)) {
  copyFileSync(logo, join(assetsDest, 'RHACS-Logo.svg'));
  console.log('  assets/RHACS-Logo.svg');
}
if (existsSync(fav)) {
  copyFileSync(fav, join(publicDest, 'favicon.ico'));
  console.log('  public/favicon.ico');
}

console.log('\n✅ Static platform CSS/images synced (same files as monorepo paths above).\n');
