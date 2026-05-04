import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  ContentVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  SearchInput,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { v2Routes } from '../../routes';

const SAVED_FILTERS_MAP = {
  'fe': { name: 'Front End only', description: 'Frontend service CVE tracking' },
  'sf-0': { name: 'Critical CVEs - production', description: 'Critical vulnerabilities in production clusters' },
  'sf-1': { name: 'etcd critical', description: 'Critical CVEs affecting etcd deployments' },
  'sf-2': { name: 'Staging cluster filter', description: 'All CVEs in staging-secured-cluster' },
  'sf-3': { name: 'Platform components', description: 'Platform component vulnerabilities' },
  'sf-4': { name: 'Compliance violations', description: 'Compliance-related vulnerability findings' },
  'sf-5': { name: 'Inactive images', description: 'CVEs in inactive and aging images' },
  'sf-6': { name: 'Kubernetes components', description: 'Kubernetes core component vulnerabilities' },
  'sf-7': { name: 'Fixable CVEs', description: 'Only fixable vulnerabilities across all clusters' },
  'sf-8': { name: 'High severity filter', description: 'High and critical severity CVEs' },
  'sf-9': { name: 'Dev namespace filter', description: 'Development namespace vulnerability scan' },
  'sf-10': { name: 'QA environment', description: 'QA environment vulnerability tracking' },
  'sf-11': { name: 'Security review filter', description: 'Security team review filter' },
  'sf-12': { name: 'Executive summary filter', description: 'Executive-level vulnerability summary' },
  'sf-13': { name: 'All containers', description: 'All container image CVEs' },
};

const MOCK_ASSOCIATED_FEATURES = [
  { id: 'feat-1', name: 'Weekly Critical CVEs', view: 'User workloads CVE view' },
  { id: 'feat-2', name: 'Monthly Compliance CVEs', view: 'Compliance CVE view' },
  { id: 'feat-3', name: 'Platform CVE Summary', view: 'Platform CVE view' },
  { id: 'feat-4', name: 'User Workloads Report', view: 'User workloads CVE view' },
  { id: 'feat-5', name: 'Staging Cluster Scan', view: 'Staging cluster view' },
  { id: 'feat-6', name: 'Production Critical Only', view: 'Production critical view' },
  { id: 'feat-7', name: 'Inactive Image Audit', view: 'Inactive images view' },
  { id: 'feat-8', name: 'Container Scan Weekly', view: 'All containers view' },
  { id: 'feat-9', name: 'K8s Component CVEs', view: 'Kubernetes components view' },
  { id: 'feat-10', name: 'Security Team Report', view: 'Security review view' },
  { id: 'feat-11', name: 'Dev Namespace Scan', view: 'Dev namespace view' },
  { id: 'feat-12', name: 'QA Environment Report', view: 'QA environment view' },
  { id: 'feat-13', name: 'Fixable CVEs Only', view: 'Fixable CVE view' },
  { id: 'feat-14', name: 'High Severity Report', view: 'High severity view' },
  { id: 'feat-15', name: 'Compliance Audit Q1', view: 'Compliance audit view' },
  { id: 'feat-16', name: 'Executive Summary', view: 'Executive summary view' },
];

export default function V2SavedFilterDetail() {
  const { filterId } = useParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const filterData = SAVED_FILTERS_MAP[filterId] || SAVED_FILTERS_MAP['sf-1'];
  const filterName = filterData.name;

  const filteredFeatures = MOCK_ASSOCIATED_FEATURES.filter((f) =>
    f.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    f.view.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <PageSection  padding={{ default: 'noPadding' }}>
        <div style={{ padding: '24px 24px 0 24px' }}>
          <Breadcrumb>
            <BreadcrumbItem
              to={v2Routes.vulnerabilityReportsPath}
              onClick={(e) => { e.preventDefault(); navigate(v2Routes.vulnerabilityReportsPath); }}
            >
              Vulnerability Reporting
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{filterName}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Divider style={{ marginTop: '16px' }} />
      </PageSection>

      <PageSection >
        <Title headingLevel="h1" size="xl" style={{ marginBottom: '8px' }}>
          {filterName}
        </Title>
        <Content component={ContentVariants.p}>
          View all the associated features that bounded to this reusable resource.
        </Content>
      </PageSection>

      <PageSection  padding={{ default: 'noPadding' }}>
        <div style={{ padding: '0 24px 24px 24px' }}>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <SearchInput
                  placeholder="Filter by Saved filter name"
                  value={searchValue}
                  onChange={(_, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                  style={{ minWidth: '400px' }}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="plain"
                  aria-label="Search"
                  icon={<ArrowRightIcon />}
                />
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Button variant="primary">Create reusable resource</Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Associated features table">
            <Thead>
              <Tr>
                <Th screenReaderText="Select" />
                <Th sort={{ columnIndex: 0 }}>Associated feature</Th>
                <Th>Associated views</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredFeatures.map((feature) => (
                <Tr key={feature.id}>
                  <Td select={{ isSelected: false, onSelect: () => {} }} />
                  <Td dataLabel="Associated feature">
                    <Button variant="link" isInline onClick={() => navigate(v2Routes.vulnerabilityReportsCreatePath)}>
                      {feature.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Associated views">
                    <Button variant="link" isInline onClick={() => navigate(v2Routes.vulnerabilitiesUserWorkloadsPath)}>
                      {feature.view}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </PageSection>
    </>
  );
}
