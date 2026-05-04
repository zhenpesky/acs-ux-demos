import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Page } from '@patternfly/react-core';

import AppMasthead from './components/AppMasthead';
import NavigationSidebar from './components/NavigationSidebar';
import VersionSelector from './pages/VersionSelector';

import DashboardPage from './pages/DashboardPage';
import UserWorkloadVulnerabilities from './pages/UserWorkloadVulnerabilities';
import VulnerabilityReportingPage from './pages/VulnerabilityReportingPage';
import CreateReportWizard from './pages/CreateReportWizard';
import ViolationsPage from './pages/ViolationsPage';
import NetworkGraphPage from './pages/NetworkGraphPage';
import ListeningEndpointsPage from './pages/ListeningEndpointsPage';
import ComplianceCoveragePage from './pages/ComplianceCoveragePage';
import ComplianceSchedulesPage from './pages/ComplianceSchedulesPage';
import PlatformCvesPage from './pages/PlatformCvesPage';
import NodeCvesPage from './pages/NodeCvesPage';
import ExceptionManagementPage from './pages/ExceptionManagementPage';
import RiskPage from './pages/RiskPage';
import ClustersPage from './pages/ClustersPage';
import PoliciesPage from './pages/PoliciesPage';
import CollectionsPage from './pages/CollectionsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import AccessControlPage from './pages/AccessControlPage';
import SystemConfigPage from './pages/SystemConfigPage';
import SystemHealthPage from './pages/SystemHealthPage';
import AdministrationEventsPage from './pages/AdministrationEventsPage';
import ConfigManagementPage from './pages/ConfigManagementPage';
import AllVulnerabilitiesPage from './pages/AllVulnerabilitiesPage';
import ReportDetailPage from './pages/ReportDetailPage';
import DeploymentDetailPage from './pages/DeploymentDetailPage';
import ViolationDetailPage from './pages/ViolationDetailPage';
import CveDetailPage from './pages/CveDetailPage';

import V2UserWorkloadVulnerabilities from './pages/v2/V2UserWorkloadVulnerabilities';
import V2ReportsPage from './pages/v2/V2ReportsPage';
import V2CreateReportWizard from './pages/v2/V2CreateReportWizard';
import V2SavedFilterDetail from './pages/v2/V2SavedFilterDetail';

import V3ReportsPage from './pages/v3/V3ReportsPage';
import V3CreateReportWizard from './pages/v3/V3CreateReportWizard';

import SearchPage from './pages/SearchPage';
import ApiDocsPage from './pages/ApiDocsPage';
import UserProfilePage from './pages/UserProfilePage';
import GuidePage from './pages/GuidePage';
import GenericGuidePage from './pages/GenericGuidePage';

import { v1Routes, v2Routes, v3Routes } from './routes';

function MainRedirect() {
  const location = useLocation();
  const newPath = `/v1${location.pathname}${location.search}${location.hash}`;
  return <Navigate to={newPath} replace />;
}

function VersionLayout({ routes, version, children }) {
  return (
    <Page
      className="acs-platform-typography"
      mainContainerId="main-page-container"
      masthead={<AppMasthead dashboardPath={routes.dashboardPath} routePrefix={`/${version}`} />}
      isManagedSidebar
      sidebar={<NavigationSidebar routes={routes} version={version} />}
    >
      {children}
    </Page>
  );
}

function V1Routes() {
  const r = v1Routes;
  return (
    <VersionLayout routes={r} version="v1">
      <Routes>
        <Route path="main" element={<Navigate to={r.dashboardPath} replace />} />
        <Route path={`main/dashboard`} element={<DashboardPage routePrefix="/v1" />} />
        <Route path={`main/network-graph`} element={<NetworkGraphPage />} />
        <Route path={`main/listening-endpoints`} element={<ListeningEndpointsPage routePrefix="/v1" />} />
        <Route path={`main/violations`} element={<ViolationsPage routePrefix="/v1" />} />
        <Route path={`main/violations/:violationId`} element={<ViolationDetailPage routePrefix="/v1" />} />
        <Route path={`main/compliance`} element={<Navigate to={r.complianceCoveragePath} replace />} />
        <Route path={`main/compliance/coverage`} element={<ComplianceCoveragePage routePrefix="/v1" />} />
        <Route path={`main/compliance/schedules`} element={<ComplianceSchedulesPage routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities`} element={<Navigate to={r.vulnerabilitiesUserWorkloadsPath} replace />} />
        <Route path={`main/vulnerabilities/user-workloads`} element={<UserWorkloadVulnerabilities routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities/user-workloads/deployments/:deploymentId`} element={<DeploymentDetailPage routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities/cves/:cveId`} element={<CveDetailPage routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities/platform`} element={<PlatformCvesPage routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities/node-cves`} element={<NodeCvesPage routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities/all`} element={<AllVulnerabilitiesPage routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities/exception-management`} element={<ExceptionManagementPage routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities/reports`} element={<VulnerabilityReportingPage routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities/reports/create`} element={<CreateReportWizard routePrefix="/v1" />} />
        <Route path={`main/vulnerabilities/reports/configuration/:reportId`} element={<ReportDetailPage routePrefix="/v1" />} />
        <Route path={`main/configmanagement`} element={<ConfigManagementPage routePrefix="/v1" />} />
        <Route path={`main/risk`} element={<RiskPage routePrefix="/v1" />} />
        <Route path={`main/clusters`} element={<ClustersPage routePrefix="/v1" />} />
        <Route path={`main/policy-management`} element={<Navigate to={r.policiesPath} replace />} />
        <Route path={`main/policy-management/policies`} element={<PoliciesPage routePrefix="/v1" />} />
        <Route path={`main/policy-management/policy-categories`} element={<PoliciesPage routePrefix="/v1" />} />
        <Route path={`main/collections`} element={<CollectionsPage routePrefix="/v1" />} />
        <Route path={`main/integrations`} element={<IntegrationsPage />} />
        <Route path={`main/access-control`} element={<AccessControlPage routePrefix="/v1" />} />
        <Route path={`main/systemconfig`} element={<SystemConfigPage />} />
        <Route path={`main/system-health`} element={<SystemHealthPage routePrefix="/v1" />} />
        <Route path={`main/administration-events`} element={<AdministrationEventsPage routePrefix="/v1" />} />
        <Route path={`main/search`} element={<SearchPage />} />
        <Route path={`main/apidocs`} element={<ApiDocsPage />} />
        <Route path={`main/apidocs-v2`} element={<ApiDocsPage />} />
        <Route path={`main/user`} element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to={r.dashboardPath} replace />} />
      </Routes>
    </VersionLayout>
  );
}

function V2Routes() {
  const r = v2Routes;
  return (
    <VersionLayout routes={r} version="v2">
      <Routes>
        <Route path="main" element={<Navigate to={r.dashboardPath} replace />} />
        <Route path={`main/dashboard`} element={<DashboardPage routePrefix="/v2" />} />
        <Route path={`main/network-graph`} element={<NetworkGraphPage />} />
        <Route path={`main/listening-endpoints`} element={<ListeningEndpointsPage routePrefix="/v2" />} />
        <Route path={`main/violations`} element={<ViolationsPage routePrefix="/v2" />} />
        <Route path={`main/violations/:violationId`} element={<ViolationDetailPage routePrefix="/v2" />} />
        <Route path={`main/compliance`} element={<Navigate to={r.complianceCoveragePath} replace />} />
        <Route path={`main/compliance/coverage`} element={<ComplianceCoveragePage routePrefix="/v2" />} />
        <Route path={`main/compliance/schedules`} element={<ComplianceSchedulesPage routePrefix="/v2" />} />
        <Route path={`main/vulnerabilities`} element={<Navigate to={r.vulnerabilitiesUserWorkloadsPath} replace />} />
        <Route path={`main/vulnerabilities/user-workloads`} element={<V2UserWorkloadVulnerabilities />} />
        <Route path={`main/vulnerabilities/user-workloads/deployments/:deploymentId`} element={<DeploymentDetailPage routePrefix="/v2" />} />
        <Route path={`main/vulnerabilities/cves/:cveId`} element={<CveDetailPage routePrefix="/v2" />} />
        <Route path={`main/vulnerabilities/platform`} element={<PlatformCvesPage routePrefix="/v2" />} />
        <Route path={`main/vulnerabilities/node-cves`} element={<NodeCvesPage routePrefix="/v2" />} />
        <Route path={`main/vulnerabilities/all`} element={<AllVulnerabilitiesPage routePrefix="/v2" />} />
        <Route path={`main/vulnerabilities/exception-management`} element={<ExceptionManagementPage routePrefix="/v2" />} />
        <Route path={`main/vulnerabilities/reports`} element={<V2ReportsPage />} />
        <Route path={`main/vulnerabilities/reports/create`} element={<V2CreateReportWizard />} />
        <Route path={`main/vulnerabilities/reports/configuration/:reportId`} element={<ReportDetailPage routePrefix="/v2" />} />
        <Route path={`main/vulnerabilities/reports/saved-filters/:filterId`} element={<V2SavedFilterDetail />} />
        <Route path={`main/configmanagement`} element={<ConfigManagementPage routePrefix="/v2" />} />
        <Route path={`main/risk`} element={<RiskPage routePrefix="/v2" />} />
        <Route path={`main/clusters`} element={<ClustersPage routePrefix="/v2" />} />
        <Route path={`main/policy-management`} element={<Navigate to={r.policiesPath} replace />} />
        <Route path={`main/policy-management/policies`} element={<PoliciesPage routePrefix="/v2" />} />
        <Route path={`main/policy-management/policy-categories`} element={<PoliciesPage routePrefix="/v2" />} />
        <Route path={`main/collections`} element={<CollectionsPage routePrefix="/v2" />} />
        <Route path={`main/integrations`} element={<IntegrationsPage />} />
        <Route path={`main/access-control`} element={<AccessControlPage routePrefix="/v2" />} />
        <Route path={`main/systemconfig`} element={<SystemConfigPage />} />
        <Route path={`main/system-health`} element={<SystemHealthPage routePrefix="/v2" />} />
        <Route path={`main/administration-events`} element={<AdministrationEventsPage routePrefix="/v2" />} />
        <Route path={`main/search`} element={<SearchPage />} />
        <Route path={`main/apidocs`} element={<ApiDocsPage />} />
        <Route path={`main/apidocs-v2`} element={<ApiDocsPage />} />
        <Route path={`main/user`} element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to={r.dashboardPath} replace />} />
      </Routes>
    </VersionLayout>
  );
}

function V3Routes() {
  const r = v3Routes;
  return (
    <VersionLayout routes={r} version="v3">
      <Routes>
        <Route path="main" element={<Navigate to={r.dashboardPath} replace />} />
        <Route path={`main/dashboard`} element={<DashboardPage routePrefix="/v3" />} />
        <Route path={`main/network-graph`} element={<NetworkGraphPage />} />
        <Route path={`main/listening-endpoints`} element={<ListeningEndpointsPage routePrefix="/v3" />} />
        <Route path={`main/violations`} element={<ViolationsPage routePrefix="/v3" />} />
        <Route path={`main/violations/:violationId`} element={<ViolationDetailPage routePrefix="/v3" />} />
        <Route path={`main/compliance`} element={<Navigate to={r.complianceCoveragePath} replace />} />
        <Route path={`main/compliance/coverage`} element={<ComplianceCoveragePage routePrefix="/v3" />} />
        <Route path={`main/compliance/schedules`} element={<ComplianceSchedulesPage routePrefix="/v3" />} />
        <Route path={`main/vulnerabilities`} element={<Navigate to={r.vulnerabilitiesUserWorkloadsPath} replace />} />
        <Route path={`main/vulnerabilities/user-workloads`} element={<UserWorkloadVulnerabilities routePrefix="/v3" />} />
        <Route path={`main/vulnerabilities/user-workloads/deployments/:deploymentId`} element={<DeploymentDetailPage routePrefix="/v3" />} />
        <Route path={`main/vulnerabilities/cves/:cveId`} element={<CveDetailPage routePrefix="/v3" />} />
        <Route path={`main/vulnerabilities/platform`} element={<PlatformCvesPage routePrefix="/v3" />} />
        <Route path={`main/vulnerabilities/node-cves`} element={<NodeCvesPage routePrefix="/v3" />} />
        <Route path={`main/vulnerabilities/all`} element={<AllVulnerabilitiesPage routePrefix="/v3" />} />
        <Route path={`main/vulnerabilities/exception-management`} element={<ExceptionManagementPage routePrefix="/v3" />} />
        <Route path={`main/vulnerabilities/reports`} element={<V3ReportsPage />} />
        <Route path={`main/vulnerabilities/reports/create`} element={<V3CreateReportWizard />} />
        <Route path={`main/vulnerabilities/reports/configuration/:reportId`} element={<ReportDetailPage routePrefix="/v3" />} />
        <Route path={`main/configmanagement`} element={<ConfigManagementPage routePrefix="/v3" />} />
        <Route path={`main/risk`} element={<RiskPage routePrefix="/v3" />} />
        <Route path={`main/clusters`} element={<ClustersPage routePrefix="/v3" />} />
        <Route path={`main/policy-management`} element={<Navigate to={r.policiesPath} replace />} />
        <Route path={`main/policy-management/policies`} element={<PoliciesPage routePrefix="/v3" />} />
        <Route path={`main/policy-management/policy-categories`} element={<PoliciesPage routePrefix="/v3" />} />
        <Route path={`main/collections`} element={<CollectionsPage routePrefix="/v3" />} />
        <Route path={`main/integrations`} element={<IntegrationsPage />} />
        <Route path={`main/access-control`} element={<AccessControlPage routePrefix="/v3" />} />
        <Route path={`main/systemconfig`} element={<SystemConfigPage />} />
        <Route path={`main/system-health`} element={<SystemHealthPage routePrefix="/v3" />} />
        <Route path={`main/administration-events`} element={<AdministrationEventsPage routePrefix="/v3" />} />
        <Route path={`main/search`} element={<SearchPage />} />
        <Route path={`main/apidocs`} element={<ApiDocsPage />} />
        <Route path={`main/apidocs-v2`} element={<ApiDocsPage />} />
        <Route path={`main/user`} element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to={r.dashboardPath} replace />} />
      </Routes>
    </VersionLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.PROD ? '/prototype' : '/'}>
      <Routes>
        <Route path="/" element={<VersionSelector />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/guide/general" element={<GenericGuidePage />} />
        <Route path="/v1/*" element={<V1Routes />} />
        <Route path="/v2/*" element={<V2Routes />} />
        <Route path="/v3/*" element={<V3Routes />} />
        <Route path="/main/*" element={<MainRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
