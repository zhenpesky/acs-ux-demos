import { API_CONFIG, isApiConfigured, getAuthHeader } from "./config";

class ApiClient {
  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.connected = false;
    this.lastError = null;
  }

  async fetch(endpoint, options = {}) {
    if (!isApiConfigured()) throw new Error("API not configured");

    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`API ${response.status} ${response.statusText}`);
      this.connected = true;
      this.lastError = null;
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      this.connected = false;
      this.lastError = error.message;
      throw error;
    }
  }

  async graphql(query, variables = {}) {
    const data = await this.fetch("/api/graphql", {
      method: "POST",
      body: JSON.stringify({ query, variables }),
    });
    if (data.errors?.length) {
      console.warn("GraphQL errors:", data.errors);
    }
    return data.data;
  }

  async testConnection() {
    try {
      await this.fetch("/v1/metadata");
      return { success: true, message: "Connected to StackRox" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getMetadata() {
    return this.fetch("/v1/metadata");
  }

  // ── Summary counts (Dashboard) ──────────────────────────────────────
  async getSummaryCounts() {
    const data = await this.graphql(`
      query summary_counts {
        clusterCount
        nodeCount
        violationCount
        deploymentCount
        imageCount
        secretCount
      }
    `);
    return data;
  }

  // ── Clusters ────────────────────────────────────────────────────────
  async listClusters() {
    const data = await this.fetch("/v1/clusters");
    return data.clusters || [];
  }

  // ── Namespaces ──────────────────────────────────────────────────────
  async listNamespaces() {
    const data = await this.fetch("/v1/namespaces");
    return data.namespaces || [];
  }

  // ── Deployments with vulnerability counts (GraphQL) ─────────────────
  async listDeployments(params = {}) {
    const query = params.query || "";
    const limit = params.pagination?.limit || 100;
    const offset = params.pagination?.offset || 0;

    const data = await this.graphql(`
      query getDeploymentList($query: String, $pagination: Pagination) {
        deploymentCount(query: $query)
        deployments(query: $query, pagination: $pagination) {
          id
          name
          type
          imageCVECountBySeverity(query: $query) {
            critical { total }
            important { total }
            moderate { total }
            low { total }
          }
          clusterName
          namespace
          imageCount(query: $query)
          created
        }
      }
    `, {
      query,
      pagination: { limit, offset, sortOption: { field: "Deployment", reversed: false } },
    });

    return data.deployments || [];
  }

  async getDeploymentsCount(query = "") {
    const data = await this.graphql(`
      query getDeploymentCount($query: String) { deploymentCount(query: $query) }
    `, { query });
    return data.deploymentCount || 0;
  }

  // ── Single deployment detail (REST) ─────────────────────────────────
  async getDeployment(id) {
    return this.fetch(`/v1/deployments/${id}`);
  }

  // ── Image CVEs (GraphQL) ────────────────────────────────────────────
  async listImageCVEs(params = {}) {
    const query = params.query || "";
    const limit = params.pagination?.limit || 100;
    const offset = params.pagination?.offset || 0;

    const data = await this.graphql(`
      query getImageCVEList($query: String, $pagination: Pagination) {
        imageCVECount(query: $query)
        imageCVEs(query: $query, pagination: $pagination) {
          cve
          affectedImageCountBySeverity {
            critical { total }
            important { total }
            moderate { total }
            low { total }
          }
          topCVSS
          affectedImageCount
          firstDiscoveredInSystem
          publishedOn
          distroTuples {
            summary
            operatingSystem
            cvss
            scoreVersion
          }
        }
      }
    `, {
      query,
      pagination: { limit, offset, sortOption: { field: "CVSS", reversed: true } },
    });

    return data.imageCVEs || [];
  }

  // ── Images (REST v1) ────────────────────────────────────────────────
  async listImages(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set("query", params.query);
    const data = await this.fetch(`/v1/images?${queryParams}`);
    return data.images || [];
  }

  async getImagesCount(query = "") {
    const params = query ? `?query=${encodeURIComponent(query)}` : "";
    const data = await this.fetch(`/v1/imagescount${params}`);
    return data.count || 0;
  }

  // ── Alerts / Violations ─────────────────────────────────────────────
  async listAlerts(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set("query", params.query);
    queryParams.set("pagination.limit", String(params.limit || 50));
    if (params.offset) queryParams.set("pagination.offset", String(params.offset));
    if (params.sortField) {
      queryParams.set("pagination.sortOption.field", params.sortField);
      queryParams.set("pagination.sortOption.reversed", String(params.sortReversed ?? true));
    }
    const data = await this.fetch(`/v1/alerts?${queryParams}`);
    return data.alerts || [];
  }

  async getAlertsCount(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set("query", params.query);
    const data = await this.fetch(`/v1/alertscount?${queryParams}`);
    return data.count || 0;
  }

  // ── Policies ────────────────────────────────────────────────────────
  async listPolicies() {
    const data = await this.fetch("/v1/policies");
    return data.policies || [];
  }

  // ── Vulnerability Exceptions (v2) ─────────────────────────────────
  async listVulnerabilityExceptions(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set("query", params.query);
    if (params.pagination?.limit) queryParams.set("pagination.limit", String(params.pagination.limit));
    if (params.pagination?.offset) queryParams.set("pagination.offset", String(params.pagination.offset));
    const data = await this.fetch(`/v2/vulnerability-exceptions?${queryParams}`);
    return data.exceptions || [];
  }

  // ── Reports (v2) ──────────────────────────────────────────────────
  async listReportConfigurations(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set("query", params.query);
    if (params.pagination?.limit) queryParams.set("pagination.limit", String(params.pagination.limit));
    if (params.pagination?.offset) queryParams.set("pagination.offset", String(params.pagination.offset));
    const data = await this.fetch(`/v2/reports/configurations?${queryParams}`);
    return data.reportConfigs || [];
  }

  async getReportConfiguration(id) {
    return this.fetch(`/v2/reports/configurations/${id}`);
  }

  async getReportConfigurationsCount(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set("query", params.query);
    const data = await this.fetch(`/v2/reports/configuration-count?${queryParams}`);
    return data.count || 0;
  }

  // ── Compliance ────────────────────────────────────────────────────
  async listComplianceProfiles() {
    try {
      const data = await this.fetch("/v2/compliance/profiles");
      return data.profiles || [];
    } catch {
      return [];
    }
  }

  // ── Integration Health ────────────────────────────────────────────
  async getVulnDefinitionsInfo() {
    try {
      const data = await this.fetch("/v1/integrationhealth/vulndefinitions?component=OSS");
      return data;
    } catch {
      return null;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
