#!/usr/bin/env node

/**
 * CLI sync script — fetches live data from StackRox Central and writes
 * a local snapshot to data/sync-snapshot.json for offline development.
 *
 * Usage:
 *   node scripts/sync-data.js              # one-shot sync
 *   node scripts/sync-data.js --watch      # poll every 5 minutes
 *
 * Requires .env.local with VITE_STACKROX_URL and VITE_STACKROX_TOKEN set.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

function loadEnv() {
  const envPath = resolve(ROOT, '.env.local');
  if (!existsSync(envPath)) {
    console.error('ERROR: .env.local not found. Copy .env.local.template → .env.local and fill in values.');
    process.exit(1);
  }
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

async function apiFetch(baseUrl, token, endpoint) {
  const url = `${baseUrl}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    // StackRox Central often uses self-signed certs
  });
  if (!res.ok) throw new Error(`${endpoint} → ${res.status} ${res.statusText}`);
  return res.json();
}

async function graphqlFetch(baseUrl, token, query, variables = {}) {
  const url = `${baseUrl}/api/graphql`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GraphQL → ${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.data;
}

async function doSync() {
  const env = loadEnv();
  const baseUrl = (env.VITE_STACKROX_URL || '').replace(/\/+$/, '');
  const token = env.VITE_STACKROX_TOKEN || '';

  if (!baseUrl || !token) {
    console.error('ERROR: VITE_STACKROX_URL and VITE_STACKROX_TOKEN must be set in .env.local');
    process.exit(1);
  }

  console.log(`\n🔄 Syncing from ${baseUrl}…`);
  const startTime = Date.now();
  const snapshot = { syncedAt: new Date().toISOString(), source: baseUrl, data: {} };

  const endpoints = [
    { key: 'metadata', fn: () => apiFetch(baseUrl, token, '/v1/metadata') },
    { key: 'summaryCounts', fn: () => graphqlFetch(baseUrl, token, `query { clusterCount nodeCount violationCount deploymentCount imageCount secretCount }`) },
    { key: 'clusters', fn: () => apiFetch(baseUrl, token, '/v1/clusters').then(d => d.clusters || []) },
    { key: 'namespaces', fn: () => apiFetch(baseUrl, token, '/v1/namespaces').then(d => d.namespaces || []) },
    { key: 'deployments', fn: () => graphqlFetch(baseUrl, token, `
      query { deployments(pagination: { limit: 200, offset: 0, sortOption: { field: "Deployment", reversed: false } }) {
        id name type clusterName namespace imageCount created
        imageCVECountBySeverity { critical { total } important { total } moderate { total } low { total } }
      }}
    `).then(d => d.deployments || []) },
    { key: 'imageCVEs', fn: () => graphqlFetch(baseUrl, token, `
      query { imageCVEs(pagination: { limit: 200, offset: 0, sortOption: { field: "CVSS", reversed: true } }) {
        cve topCVSS affectedImageCount firstDiscoveredInSystem publishedOn
        affectedImageCountBySeverity { critical { total } important { total } moderate { total } low { total } }
        distroTuples { summary operatingSystem cvss scoreVersion }
      }}
    `).then(d => d.imageCVEs || []) },
    { key: 'alerts', fn: () => apiFetch(baseUrl, token, '/v1/alerts?pagination.limit=200').then(d => d.alerts || []) },
    { key: 'policies', fn: () => apiFetch(baseUrl, token, '/v1/policies').then(d => d.policies || []) },
    { key: 'reportConfigs', fn: () => apiFetch(baseUrl, token, '/v2/reports/configurations?pagination.limit=100').then(d => d.reportConfigs || []) },
    { key: 'vulnerabilityExceptions', fn: () => apiFetch(baseUrl, token, '/v2/vulnerability-exceptions?pagination.limit=100').then(d => d.exceptions || []).catch(() => []) },
    { key: 'complianceProfiles', fn: () => apiFetch(baseUrl, token, '/v2/compliance/profiles').then(d => d.profiles || []).catch(() => []) },
  ];

  for (const ep of endpoints) {
    try {
      process.stdout.write(`  ├─ ${ep.key}… `);
      snapshot.data[ep.key] = await ep.fn();
      const count = Array.isArray(snapshot.data[ep.key]) ? snapshot.data[ep.key].length : 1;
      console.log(`✓ (${count} ${count === 1 ? 'record' : 'records'})`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      snapshot.data[ep.key] = null;
    }
  }

  const dataDir = resolve(ROOT, 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  const outPath = resolve(dataDir, 'sync-snapshot.json');
  writeFileSync(outPath, JSON.stringify(snapshot, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`  └─ Done in ${elapsed}s → ${outPath}`);
  console.log(`  📋 Synced at: ${snapshot.syncedAt}\n`);

  return snapshot;
}

const args = process.argv.slice(2);

if (args.includes('--watch')) {
  const intervalMs = 5 * 60 * 1000;
  console.log(`Starting sync watcher (every ${intervalMs / 60000} minutes)…`);
  doSync();
  setInterval(doSync, intervalMs);
} else {
  doSync().catch((err) => {
    console.error('Fatal sync error:', err);
    process.exit(1);
  });
}
