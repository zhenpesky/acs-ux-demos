// Mock API Client — uses centralized mockData as single source of truth.
// Returns data in the same shape as the real StackRox API.
import {
  CLUSTERS,
  NAMESPACES,
  DEPLOYMENTS,
  CVES,
  SAVED_FILTERS,
  REPORTS,
  SUMMARY_COUNTS,
  VIOLATIONS,
  POLICIES,
  EXCEPTIONS,
} from "../mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class MockApiClient {
  constructor() {
    this.connected = true;
    this.latency = 300;
  }

  async testConnection() {
    await delay(100);
    return { success: true, message: "Using mock data" };
  }

  async listDeployments(params = {}) {
    await delay(this.latency);
    let results = [...DEPLOYMENTS];

    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.clusterName.toLowerCase().includes(query) ||
          (d.namespace || "").toLowerCase().includes(query)
      );
    }

    if (params.pagination) {
      const { limit = 50, offset = 0 } = params.pagination;
      results = results.slice(offset, offset + limit);
    }

    return results;
  }

  async getDeployment(id) {
    await delay(this.latency);
    const deployment = DEPLOYMENTS.find((d) => d.id === id);
    if (!deployment) throw new Error(`Deployment ${id} not found`);
    return deployment;
  }

  async getDeploymentsCount(query = "") {
    await delay(100);
    if (!query) return SUMMARY_COUNTS.deploymentCount;
    const q = query.toLowerCase();
    return DEPLOYMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.clusterName.toLowerCase().includes(q) ||
        (d.namespace || "").toLowerCase().includes(q)
    ).length;
  }

  async listClusters() {
    await delay(this.latency);
    return [...CLUSTERS];
  }

  async getCluster(id) {
    await delay(this.latency);
    const cluster = CLUSTERS.find((c) => c.id === id);
    if (!cluster) throw new Error(`Cluster ${id} not found`);
    return cluster;
  }

  async listNamespaces(clusterId = null) {
    await delay(this.latency);
    let results = [...NAMESPACES];
    if (clusterId) {
      results = results.filter((n) => (n.metadata?.clusterId || n.clusterId) === clusterId);
    }
    return results;
  }

  async listImages(params = {}) {
    await delay(this.latency);
    return [];
  }

  async getImagesCount() {
    await delay(100);
    return SUMMARY_COUNTS.imageCount;
  }

  async listCVEs(params = {}) {
    await delay(this.latency);
    let results = [...CVES];
    return results;
  }

  async getCVEsCount(params = {}) {
    const cves = await this.listCVEs(params);
    return cves.length;
  }

  async getVulnerabilitySummary() {
    await delay(this.latency);
    const summary = {
      critical: { total: 0, fixable: 0 },
      important: { total: 0, fixable: 0 },
      moderate: { total: 0, fixable: 0 },
      low: { total: 0, fixable: 0 },
    };

    DEPLOYMENTS.forEach((d) => {
      const sev = d.imageCVECountBySeverity;
      if (!sev) return;
      summary.critical.total += sev.critical?.total || 0;
      summary.important.total += sev.important?.total || 0;
      summary.moderate.total += sev.moderate?.total || 0;
      summary.low.total += sev.low?.total || 0;
    });

    return summary;
  }

  async getWorkloadCVEs(filters = {}) {
    await delay(this.latency);
    let deployments = [...DEPLOYMENTS];

    if (filters.clusterName?.length) {
      deployments = deployments.filter((d) => filters.clusterName.includes(d.clusterName));
    }
    if (filters.namespaceName?.length) {
      deployments = deployments.filter((d) => filters.namespaceName.includes(d.namespace));
    }
    if (filters.deploymentName?.length) {
      deployments = deployments.filter((d) => filters.deploymentName.includes(d.name));
    }
    if (filters.cveSeverity?.length) {
      deployments = deployments.filter((d) => {
        const sev = d.imageCVECountBySeverity;
        if (!sev) return false;
        return filters.cveSeverity.some((s) => {
          const key = s.toLowerCase();
          return (sev[key]?.total || 0) > 0;
        });
      });
    }

    return deployments;
  }

  async listSavedFilters() {
    await delay(this.latency);
    return SAVED_FILTERS;
  }

  async createSavedFilter(filter) {
    await delay(this.latency);
    const newFilter = { id: `filter-${Date.now()}`, ...filter, createdAt: new Date().toISOString() };
    SAVED_FILTERS.push(newFilter);
    return newFilter;
  }

  async updateSavedFilter(id, updates) {
    await delay(this.latency);
    const index = SAVED_FILTERS.findIndex((f) => f.id === id);
    if (index === -1) throw new Error(`Filter ${id} not found`);
    SAVED_FILTERS[index] = { ...SAVED_FILTERS[index], ...updates };
    return SAVED_FILTERS[index];
  }

  async deleteSavedFilter(id) {
    await delay(this.latency);
    const index = SAVED_FILTERS.findIndex((f) => f.id === id);
    if (index === -1) throw new Error(`Filter ${id} not found`);
    SAVED_FILTERS.splice(index, 1);
    return { success: true };
  }

  async listReports() {
    await delay(this.latency);
    return REPORTS;
  }

  async createReport(config) {
    await delay(2000);
    const newReport = {
      id: `report-${Date.now()}`,
      name: `workload-vulnerabilities-${new Date().toISOString().slice(0, 10)}`,
      type: "VIEW_BASED",
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      downloadUrl: `/reports/report-${Date.now()}.csv`,
      filters: config.filters || {},
      rowCount: Math.floor(Math.random() * 500) + 50,
    };
    REPORTS.unshift(newReport);
    return newReport;
  }

  async listAlerts(params = {}) {
    await delay(this.latency);
    let results = [...VIOLATIONS];
    if (params.query) {
      const q = params.query.toLowerCase();
      results = results.filter(
        (v) =>
          v.policy.toLowerCase().includes(q) ||
          v.entity.toLowerCase().includes(q)
      );
    }
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    return results.slice(offset, offset + limit);
  }

  async listPolicies() {
    await delay(this.latency);
    return [...POLICIES];
  }

  async listVulnerabilityExceptions(params = {}) {
    await delay(this.latency);
    return [...EXCEPTIONS];
  }

  async getSummaryCounts() {
    await delay(100);
    return { ...SUMMARY_COUNTS };
  }

  async getMetadata() {
    await delay(100);
    return { version: "4.6.0", buildFlavor: "development", releaseBuild: false, licenseStatus: "VALID" };
  }

  async queryVulnerabilities(graphqlQuery, variables = {}) {
    await delay(this.latency);
    if (graphqlQuery.includes("deploymentCount")) {
      return { deploymentCount: SUMMARY_COUNTS.deploymentCount };
    }
    if (graphqlQuery.includes("imageCount")) {
      return { imageCount: SUMMARY_COUNTS.imageCount };
    }
    return {};
  }
}

export const mockApiClient = new MockApiClient();
export default mockApiClient;
