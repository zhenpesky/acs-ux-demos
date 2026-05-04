import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  Divider,
  Flex,
  FlexItem,
  Label,
  PageSection,
  Tab,
  Tabs,
  TabTitleText,
  Title,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

import { prefixRoutes } from '../routes';
import { VIOLATIONS, DEPLOYMENTS, POLICIES } from '../mockData';
import { useLiveSync } from '../api/hooks';

function generateViolationEvents(violation) {
  if (!violation) return [];
  const components = [
    { name: 'apt', version: '3.0.3' },
    { name: 'dpkg', version: '1.22.22' },
    { name: 'bash', version: '5.2.21' },
    { name: 'coreutils', version: '9.4' },
    { name: 'openssl', version: '3.1.4' },
  ];
  const count = Math.min(2 + Math.floor(Math.random() * 3), 5);
  return components.slice(0, count).map((c) => ({
    message: `Container '${violation.entity}' includes component '${c.name}' (version ${c.version})`,
  }));
}

function generateNetworkPolicies(violation) {
  return [
    {
      name: `${violation?.entity || 'deployment'}-network-policy`,
      namespace: 'default',
      type: 'Ingress',
      policyTypes: ['Ingress'],
    },
  ];
}

export default function ViolationDetailPage({ routePrefix = '/v1' }) {
  useLiveSync();
  const { violationId } = useParams();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);

  const violation = useMemo(() =>
    VIOLATIONS.find((v) => v.id === violationId),
    [violationId]
  );

  const deployment = useMemo(() =>
    violation ? DEPLOYMENTS.find((d) => d.name === violation.entity) : null,
    [violation]
  );

  const policy = useMemo(() =>
    violation ? POLICIES.find((p) => p.name === violation.policy || p.name.includes(violation.policy.substring(0, 20))) : null,
    [violation]
  );

  const events = useMemo(() => generateViolationEvents(violation), [violation]);
  const networkPolicies = useMemo(() => generateNetworkPolicies(violation), [violation]);

  const [activeTab, setActiveTab] = useState('violation');

  const topTabForEntity = violation
    ? violation.entityType === 'Platform' ? 'platform'
      : violation.entityType === 'Node' ? 'nodes'
      : 'user-workloads'
    : 'user-workloads';

  const breadcrumbLabel = violation
    ? violation.entityType === 'Platform' ? 'Platform violations'
      : violation.entityType === 'Node' ? 'Node violations'
      : 'User workload violations'
    : 'Violations';

  if (!violation) {
    return (
      <PageSection>
        <Title headingLevel="h1">Violation not found</Title>
        <Content component="p">The violation could not be found.</Content>
        <Button variant="link" onClick={() => navigate(routes.violationsPath)}>Back to Violations</Button>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection padding={{ default: 'noPadding' }} style={{ paddingInline: '24px' }}>
        <Tabs
          activeKey={topTabForEntity}
          onSelect={(_e, key) => navigate(routes.violationsPath)}
          style={{ borderBottom: 'none' }}
        >
          <Tab eventKey="user-workloads" title={<TabTitleText>User Workloads</TabTitleText>} />
          <Tab eventKey="platform" title={<TabTitleText>Platform</TabTitleText>} />
          <Tab eventKey="nodes" title={<TabTitleText>Nodes</TabTitleText>} />
          <Tab eventKey="all-violations" title={<TabTitleText>All Violations</TabTitleText>} />
        </Tabs>
      </PageSection>
      <Divider component="div" />

      <PageSection>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" isInline onClick={() => navigate(routes.violationsPath)}>{breadcrumbLabel}</Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{violation.policy}</BreadcrumbItem>
        </Breadcrumb>

        <Title headingLevel="h1" style={{ marginTop: '16px' }}>{violation.policy}</Title>
        <Content component="p" style={{ marginTop: '4px' }}>
          in "{violation.entity}" {violation.entityType}
        </Content>

        <Flex gap={{ default: 'gapSm' }} style={{ marginTop: '8px', marginBottom: '16px' }}>
          <FlexItem>
            <Label isCompact color={violation.state === 'Active' ? 'blue' : violation.state === 'Resolved' ? 'green' : 'gold'}>State: {violation.state || 'Active'}</Label>
          </FlexItem>
        </Flex>

        <Tabs activeKey={activeTab} onSelect={(_e, k) => setActiveTab(k)}>
          <Tab eventKey="violation" title={<TabTitleText>Violation</TabTitleText>} />
          <Tab eventKey="deployment" title={<TabTitleText>Deployment</TabTitleText>} />
          <Tab eventKey="policy" title={<TabTitleText>Policy</TabTitleText>} />
          <Tab eventKey="network-policies" title={<TabTitleText>Network policies</TabTitleText>} />
        </Tabs>
      </PageSection>
      <Divider component="div" />

      {activeTab === 'violation' && (
        <PageSection>
          <Title headingLevel="h2" style={{ marginBottom: '16px' }}>Violation events</Title>
          {events.map((event, i) => (
            <Card key={i} isFlat style={{ marginBottom: '12px' }}>
              <CardBody>{event.message}</CardBody>
            </Card>
          ))}
        </PageSection>
      )}

      {activeTab === 'deployment' && (
        <PageSection>
          <Title headingLevel="h2" style={{ marginBottom: '16px' }}>Deployment details</Title>
          {deployment ? (
            <Card isFlat>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px' }}>
                  <span style={{ fontWeight: 600 }}>Name:</span><span>{deployment.name}</span>
                  <span style={{ fontWeight: 600 }}>Namespace:</span><span>{deployment.namespace}</span>
                  <span style={{ fontWeight: 600 }}>Cluster:</span><span>{deployment.clusterName}</span>
                  <span style={{ fontWeight: 600 }}>Replicas:</span><span>{deployment.replicas || '—'}</span>
                  <span style={{ fontWeight: 600 }}>Created:</span>
                  <span>{new Date(deployment.created).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                  <span style={{ fontWeight: 600 }}>State:</span><span>{deployment.inactive === true ? 'Inactive' : 'Active'}</span>
                  <span style={{ fontWeight: 600 }}>Images:</span>
                  <span>{(deployment.images || []).map((img) => img.name.fullName).join(', ') || '—'}</span>
                  <span style={{ fontWeight: 600 }}>Labels:</span>
                  <span>{Object.entries(deployment.labels || {}).map(([k, val]) => `${k}=${val}`).join(', ')}</span>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Content component="p">Deployment details not available.</Content>
          )}
        </PageSection>
      )}

      {activeTab === 'policy' && (
        <PageSection>
          <Title headingLevel="h2" style={{ marginBottom: '16px' }}>Policy details</Title>
          <Card isFlat>
            <CardBody>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px' }}>
                <span style={{ fontWeight: 600 }}>Policy:</span><span>{violation.policy}</span>
                <span style={{ fontWeight: 600 }}>Severity:</span>
                <span>
                  <Label color={
                    violation.severity === 'Critical' ? 'red' :
                    violation.severity === 'High' ? 'orange' :
                    violation.severity === 'Medium' ? 'gold' : 'blue'
                  }>{violation.severity}</Label>
                </span>
                <span style={{ fontWeight: 600 }}>Categories:</span><span>{violation.categories.join(', ')}</span>
                <span style={{ fontWeight: 600 }}>Lifecycle:</span><span>{violation.lifecycle}</span>
                <span style={{ fontWeight: 600 }}>Enforced:</span><span>{violation.enforced ? 'Yes' : 'No'}</span>
                {policy && (
                  <>
                    <span style={{ fontWeight: 600 }}>Status:</span><span>{!policy.disabled ? 'Enabled' : 'Disabled'}</span>
                    <span style={{ fontWeight: 600 }}>Origin:</span><span>{policy.isDefault ? 'System' : 'User'}</span>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </PageSection>
      )}

      {activeTab === 'network-policies' && (
        <PageSection>
          <Title headingLevel="h2" style={{ marginBottom: '16px' }}>Network policies</Title>
          <Table aria-label="Network policies" variant="compact">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Namespace</Th>
                <Th>Type</Th>
              </Tr>
            </Thead>
            <Tbody>
              {networkPolicies.map((np, i) => (
                <Tr key={i}>
                  <Td>{np.name}</Td>
                  <Td>{np.namespace}</Td>
                  <Td>{np.type}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageSection>
      )}
    </>
  );
}
