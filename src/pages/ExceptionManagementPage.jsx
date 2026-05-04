import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Content,
  Divider,
  Flex,
  FlexItem,
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
import { EXCEPTIONS } from '../mockData';
import { useLiveSync } from '../api/hooks';

const statusColors = { Approved: 'green', Pending: 'gold', Denied: 'red' };

export default function ExceptionManagementPage({ routePrefix }) {
  const syncState = useLiveSync();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedExc, setSelectedExc] = useState(null);

  const allExceptions = useMemo(() => EXCEPTIONS.map((e) => {
    const statusText = e.status || '';
    const statusShort = statusText.startsWith('Approved') ? 'Approved' : statusText === 'Pending' ? 'Pending' : 'Denied';
    return {
      name: e.name || 'Unknown',
      requester: e.requester || e.requestor || 'Unknown',
      scope: e.scope || 'Unknown',
      severity: e.severity || 'Unknown',
      status: statusShort,
      type: (e.name || '').includes('defer') || (e.name || '').includes('Defer') ? 'Deferral' : 'False positive',
      expires: e.expires === '—' || !e.expires ? 'N/A' : new Date(e.expires).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      created: e.created ? new Date(e.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
      comment: e.comment || 'No additional comments provided.',
      cves: e.cves || ['CVE-2024-1234'],
    };
  }), [syncState?.version]);

  const pending = useMemo(() => allExceptions.filter((e) => e.status === 'Pending'), [allExceptions]);
  const approvedDeferrals = useMemo(() => allExceptions.filter((e) => e.status === 'Approved' && e.type === 'Deferral'), [allExceptions]);
  const approvedFP = useMemo(() => allExceptions.filter((e) => e.status === 'Approved' && e.type === 'False positive'), [allExceptions]);
  const denied = useMemo(() => allExceptions.filter((e) => e.status === 'Denied'), [allExceptions]);

  const tabData = useMemo(() => {
    switch (activeTab) {
      case 0: return pending;
      case 1: return approvedDeferrals;
      case 2: return approvedFP;
      case 3: return denied;
      default: return allExceptions;
    }
  }, [activeTab, pending, approvedDeferrals, approvedFP, denied, allExceptions]);

  const filteredExceptions = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return tabData;
    return tabData.filter((e) =>
      [e.name, e.requester, e.scope, e.severity, e.status, e.expires, e.created].some((field) =>
        String(field).toLowerCase().includes(q)
      )
    );
  }, [searchValue, tabData]);

  const paginatedExceptions = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredExceptions.slice(start, start + perPage);
  }, [filteredExceptions, page, perPage]);

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Exception Management</Title>
        <Content component="p">Manage vulnerability exceptions and deferrals</Content>
      </PageSection>
      <PageSection padding={{ default: 'noPadding' }}>
        <Tabs activeKey={activeTab} onSelect={(_e, k) => { setActiveTab(k); setPage(1); }} style={{ paddingInline: '24px' }}>
          <Tab eventKey={0} title={`Pending requests (${pending.length})`} />
          <Tab eventKey={1} title={`Approved deferrals (${approvedDeferrals.length})`} />
          <Tab eventKey={2} title={`Approved false positives (${approvedFP.length})`} />
          <Tab eventKey={3} title={`Denied requests (${denied.length})`} />
        </Tabs>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
              <SearchInput
                placeholder="Filter exceptions"
                value={searchValue}
                onChange={(_e, v) => { setSearchValue(v); setPage(1); }}
                onClear={() => { setSearchValue(''); setPage(1); }}
              />
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={filteredExceptions.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => { setPerPage(pp); setPage(1); }}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Exceptions" variant="compact">
          <Thead>
            <Tr>
              <Th>Request name</Th>
              <Th>Requester</Th>
              <Th>Scope</Th>
              <Th>Severity</Th>
              <Th>Status</Th>
              <Th>Expires</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedExceptions.map((e, i) => (
              <Tr key={i} isClickable onClick={() => setSelectedExc(e)}>
                <Td>
                  <Button variant="link" isInline onClick={(ev) => { ev.stopPropagation(); setSelectedExc(e); }}>
                    {e.name}
                  </Button>
                </Td>
                <Td>{e.requester}</Td>
                <Td>{e.scope}</Td>
                <Td>{e.severity}</Td>
                <Td><Label isCompact color={statusColors[e.status]}>{e.status}</Label></Td>
                <Td>{e.expires}</Td>
                <Td style={{ whiteSpace: 'nowrap' }}>{e.created}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>

      {selectedExc && (
        <Modal isOpen onClose={() => setSelectedExc(null)} variant="medium">
          <ModalHeader title={`Exception request: ${selectedExc.name}`} />
          <ModalBody>
            <Card isFlat style={{ marginBottom: '16px' }}>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 16px' }}>
                  <span style={{ fontWeight: 600 }}>Request name:</span><span>{selectedExc.name}</span>
                  <span style={{ fontWeight: 600 }}>Requester:</span><span>{selectedExc.requester}</span>
                  <span style={{ fontWeight: 600 }}>Status:</span><span><Label isCompact color={statusColors[selectedExc.status]}>{selectedExc.status}</Label></span>
                  <span style={{ fontWeight: 600 }}>Type:</span><span>{selectedExc.type}</span>
                  <span style={{ fontWeight: 600 }}>Scope:</span><span>{selectedExc.scope}</span>
                  <span style={{ fontWeight: 600 }}>Severity:</span><span>{selectedExc.severity}</span>
                  <span style={{ fontWeight: 600 }}>Expires:</span><span>{selectedExc.expires}</span>
                  <span style={{ fontWeight: 600 }}>Created:</span><span>{selectedExc.created}</span>
                  <span style={{ fontWeight: 600 }}>Comment:</span><span>{selectedExc.comment}</span>
                </div>
              </CardBody>
            </Card>
            <Title headingLevel="h4" style={{ marginBottom: '8px' }}>Affected CVEs</Title>
            <Flex gap={{ default: 'gapSm' }}>
              {selectedExc.cves.map((c) => (
                <FlexItem key={c}>
                  <Button variant="link" isInline onClick={() => { setSelectedExc(null); navigate(`${routes.cveDetailPath}/${c}`); }}>{c}</Button>
                </FlexItem>
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter>
            {selectedExc.status === 'Pending' && (
              <>
                <Button variant="primary" onClick={() => setSelectedExc(null)}>Approve</Button>
                <Button variant="danger" onClick={() => setSelectedExc(null)}>Deny</Button>
              </>
            )}
            <Button variant="link" onClick={() => setSelectedExc(null)}>Close</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
