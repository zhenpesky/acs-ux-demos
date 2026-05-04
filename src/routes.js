export const mainPath = '/main';
export const loginPath = '/login';

export const dashboardPath = `${mainPath}/dashboard`;
export const networkBasePath = `${mainPath}/network-graph`;
export const listeningEndpointsPath = `${mainPath}/listening-endpoints`;
export const violationsPath = `${mainPath}/violations`;
export const compliancePath = `${mainPath}/compliance`;
export const complianceCoveragePath = `${compliancePath}/coverage`;
export const complianceSchedulesPath = `${compliancePath}/schedules`;
export const vulnerabilitiesBasePath = `${mainPath}/vulnerabilities`;
export const vulnerabilitiesUserWorkloadsPath = `${vulnerabilitiesBasePath}/user-workloads`;
export const vulnerabilitiesPlatformPath = `${vulnerabilitiesBasePath}/platform`;
export const vulnerabilitiesNodePath = `${vulnerabilitiesBasePath}/node-cves`;
export const vulnerabilitiesAllPath = `${vulnerabilitiesBasePath}/all`;
export const vulnerabilitiesExceptionPath = `${vulnerabilitiesBasePath}/exception-management`;
export const vulnerabilityReportsPath = `${vulnerabilitiesBasePath}/reports`;
export const vulnerabilityReportsCreatePath = `${vulnerabilityReportsPath}/create`;
export const vulnerabilityReportDetailPath = `${vulnerabilityReportsPath}/configuration`;
export const deploymentDetailPath = `${vulnerabilitiesBasePath}/user-workloads/deployments`;
export const cveDetailPath = `${vulnerabilitiesBasePath}/cves`;
export const violationDetailPath = `${mainPath}/violations`;
export const riskPath = `${mainPath}/risk`;
export const configManagementPath = `${mainPath}/configmanagement`;
export const policyManagementPath = `${mainPath}/policy-management`;
export const policiesPath = `${policyManagementPath}/policies`;
export const policyCategoriesPath = `${policyManagementPath}/policy-categories`;
export const clustersPath = `${mainPath}/clusters`;
export const collectionsPath = `${mainPath}/collections`;
export const integrationsPath = `${mainPath}/integrations`;
export const accessControlPath = `${mainPath}/access-control`;
export const systemConfigPath = `${mainPath}/systemconfig`;
export const systemHealthPath = `${mainPath}/system-health`;
export const administrationEventsPath = `${mainPath}/administration-events`;
export const searchPath = `${mainPath}/search`;
export const apidocsPath = `${mainPath}/apidocs`;
export const apidocsPathV2 = `${mainPath}/apidocs-v2`;
export const userBasePath = `${mainPath}/user`;

export function prefixRoutes(prefix) {
  return {
    mainPath: `${prefix}${mainPath}`,
    dashboardPath: `${prefix}${dashboardPath}`,
    networkBasePath: `${prefix}${networkBasePath}`,
    listeningEndpointsPath: `${prefix}${listeningEndpointsPath}`,
    violationsPath: `${prefix}${violationsPath}`,
    compliancePath: `${prefix}${compliancePath}`,
    complianceCoveragePath: `${prefix}${complianceCoveragePath}`,
    complianceSchedulesPath: `${prefix}${complianceSchedulesPath}`,
    vulnerabilitiesBasePath: `${prefix}${vulnerabilitiesBasePath}`,
    vulnerabilitiesUserWorkloadsPath: `${prefix}${vulnerabilitiesUserWorkloadsPath}`,
    vulnerabilitiesPlatformPath: `${prefix}${vulnerabilitiesPlatformPath}`,
    vulnerabilitiesNodePath: `${prefix}${vulnerabilitiesNodePath}`,
    vulnerabilitiesAllPath: `${prefix}${vulnerabilitiesAllPath}`,
    vulnerabilitiesExceptionPath: `${prefix}${vulnerabilitiesExceptionPath}`,
    vulnerabilityReportsPath: `${prefix}${vulnerabilityReportsPath}`,
    vulnerabilityReportsCreatePath: `${prefix}${vulnerabilityReportsCreatePath}`,
    vulnerabilityReportDetailPath: `${prefix}${vulnerabilityReportDetailPath}`,
    deploymentDetailPath: `${prefix}${deploymentDetailPath}`,
    cveDetailPath: `${prefix}${cveDetailPath}`,
    riskPath: `${prefix}${riskPath}`,
    configManagementPath: `${prefix}${configManagementPath}`,
    policyManagementPath: `${prefix}${policyManagementPath}`,
    policiesPath: `${prefix}${policiesPath}`,
    policyCategoriesPath: `${prefix}${policyCategoriesPath}`,
    clustersPath: `${prefix}${clustersPath}`,
    collectionsPath: `${prefix}${collectionsPath}`,
    integrationsPath: `${prefix}${integrationsPath}`,
    accessControlPath: `${prefix}${accessControlPath}`,
    systemConfigPath: `${prefix}${systemConfigPath}`,
    systemHealthPath: `${prefix}${systemHealthPath}`,
    administrationEventsPath: `${prefix}${administrationEventsPath}`,
    searchPath: `${prefix}${searchPath}`,
    apidocsPath: `${prefix}${apidocsPath}`,
    apidocsPathV2: `${prefix}${apidocsPathV2}`,
    userBasePath: `${prefix}${userBasePath}`,
    savedFilterDetailPath: `${prefix}${vulnerabilitiesBasePath}/reports/saved-filters`,
  };
}

export const v1Routes = prefixRoutes('/v1');
export const v2Routes = prefixRoutes('/v2');
export const v3Routes = prefixRoutes('/v3');
