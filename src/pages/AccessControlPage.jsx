import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Content,
  Divider,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Tab,
  Tabs,
  Title,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { AUTH_PROVIDERS, ROLES } from '../mockData';
import { useLiveSync } from '../api/hooks';

const authProviders = AUTH_PROVIDERS.map((a) => ({
  name: a.name,
  type: a.type === 'oidc' ? 'OIDC' : 'API Token',
  minimumRole: a.minimumRole,
  rules: a.rules,
}));

const roles = ROLES.map((r) => ({
  name: r.name,
  origin: r.origin,
  description: r.description,
  permissionSet: r.permissionSet,
  accessScope: r.accessScope,
}));

const permissionSets = [
  { name: 'Admin', origin: 'System', description: 'Full read and write access to all resources' },
  { name: 'Analyst', origin: 'System', description: 'Read-only access to all resources' },
  { name: 'Continuous Integration', origin: 'System', description: 'CI-scoped permissions for image scanning and policy checks' },
  { name: 'Scope Manager', origin: 'System', description: 'Auth provider and scope management permissions' },
  { name: 'Sensor Creator', origin: 'System', description: 'Permissions needed to create sensor bundles' },
  { name: 'Vulnerability Management Approver', origin: 'System', description: 'Approve or deny vulnerability exception requests' },
  { name: 'Vulnerability Management Requester', origin: 'System', description: 'Create vulnerability exception requests' },
  { name: 'Vulnerability Report Creator', origin: 'System', description: 'Create and manage vulnerability reports' },
];

const accessScopes = [
  { name: 'Unrestricted', origin: 'System', description: 'Access to all clusters and namespaces', clusters: 'All', namespaces: 'All' },
  { name: 'Deny All', origin: 'System', description: 'No access to any clusters or namespaces', clusters: 'None', namespaces: 'None' },
];

export default function AccessControlPage({ routePrefix }) {
  useLiveSync();
  const [activeTab, setActiveTab] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  const openDetail = (item, type) => { setSelectedItem(item); setSelectedType(type); };

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Access Control</Title>
        <Content component="p">Manage roles, permissions, and access scopes</Content>
      </PageSection>
      <PageSection padding={{ default: 'noPadding' }}>
        <Tabs activeKey={activeTab} onSelect={(_e, k) => setActiveTab(k)} style={{ paddingInline: '24px' }}>
          <Tab eventKey={0} title={`Auth providers (${authProviders.length})`} />
          <Tab eventKey={1} title={`Roles (${roles.length})`} />
          <Tab eventKey={2} title={`Permission sets (${permissionSets.length})`} />
          <Tab eventKey={3} title={`Access scopes (${accessScopes.length})`} />
        </Tabs>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        {activeTab === 0 && (
          <Table aria-label="Auth providers" variant="compact">
            <Thead><Tr><Th>Name</Th><Th>Type</Th><Th>Minimum role</Th><Th>Rules</Th></Tr></Thead>
            <Tbody>
              {authProviders.map((a, i) => (
                <Tr key={i} isClickable onClick={() => openDetail(a, 'Auth Provider')}>
                  <Td><Button variant="link" isInline onClick={(e) => { e.stopPropagation(); openDetail(a, 'Auth Provider'); }}>{a.name}</Button></Td>
                  <Td><Label isCompact color={a.type === 'OIDC' ? 'blue' : 'cyan'}>{a.type}</Label></Td>
                  <Td>{a.minimumRole}</Td>
                  <Td>{a.rules}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {activeTab === 1 && (
          <Table aria-label="Roles" variant="compact">
            <Thead><Tr><Th>Name</Th><Th>Origin</Th><Th>Description</Th><Th>Permission set</Th><Th>Access scope</Th></Tr></Thead>
            <Tbody>
              {roles.map((r, i) => (
                <Tr key={i} isClickable onClick={() => openDetail(r, 'Role')}>
                  <Td><Button variant="link" isInline onClick={(e) => { e.stopPropagation(); openDetail(r, 'Role'); }}>{r.name}</Button></Td>
                  <Td>{r.origin}</Td>
                  <Td>{r.description}</Td>
                  <Td>{r.permissionSet}</Td>
                  <Td>{r.accessScope}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {activeTab === 2 && (
          <Table aria-label="Permission sets" variant="compact">
            <Thead><Tr><Th>Name</Th><Th>Origin</Th><Th>Description</Th></Tr></Thead>
            <Tbody>
              {permissionSets.map((p, i) => (
                <Tr key={i} isClickable onClick={() => openDetail(p, 'Permission Set')}>
                  <Td><Button variant="link" isInline onClick={(e) => { e.stopPropagation(); openDetail(p, 'Permission Set'); }}>{p.name}</Button></Td>
                  <Td>{p.origin}</Td>
                  <Td>{p.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {activeTab === 3 && (
          <Table aria-label="Access scopes" variant="compact">
            <Thead><Tr><Th>Name</Th><Th>Origin</Th><Th>Description</Th><Th>Clusters</Th><Th>Namespaces</Th></Tr></Thead>
            <Tbody>
              {accessScopes.map((s, i) => (
                <Tr key={i} isClickable onClick={() => openDetail(s, 'Access Scope')}>
                  <Td><Button variant="link" isInline onClick={(e) => { e.stopPropagation(); openDetail(s, 'Access Scope'); }}>{s.name}</Button></Td>
                  <Td>{s.origin}</Td>
                  <Td>{s.description}</Td>
                  <Td>{s.clusters}</Td>
                  <Td>{s.namespaces}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </PageSection>

      {selectedItem && (
        <Modal isOpen onClose={() => setSelectedItem(null)} variant="medium">
          <ModalHeader title={`${selectedType}: ${selectedItem.name}`} />
          <ModalBody>
            <Card isFlat>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 16px' }}>
                  {Object.entries(selectedItem).map(([key, val]) => (
                    <><span key={`k-${key}`} style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</span><span key={`v-${key}`}>{String(val)}</span></>
                  ))}
                </div>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setSelectedItem(null)}>Edit</Button>
            <Button variant="link" onClick={() => setSelectedItem(null)}>Close</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
