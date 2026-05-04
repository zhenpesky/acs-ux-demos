#!/usr/bin/env node

/**
 * Data parity check — compares API response shapes between
 * the prototype's proxy and direct StackRox Central API calls.
 *
 * Usage:
 *   node tests/data-diff.js
 *
 * Compares: field names, data types, array lengths, and schema structure.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
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
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
  }
  return env;
}

const env = loadEnv();
const LIVE_URL = (env.VITE_STACKROX_URL || '').replace(/\/+$/, '');
const LOCAL_URL = 'http://localhost:5173/stackrox-api';
const TOKEN = env.VITE_STACKROX_TOKEN || '';

if (!LIVE_URL || !TOKEN) {
  console.error('ERROR: VITE_STACKROX_URL and VITE_STACKROX_TOKEN must be set in .env.local');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchGraphQL(baseUrl, query, variables = {}) {
  const res = await fetch(`${baseUrl}/api/graphql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GraphQL ${res.status}`);
  const data = await res.json();
  return data.data;
}

function getSchema(obj, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return typeof obj;
  if (obj === null || obj === undefined) return 'null';
  if (Array.isArray(obj)) {
    if (obj.length === 0) return 'array<empty>';
    return `array<${getSchema(obj[0], depth + 1, maxDepth)}>[${obj.length}]`;
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj).map(([k, v]) => `${k}: ${getSchema(v, depth + 1, maxDepth)}`);
    return `{ ${entries.join(', ')} }`;
  }
  return typeof obj;
}

function compareSchemas(liveSchema, localSchema) {
  if (liveSchema === localSchema) return { match: true };

  const liveType = typeof liveSchema;
  const localType = typeof localSchema;
  if (liveType !== localType) return { match: false, reason: `Type mismatch: live=${liveType}, local=${localType}` };

  return { match: false, reason: `Schema differs` };
}

function extractFieldNames(obj, prefix = '', depth = 0, maxDepth = 2) {
  if (depth > maxDepth || !obj || typeof obj !== 'object') return [];
  if (Array.isArray(obj)) {
    return obj.length > 0 ? extractFieldNames(obj[0], `${prefix}[]`, depth + 1, maxDepth) : [];
  }
  const fields = [];
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    fields.push({ path, type: Array.isArray(val) ? `array[${val.length}]` : typeof val });
    if (typeof val === 'object' && val !== null) {
      fields.push(...extractFieldNames(val, path, depth + 1, maxDepth));
    }
  }
  return fields;
}

function diffFields(liveFields, localFields) {
  const liveMap = new Map(liveFields.map(f => [f.path, f.type]));
  const localMap = new Map(localFields.map(f => [f.path, f.type]));

  const missingInLocal = [];
  const missingInLive = [];
  const typeMismatches = [];

  for (const [path, type] of liveMap) {
    if (!localMap.has(path)) {
      missingInLocal.push({ path, type });
    } else if (localMap.get(path) !== type) {
      typeMismatches.push({ path, liveType: type, localType: localMap.get(path) });
    }
  }
  for (const [path, type] of localMap) {
    if (!liveMap.has(path)) {
      missingInLive.push({ path, type });
    }
  }

  return { missingInLocal, missingInLive, typeMismatches };
}

const ENDPOINTS = [
  {
    name: 'Metadata',
    fetch: async (base) => fetchJSON(`${base}/v1/metadata`),
  },
  {
    name: 'Clusters',
    fetch: async (base) => fetchJSON(`${base}/v1/clusters`),
  },
  {
    name: 'Namespaces (first 10)',
    fetch: async (base) => {
      const data = await fetchJSON(`${base}/v1/namespaces`);
      return { namespaces: (data.namespaces || []).slice(0, 10) };
    },
  },
  {
    name: 'Alerts (first 10)',
    fetch: async (base) => {
      const data = await fetchJSON(`${base}/v1/alerts?pagination.limit=10`);
      return { alerts: (data.alerts || []).slice(0, 10) };
    },
  },
  {
    name: 'Policies (first 10)',
    fetch: async (base) => {
      const data = await fetchJSON(`${base}/v1/policies`);
      return { policies: (data.policies || []).slice(0, 10) };
    },
  },
  {
    name: 'Report Configurations',
    fetch: async (base) => fetchJSON(`${base}/v2/reports/configurations?pagination.limit=10`),
  },
  {
    name: 'Vulnerability Exceptions',
    fetch: async (base) => {
      try {
        return await fetchJSON(`${base}/v2/vulnerability-exceptions?pagination.limit=10`);
      } catch { return { exceptions: [] }; }
    },
  },
  {
    name: 'Summary Counts (GraphQL)',
    fetch: async (base) => fetchGraphQL(base, `query { clusterCount nodeCount violationCount deploymentCount imageCount secretCount }`),
  },
  {
    name: 'Deployments (GraphQL)',
    fetch: async (base) => fetchGraphQL(base, `
      query { deployments(pagination: { limit: 5, offset: 0, sortOption: { field: "Deployment", reversed: false } }) {
        id name type clusterName namespace imageCount created
        imageCVECountBySeverity { critical { total } important { total } moderate { total } low { total } }
      }}
    `),
  },
  {
    name: 'Image CVEs (GraphQL)',
    fetch: async (base) => fetchGraphQL(base, `
      query { imageCVEs(pagination: { limit: 5, offset: 0, sortOption: { field: "CVSS", reversed: true } }) {
        cve topCVSS affectedImageCount firstDiscoveredInSystem
        affectedImageCountBySeverity { critical { total } important { total } moderate { total } low { total } }
      }}
    `),
  },
];

async function main() {
  console.log('\n📊 Data Parity Check');
  console.log(`  Live:  ${LIVE_URL}`);
  console.log(`  Local: ${LOCAL_URL}\n`);

  const results = [];

  for (const ep of ENDPOINTS) {
    process.stdout.write(`  ├─ ${ep.name}… `);

    try {
      const [liveData, localData] = await Promise.all([
        ep.fetch(LIVE_URL),
        ep.fetch(LOCAL_URL),
      ]);

      const liveFields = extractFieldNames(liveData);
      const localFields = extractFieldNames(localData);
      const diff = diffFields(liveFields, localFields);

      const totalFields = liveFields.length;
      const matchedFields = totalFields - diff.missingInLocal.length - diff.typeMismatches.length;
      const matchPct = totalFields > 0 ? Math.round((matchedFields / totalFields) * 100) : 100;

      const status = diff.missingInLocal.length === 0 && diff.typeMismatches.length === 0 ? 'PASS' : 'PARTIAL';
      console.log(`${status} (${matchPct}% field match, ${totalFields} fields)`);

      results.push({
        name: ep.name, status, matchPct, totalFields,
        missingInLocal: diff.missingInLocal,
        missingInLive: diff.missingInLive,
        typeMismatches: diff.typeMismatches,
        liveSchema: getSchema(liveData),
        localSchema: getSchema(localData),
      });
    } catch (err) {
      console.log(`FAIL — ${err.message}`);
      results.push({ name: ep.name, status: 'FAIL', error: err.message, matchPct: 0 });
    }
  }

  const passCount = results.filter(r => r.status === 'PASS').length;
  const partialCount = results.filter(r => r.status === 'PARTIAL').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const avgMatch = results.reduce((s, r) => s + (r.matchPct || 0), 0) / results.length;

  console.log(`\n  └─ Summary: ${passCount} PASS | ${partialCount} PARTIAL | ${failCount} FAIL | Avg match: ${Math.round(avgMatch)}%\n`);

  const reportPath = resolve(ROOT, 'tests', 'data-diff-report.json');
  writeFileSync(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), summary: { passCount, partialCount, failCount, avgMatch: Math.round(avgMatch) }, results }, null, 2));
  console.log(`  Report: ${reportPath}\n`);

  if (results.some(r => r.missingInLocal?.length || r.typeMismatches?.length)) {
    console.log('  ⚠ Details on mismatches:\n');
    for (const r of results.filter(r => r.missingInLocal?.length || r.typeMismatches?.length)) {
      console.log(`    ${r.name}:`);
      if (r.missingInLocal?.length) {
        console.log(`      Missing in local: ${r.missingInLocal.map(f => f.path).join(', ')}`);
      }
      if (r.typeMismatches?.length) {
        console.log(`      Type mismatches: ${r.typeMismatches.map(f => `${f.path} (live: ${f.liveType}, local: ${f.localType})`).join(', ')}`);
      }
    }
    console.log('');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
