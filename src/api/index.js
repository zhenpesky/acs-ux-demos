import { isApiConfigured, API_CONFIG } from "./config";
import { apiClient } from "./client";
import { mockApiClient } from "./mockClient";
import { startSync, getState, subscribe } from "./liveSync";
import {
  VIOLATIONS,
  POLICIES,
  EXCEPTIONS,
  SAVED_FILTERS,
} from "../mockData";
import { MOCK_REPORT_CONFIGURATIONS } from "./reportStore";

const MOCK_ID_PREFIX = /^(cluster-|ns-|deploy-|v-|pol-|exc-|filter-|report-|col-)/;

class UnifiedApiClient {
  constructor() {
    this.useReal = false;
    this.connectionStatus = "disconnected";
    this.statusMessage = "";
    this.listeners = new Set();
  }

  onStatusChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) =>
      cb({
        useReal: this.useReal,
        status: this.connectionStatus,
        message: this.statusMessage,
      })
    );
  }

  async initialize() {
    if (!isApiConfigured()) {
      this.useReal = false;
      this.connectionStatus = "mock";
      this.statusMessage = "Using mock data (no API configured)";
      this.notifyListeners();
      return;
    }

    this.connectionStatus = "connecting";
    this.statusMessage = "Connecting to StackRox…";
    this.notifyListeners();

    const result = await apiClient.testConnection();

    if (result.success) {
      this.useReal = true;
      this.connectionStatus = "connected";
      this.statusMessage = `Connected to ${API_CONFIG.realUrl}`;
      startSync();
    } else {
      this.useReal = false;
      this.connectionStatus = API_CONFIG.useMockFallback ? "mock" : "error";
      this.statusMessage = API_CONFIG.useMockFallback
        ? `Fallback to mock data: ${result.message}`
        : `Connection failed: ${result.message}`;
    }

    this.notifyListeners();

    subscribe(() => {
      const syncState = getState() || {};
      this.connectionStatus = syncState.status || "mock";
      this.statusMessage = syncState.message || "";
      this.useReal = syncState.status === "connected";
      this.notifyListeners();
    });
  }

  getClient() {
    return this.useReal ? apiClient : mockApiClient;
  }

  async testConnection() { return this.getClient().testConnection(); }
  async getMetadata() { return this.getClient().getMetadata(); }

  // ── Clusters (synced via liveSync — reads from shared CLUSTERS array) ──
  async listClusters() { return this.getClient().listClusters(); }

  // ── Namespaces (now synced via liveSync) ──
  async listNamespaces(clusterId) {
    return this.getClient().listNamespaces(clusterId);
  }

  // ── Deployments ──
  async listDeployments(params) { return this.getClient().listDeployments(params); }
  async getDeployment(id) { return this.getClient().getDeployment(id); }
  async getDeploymentsCount(query) { return this.getClient().getDeploymentsCount(query); }

  // ── Images ──
  async listImages(params) { return this.getClient().listImages(params); }
  async getImagesCount(query) { return this.getClient().getImagesCount(query); }

  // ── CVEs ──
  async listCVEs(params) {
    if (this.useReal) {
      return apiClient.listImageCVEs(params);
    }
    return mockApiClient.listCVEs(params);
  }

  // ── Vulnerability summary (computed from synced DEPLOYMENTS) ──
  async getVulnerabilitySummary() {
    return mockApiClient.getVulnerabilitySummary();
  }

  async getWorkloadCVEs(filters) { return mockApiClient.getWorkloadCVEs(filters); }

  // ── Violations / Alerts ──
  async listAlerts(params) {
    if (this.useReal) {
      try {
        const liveAlerts = await apiClient.listAlerts(params);
        const liveIds = new Set(liveAlerts.map((a) => a.id));
        const mockOnly = VIOLATIONS.filter(
          (v) => !liveIds.has(v.id) && MOCK_ID_PREFIX.test(v.id)
        );
        return [...liveAlerts, ...mockOnly];
      } catch {
        return [...VIOLATIONS];
      }
    }
    return mockApiClient.listAlerts(params);
  }

  // ── Policies ──
  async listPolicies() {
    if (this.useReal) {
      try {
        const livePolicies = await apiClient.listPolicies();
        const liveIds = new Set(livePolicies.map((p) => p.id));
        const mockOnly = POLICIES.filter(
          (p) => !liveIds.has(p.id) && MOCK_ID_PREFIX.test(p.id)
        );
        return [...livePolicies, ...mockOnly];
      } catch {
        return [...POLICIES];
      }
    }
    return mockApiClient.listPolicies();
  }

  // ── Vulnerability Exceptions ──
  async listVulnerabilityExceptions(params) {
    if (this.useReal) {
      try {
        const liveExceptions = await apiClient.listVulnerabilityExceptions(params);
        const liveIds = new Set(liveExceptions.map((e) => e.id));
        const mockOnly = EXCEPTIONS.filter(
          (e) => !liveIds.has(e.id) && MOCK_ID_PREFIX.test(e.id)
        );
        return [...liveExceptions, ...mockOnly];
      } catch {
        return [...EXCEPTIONS];
      }
    }
    return mockApiClient.listVulnerabilityExceptions(params);
  }

  // ── Report Configuration single (v2) ──
  async getReportConfiguration(id) {
    if (isApiConfigured()) {
      try {
        return await apiClient.getReportConfiguration(id);
      } catch {
        return null;
      }
    }
    return null;
  }

  // ── Report Configurations (v2) ──
  async listReportConfigurations(params) {
    if (isApiConfigured()) {
      try {
        return await apiClient.listReportConfigurations(params);
      } catch {
        return [];
      }
    }
    return [];
  }

  // ── Saved Filters (prototype-only — always mock) ──
  async listSavedFilters() { return mockApiClient.listSavedFilters(); }
  async createSavedFilter(filter) { return mockApiClient.createSavedFilter(filter); }
  async updateSavedFilter(id, updates) { return mockApiClient.updateSavedFilter(id, updates); }
  async deleteSavedFilter(id) { return mockApiClient.deleteSavedFilter(id); }

  // ── Reports (prototype store — always mock) ──
  async listReports() { return mockApiClient.listReports(); }
  async createReport(config) { return mockApiClient.createReport(config); }

  // ── GraphQL pass-through ──
  async queryVulnerabilities(query, variables) {
    return this.getClient().queryVulnerabilities?.(query, variables)
      || this.getClient().graphql?.(query, variables);
  }

  // ── Summary Counts ──
  async getSummaryCounts() {
    if (this.useReal) {
      try {
        return await apiClient.getSummaryCounts();
      } catch {
        return mockApiClient.getSummaryCounts();
      }
    }
    return mockApiClient.getSummaryCounts();
  }
}

export const api = new UnifiedApiClient();
api.initialize();
export default api;
