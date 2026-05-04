import { useLocation, useNavigate } from 'react-router-dom';
import {
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  PageSidebar,
  PageSidebarBody,
} from '@patternfly/react-core';

export default function NavigationSidebar({ routes, version }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.startsWith(path);
  const isGroupActive = (paths) => paths.some(p => location.pathname.startsWith(p));

  const handleNavClick = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };

  const reportsLabel = version === 'v2' ? 'Reports and Saved Views' : 'Vulnerability Reporting';
  const reportsNavLabel = version === 'v2' ? 'Reports' : 'Vulnerability Reporting';

  return (
    <PageSidebar>
      <PageSidebarBody>
        <Nav aria-label="Navigation">
          <NavList>
            <NavItem
              isActive={isActive(routes.dashboardPath)}
              onClick={handleNavClick(routes.dashboardPath)}
              to={routes.dashboardPath}
            >
              Dashboard
            </NavItem>

            <NavExpandable
              title="Network"
              isExpanded={isGroupActive([routes.networkBasePath, routes.listeningEndpointsPath])}
              isActive={isGroupActive([routes.networkBasePath, routes.listeningEndpointsPath])}
            >
              <NavItem
                isActive={isActive(routes.networkBasePath)}
                onClick={handleNavClick(routes.networkBasePath)}
                to={routes.networkBasePath}
              >
                Network Graph
              </NavItem>
              <NavItem
                isActive={isActive(routes.listeningEndpointsPath)}
                onClick={handleNavClick(routes.listeningEndpointsPath)}
                to={routes.listeningEndpointsPath}
              >
                Listening Endpoints
              </NavItem>
            </NavExpandable>

            <NavItem
              isActive={isActive(routes.violationsPath)}
              onClick={handleNavClick(routes.violationsPath)}
              to={routes.violationsPath}
            >
              Violations
            </NavItem>

            <NavExpandable
              title="Compliance"
              isExpanded={isGroupActive([routes.complianceCoveragePath, routes.complianceSchedulesPath])}
              isActive={isGroupActive([routes.complianceCoveragePath, routes.complianceSchedulesPath])}
            >
              <NavItem
                isActive={isActive(routes.complianceCoveragePath)}
                onClick={handleNavClick(routes.complianceCoveragePath)}
                to={routes.complianceCoveragePath}
              >
                Coverage
              </NavItem>
              <NavItem
                isActive={isActive(routes.complianceSchedulesPath)}
                onClick={handleNavClick(routes.complianceSchedulesPath)}
                to={routes.complianceSchedulesPath}
              >
                Schedules
              </NavItem>
            </NavExpandable>

            <NavExpandable
              title="Vulnerability Management"
              isExpanded={isGroupActive([
                routes.vulnerabilitiesUserWorkloadsPath,
                routes.vulnerabilitiesPlatformPath,
                routes.vulnerabilitiesNodePath,
                routes.vulnerabilitiesAllPath,
                routes.vulnerabilitiesExceptionPath,
                routes.vulnerabilityReportsPath,
                routes.deploymentDetailPath,
              ].filter(Boolean))}
              isActive={isGroupActive([
                routes.vulnerabilitiesUserWorkloadsPath,
                routes.vulnerabilitiesPlatformPath,
                routes.vulnerabilitiesNodePath,
                routes.vulnerabilitiesAllPath,
                routes.vulnerabilitiesExceptionPath,
                routes.vulnerabilityReportsPath,
                routes.deploymentDetailPath,
              ].filter(Boolean))}
            >
              <NavItem
                isActive={isActive(routes.vulnerabilitiesUserWorkloadsPath) || isActive(routes.vulnerabilitiesPlatformPath) || isActive(routes.vulnerabilitiesNodePath) || isActive(routes.vulnerabilitiesAllPath) || (routes.deploymentDetailPath && isActive(routes.deploymentDetailPath))}
                onClick={handleNavClick(routes.vulnerabilitiesUserWorkloadsPath)}
                to={routes.vulnerabilitiesUserWorkloadsPath}
              >
                Results
              </NavItem>
              <NavItem
                isActive={isActive(routes.vulnerabilitiesExceptionPath)}
                onClick={handleNavClick(routes.vulnerabilitiesExceptionPath)}
                to={routes.vulnerabilitiesExceptionPath}
              >
                Exception Management
              </NavItem>
              <NavItem
                isActive={isActive(routes.vulnerabilityReportsPath)}
                onClick={handleNavClick(routes.vulnerabilityReportsPath)}
                to={routes.vulnerabilityReportsPath}
              >
                {reportsNavLabel}
              </NavItem>
            </NavExpandable>

            <NavItem
              isActive={isActive(routes.configManagementPath)}
              onClick={handleNavClick(routes.configManagementPath)}
              to={routes.configManagementPath}
            >
              Configuration Management
            </NavItem>

            <NavItem
              isActive={isActive(routes.riskPath)}
              onClick={handleNavClick(routes.riskPath)}
              to={routes.riskPath}
            >
              Risk
            </NavItem>

            <NavExpandable
              title="Platform Configuration"
              isExpanded={isGroupActive([
                routes.clustersPath,
                routes.policiesPath,
                routes.policyCategoriesPath,
                routes.collectionsPath,
                routes.integrationsPath,
                routes.accessControlPath,
                routes.systemConfigPath,
                routes.systemHealthPath,
                routes.administrationEventsPath,
              ])}
              isActive={isGroupActive([
                routes.clustersPath,
                routes.policiesPath,
                routes.policyCategoriesPath,
                routes.collectionsPath,
                routes.integrationsPath,
                routes.accessControlPath,
                routes.systemConfigPath,
                routes.systemHealthPath,
                routes.administrationEventsPath,
              ])}
            >
              <NavItem
                isActive={isActive(routes.clustersPath)}
                onClick={handleNavClick(routes.clustersPath)}
                to={routes.clustersPath}
              >
                Clusters
              </NavItem>
              <NavItem
                isActive={isActive(routes.policiesPath)}
                onClick={handleNavClick(routes.policiesPath)}
                to={routes.policiesPath}
              >
                Policy Management
              </NavItem>
              <NavItem
                isActive={isActive(routes.collectionsPath)}
                onClick={handleNavClick(routes.collectionsPath)}
                to={routes.collectionsPath}
              >
                Collections
              </NavItem>
              <NavItem
                isActive={isActive(routes.integrationsPath)}
                onClick={handleNavClick(routes.integrationsPath)}
                to={routes.integrationsPath}
              >
                Integrations
              </NavItem>
              <NavItem
                isActive={isActive(routes.accessControlPath)}
                onClick={handleNavClick(routes.accessControlPath)}
                to={routes.accessControlPath}
              >
                Access Control
              </NavItem>
              <NavItem
                isActive={isActive(routes.systemConfigPath)}
                onClick={handleNavClick(routes.systemConfigPath)}
                to={routes.systemConfigPath}
              >
                System Configuration
              </NavItem>
              <NavItem
                isActive={isActive(routes.systemHealthPath)}
                onClick={handleNavClick(routes.systemHealthPath)}
                to={routes.systemHealthPath}
              >
                System Health
              </NavItem>
              <NavItem
                isActive={isActive(routes.administrationEventsPath)}
                onClick={handleNavClick(routes.administrationEventsPath)}
                to={routes.administrationEventsPath}
              >
                Administration Events
              </NavItem>
            </NavExpandable>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
}
