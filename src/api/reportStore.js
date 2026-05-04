export const MOCK_REPORT_CONFIGURATIONS = [
  { id: 'mock-a', name: 'Weekly Critical CVEs', collection: 'Critical CVEs - production', description: 'Weekly critical CVE report for production clusters' },
  { id: 'mock-b', name: 'Monthly Compliance CVEs', collection: 'Compliance violations', description: 'Monthly compliance-related vulnerability summary' },
  { id: 'mock-c', name: 'Platform CVE Summary', collection: 'Platform components', description: 'Platform component vulnerability scan results' },
  { id: 'mock-d', name: 'User Workloads Report', collection: 'etcd critical', description: 'User workload vulnerabilities across all clusters' },
  { id: 'mock-e', name: 'Staging Cluster Scan', collection: 'Staging cluster filter', description: 'Vulnerability report for staging environment' },
  { id: 'mock-f', name: 'Production Critical Only', collection: 'Critical CVEs - production', description: 'Critical-only vulnerabilities in production' },
  { id: 'mock-g', name: 'Inactive Image Audit', collection: 'Inactive images', description: 'Audit report for inactive and aging images' },
  { id: 'mock-h', name: 'Container Scan Weekly', collection: 'All containers', description: 'Weekly container image scan results' },
  { id: 'mock-i', name: 'K8s Component CVEs', collection: 'Kubernetes components', description: 'Kubernetes component vulnerabilities' },
  { id: 'mock-j', name: 'Security Team Report', collection: 'Security review filter', description: 'Comprehensive security team vulnerability report' },
];

let _reports = [];
let _deletedIds = new Set();
let _version = 0;
const _listeners = new Set();

function notify() {
  _version += 1;
  _listeners.forEach((fn) => fn());
}

export function getReports() {
  return _reports;
}

export function getDeletedIds() {
  return _deletedIds;
}

export function getReportById(id) {
  if (_deletedIds.has(id)) return null;
  const fromStore = _reports.find((r) => r.id === id);
  if (fromStore) return fromStore;
  const fromMock = MOCK_REPORT_CONFIGURATIONS.find((r) => r.id === id);
  return fromMock || null;
}

export function addReport(report) {
  const newReport = {
    id: report.id || `report-${Date.now()}`,
    name: report.name || "Untitled Report",
    description: report.description || "",
    savedFilter: report.savedFilter || "",
    collection: report.collection || report.savedFilter || "Custom filters",
    scopeMethod: report.scopeMethod || "custom",
    schedule: report.schedule || "Weekly on Monday",
    deliveryEmail: report.deliveryEmail || "admin@example.com",
    deliveryEmails: report.deliveryEmails || "",
    imageType: report.imageType || ["Deployed images", "Watched images"],
    cveSeverities: report.cveSeverities || [],
    cveStatus: report.cveStatus || "",
    cvesDiscoveredSince: report.cvesDiscoveredSince || "",
    scopeFilters: report.scopeFilters || {},
    cveFilters: report.cveFilters || {},
    lastStatus: "Completed",
    lastRun: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    createdAt: new Date().toISOString(),
    createdBy: "admin@example.com",
  };
  _deletedIds.delete(newReport.id);
  _reports = [newReport, ..._reports];
  notify();
  return newReport;
}

export function updateReport(id, updates) {
  _reports = _reports.map((r) => (r.id === id ? { ...r, ...updates } : r));
  notify();
}

export function deleteReport(id) {
  _reports = _reports.filter((r) => r.id !== id);
  _deletedIds.add(id);
  notify();
}

export function getVersion() {
  return _version;
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
