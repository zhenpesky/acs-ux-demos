import { isApiConfigured, API_CONFIG } from "./config";
import { apiClient } from "./client";
import {
  CLUSTERS,
  NAMESPACES,
  DEPLOYMENTS,
  CVES,
  SUMMARY_COUNTS,
  VIOLATIONS,
  POLICIES,
  EXCEPTIONS,
} from "../mockData";

let syncVersion = 0;
let syncStatus = "idle";
let syncMessage = "";
let syncTimer = null;
let lastSyncTimestamp = null;
let syncErrorCount = 0;
let cachedState = { version: 0, status: "idle", message: "", lastSyncTimestamp: null, syncErrorCount: 0 };
const listeners = new Set();

const MOCK_ID_PREFIX = /^(cluster-|ns-|deploy-|v-|pol-|exc-|filter-|report-|col-)/;

function notify() {
  cachedState = {
    version: syncVersion,
    status: syncStatus,
    message: syncMessage,
    lastSyncTimestamp,
    syncErrorCount,
  };
  listeners.forEach((fn) => fn());
}

function mergeArrayById(target, liveItems, idKey = "id") {
  const liveIds = new Set(liveItems.map((item) => item[idKey]));
  const mockOnly = target.filter(
    (item) => !liveIds.has(item[idKey]) && MOCK_ID_PREFIX.test(item[idKey] || "")
  );
  target.length = 0;
  target.push(...liveItems, ...mockOnly);
}

function replaceArray(target, source) {
  target.length = 0;
  target.push(...source);
}

function replaceObject(target, source) {
  Object.keys(target).forEach((k) => delete target[k]);
  Object.assign(target, source);
}

export function getState() {
  return cachedState;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

async function doSync() {
  if (!isApiConfigured()) {
    syncStatus = "mock";
    syncMessage = "No API configured — using mock data";
    notify();
    return;
  }

  syncStatus = "syncing";
  syncMessage = "Fetching live data from StackRox…";
  notify();

  try {
    const connTest = await apiClient.testConnection();
    if (!connTest.success) throw new Error(connTest.message);

    const results = await Promise.allSettled([
      apiClient.getSummaryCounts(),
      apiClient.listClusters(),
      apiClient.listNamespaces(),
      apiClient.listDeployments({ pagination: { limit: 200, offset: 0 } }),
      apiClient.listImageCVEs({ pagination: { limit: 200, offset: 0 } }),
      apiClient.listAlerts({ limit: 100 }),
      apiClient.listPolicies(),
    ]);

    const [countsRes, clustersRes, namespacesRes, deploymentsRes, cvesRes, alertsRes, policiesRes] = results;

    if (countsRes.status === "fulfilled" && countsRes.value) {
      replaceObject(SUMMARY_COUNTS, {
        ...SUMMARY_COUNTS,
        clusterCount: countsRes.value.clusterCount ?? SUMMARY_COUNTS.clusterCount,
        nodeCount: countsRes.value.nodeCount ?? SUMMARY_COUNTS.nodeCount,
        violationCount: countsRes.value.violationCount ?? SUMMARY_COUNTS.violationCount,
        deploymentCount: countsRes.value.deploymentCount ?? SUMMARY_COUNTS.deploymentCount,
        imageCount: countsRes.value.imageCount ?? SUMMARY_COUNTS.imageCount,
        secretCount: countsRes.value.secretCount ?? SUMMARY_COUNTS.secretCount,
      });
    }

    if (clustersRes.status === "fulfilled" && clustersRes.value?.length) {
      mergeArrayById(CLUSTERS, clustersRes.value);
    }

    if (namespacesRes.status === "fulfilled" && namespacesRes.value?.length) {
      const liveNamespaces = namespacesRes.value.map((ns) => {
        if (ns.metadata?.id) return ns;
        return { ...ns, metadata: { ...ns.metadata, id: ns.metadata?.name || ns.name } };
      });
      const liveIds = new Set(liveNamespaces.map((n) => n.metadata?.id));
      const mockOnly = NAMESPACES.filter(
        (n) => !liveIds.has(n.metadata?.id) && MOCK_ID_PREFIX.test(n.metadata?.id || "")
      );
      NAMESPACES.length = 0;
      NAMESPACES.push(...liveNamespaces, ...mockOnly);
    }

    if (deploymentsRes.status === "fulfilled" && deploymentsRes.value?.length) {
      mergeArrayById(DEPLOYMENTS, deploymentsRes.value);
    }

    if (cvesRes.status === "fulfilled" && cvesRes.value?.length) {
      const liveCveIds = new Set(cvesRes.value.map((c) => c.cve));
      const mockOnlyCves = CVES.filter((c) => !liveCveIds.has(c.cve));
      CVES.length = 0;
      CVES.push(...cvesRes.value, ...mockOnlyCves);
    }

    if (alertsRes.status === "fulfilled" && alertsRes.value?.length) {
      const liveAlerts = alertsRes.value.map((a) => ({
        id: a.id,
        policy: a.policy?.name || a.policyName || "Unknown Policy",
        entity: a.deployment?.name || a.entity?.name || "Unknown",
        entityType: a.commonEntityInfo?.resourceType || "Deployment",
        enforced: a.enforcement?.action === "SCALE_TO_ZERO_ENFORCEMENT" || false,
        severity: mapSeverity(a.policy?.severity || a.severity),
        categories: a.policy?.categories || [],
        lifecycle: a.lifecycleStage || "DEPLOY",
        time: a.time || a.firstOccurred,
        state: mapAlertState(a.state),
      }));
      mergeArrayById(VIOLATIONS, liveAlerts);
    }

    if (policiesRes.status === "fulfilled" && policiesRes.value?.length) {
      mergeArrayById(POLICIES, policiesRes.value);
    }

    syncVersion += 1;
    syncStatus = "connected";
    lastSyncTimestamp = new Date().toISOString();
    syncErrorCount = 0;
    const ts = new Date().toLocaleTimeString();
    syncMessage = `Live data synced at ${ts}`;
    notify();
  } catch (err) {
    console.error("[liveSync] sync error:", err);
    syncStatus = "error";
    syncErrorCount += 1;
    syncMessage = `Sync failed: ${err.message} — using cached/mock data`;
    notify();
  }
}

function mapSeverity(apiSeverity) {
  if (!apiSeverity) return "Low";
  const s = apiSeverity.toUpperCase();
  if (s.includes("CRITICAL")) return "Critical";
  if (s.includes("HIGH")) return "High";
  if (s.includes("MEDIUM")) return "Medium";
  return "Low";
}

function mapAlertState(apiState) {
  if (!apiState) return "Active";
  const s = apiState.toUpperCase();
  if (s.includes("RESOLVED")) return "Resolved";
  if (s.includes("ATTEMPTED")) return "Attempted";
  if (s.includes("SNOOZED")) return "Snoozed";
  return "Active";
}

export function startSync() {
  if (syncTimer) return;
  doSync();
  syncTimer = setInterval(doSync, API_CONFIG.pollInterval);
}

export function stopSync() {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
}

export function triggerSync() {
  return doSync();
}
