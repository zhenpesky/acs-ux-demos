import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertActionCloseButton,
  Button,
  Content,
  Divider,
  Flex,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Pagination,
  SearchInput,
  Tab,
  Tabs,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { prefixRoutes } from '../routes';
import { POLICIES } from '../mockData';
import { useLiveSync } from '../api/hooks';

const severityColors = { Critical: 'red', High: 'orange', Medium: 'gold', Low: 'blue' };

function formatPolicySeverity(apiSeverity) {
  if (!apiSeverity) return '';
  const base = String(apiSeverity).replace(/_SEVERITY$/i, '');
  if (!base) return '';
  return base.charAt(0) + base.slice(1).toLowerCase();
}

function formatLifecycleStages(stages) {
  if (!stages?.length) return '';
  return stages
    .map((stage) => stage.split('_').map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(' '))
    .join(', ');
}

const POLICY_CATEGORIES = [
  { name: 'Anomalous Activity', policies: 8, description: 'Detects unusual behavior or activity patterns' },
  { name: 'Cryptocurrency Mining', policies: 2, description: 'Detects cryptocurrency mining activity' },
  { name: 'DevOps Best Practices', policies: 15, description: 'Enforces DevOps and CI/CD best practices' },
  { name: 'Docker CIS', policies: 3, description: 'Docker CIS benchmark compliance checks' },
  { name: 'Kubernetes', policies: 12, description: 'Kubernetes security and configuration checks' },
  { name: 'Kubernetes Events', policies: 4, description: 'Monitors Kubernetes events for anomalies' },
  { name: 'Network Tools', policies: 3, description: 'Detects network scanning and enumeration tools' },
  { name: 'Package Management', policies: 2, description: 'Package manager usage in running containers' },
  { name: 'Privileges', policies: 6, description: 'Excessive privilege and capability checks' },
  { name: 'Security Best Practices', policies: 18, description: 'General security hardening best practices' },
  { name: 'Supply Chain Security', policies: 5, description: 'Supply chain and image provenance checks' },
  { name: 'System Modification', policies: 4, description: 'Detects runtime system modifications' },
  { name: 'Vulnerability Management', policies: 5, description: 'CVE and vulnerability-related policies' },
];

export default function PoliciesPage({ routePrefix }) {
  const syncState = useLiveSync();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [importAlert, setImportAlert] = useState(false);

  const mockPolicies = useMemo(() => POLICIES.map((p) => ({
    id: p.id || p.name,
    name: p.name,
    status: !p.disabled ? 'Enabled' : 'Disabled',
    origin: p.isDefault ? 'System' : 'User',
    notifiers: (p.notifiers || []).length,
    severity: formatPolicySeverity(p.severity),
    lifecycle: formatLifecycleStages(p.lifecycleStages),
    description: p.description || `Policy to enforce ${(p.name || '').toLowerCase()} requirements`,
    categories: p.categories || ['Security Best Practices'],
  })), [syncState?.version]);

  const filteredPolicies = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return mockPolicies;
    return mockPolicies.filter((p) =>
      [p.name, p.status, p.origin, p.severity, p.lifecycle].some((f) =>
        String(f).toLowerCase().includes(q)
      )
    );
  }, [searchValue, mockPolicies]);

  const paginatedPolicies = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredPolicies.slice(start, start + perPage);
  }, [filteredPolicies, page, perPage]);

  const filteredCategories = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return POLICY_CATEGORIES;
    return POLICY_CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [searchValue]);

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Policy management</Title>
      </PageSection>
      <PageSection padding={{ default: 'noPadding' }}>
        <Tabs activeKey={activeTab} onSelect={(_e, k) => { setActiveTab(k); setSearchValue(''); setPage(1); }} style={{ paddingInline: '24px' }}>
          <Tab eventKey={0} title={`Policies (${mockPolicies.length})`} />
          <Tab eventKey={1} title={`Policy categories (${POLICY_CATEGORIES.length})`} />
        </Tabs>
      </PageSection>
      <Divider component="div" />

      {importAlert && (
        <PageSection padding={{ default: 'noPadding' }} style={{ padding: '16px 24px 0' }}>
          <Alert variant="info" isInline title="Import policy: Use the StackRox API to import policy JSON files." actionClose={<AlertActionCloseButton onClose={() => setImportAlert(false)} />} />
        </PageSection>
      )}

      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
              <SearchInput placeholder={activeTab === 0 ? "Filter policies" : "Filter categories"}
                value={searchValue}
                onChange={(_e, v) => { setSearchValue(v); setPage(1); }}
                onClear={() => { setSearchValue(''); setPage(1); }} />
            </ToolbarItem>
            {activeTab === 0 && (
              <>
                <ToolbarItem>
                  <Button variant="primary" onClick={() => {
                    setSelectedPolicy({ name: '', status: 'Disabled', origin: 'User', notifiers: 0, severity: 'Medium', lifecycle: 'BUILD', isNew: true });
                  }}>Create policy</Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="secondary" onClick={() => setImportAlert(true)}>Import policy</Button>
                </ToolbarItem>
              </>
            )}
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={activeTab === 0 ? filteredPolicies.length : filteredCategories.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => { setPerPage(pp); setPage(1); }}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        {activeTab === 0 ? (
          <Table aria-label="Policies table" variant="compact">
            <Thead>
              <Tr>
                <Th>Policy</Th>
                <Th>Status</Th>
                <Th>Origin</Th>
                <Th>Notifiers</Th>
                <Th>Severity</Th>
                <Th>Lifecycle</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedPolicies.map((p, i) => (
                <Tr key={i} isClickable onClick={() => setSelectedPolicy(p)}>
                  <Td><Button variant="link" isInline onClick={(e) => { e.stopPropagation(); setSelectedPolicy(p); }}>{p.name}</Button></Td>
                  <Td><Label isCompact color={p.status === 'Enabled' ? 'green' : 'grey'}>{p.status}</Label></Td>
                  <Td>{p.origin}</Td>
                  <Td>{p.notifiers}</Td>
                  <Td><Label isCompact color={severityColors[p.severity]}>{p.severity}</Label></Td>
                  <Td>{p.lifecycle}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Table aria-label="Policy categories table" variant="compact">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Policies</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCategories.map((c, i) => (
                <Tr key={i}>
                  <Td><strong>{c.name}</strong></Td>
                  <Td><Label isCompact color="blue">{c.policies}</Label></Td>
                  <Td>{c.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </PageSection>

      {selectedPolicy && (
        <Modal isOpen onClose={() => setSelectedPolicy(null)} variant="large">
          <ModalHeader title={selectedPolicy.isNew ? 'Create policy' : selectedPolicy.name} />
          <ModalBody>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px 16px' }}>
              <span style={{ fontWeight: 600 }}>Policy name:</span><span>{selectedPolicy.name || '(new policy)'}</span>
              <span style={{ fontWeight: 600 }}>Severity:</span><span><Label isCompact color={severityColors[selectedPolicy.severity]}>{selectedPolicy.severity}</Label></span>
              <span style={{ fontWeight: 600 }}>Status:</span><span><Label isCompact color={selectedPolicy.status === 'Enabled' ? 'green' : 'grey'}>{selectedPolicy.status}</Label></span>
              <span style={{ fontWeight: 600 }}>Lifecycle stage:</span><span>{selectedPolicy.lifecycle}</span>
              <span style={{ fontWeight: 600 }}>Origin:</span><span>{selectedPolicy.origin}</span>
              <span style={{ fontWeight: 600 }}>Notifiers:</span><span>{selectedPolicy.notifiers}</span>
              <span style={{ fontWeight: 600 }}>Description:</span><span>{selectedPolicy.description}</span>
            </div>
          </ModalBody>
          <ModalFooter>
            {selectedPolicy.status === 'Enabled'
              ? <Button variant="secondary" onClick={() => setSelectedPolicy(null)}>Disable policy</Button>
              : <Button variant="primary" onClick={() => setSelectedPolicy(null)}>Enable policy</Button>
            }
            <Button variant="secondary" onClick={() => setSelectedPolicy(null)}>Edit policy</Button>
            <Button variant="link" onClick={() => setSelectedPolicy(null)}>Close</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
