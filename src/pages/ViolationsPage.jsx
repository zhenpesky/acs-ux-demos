import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Content,
  Divider,
  Label,
  MenuToggle,
  PageSection,
  Pagination,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Tab,
  Tabs,
  TabTitleText,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';

import { prefixRoutes } from '../routes';
import { VIOLATIONS, DEPLOYMENTS } from '../mockData';
import { useLiveSync } from '../api/hooks';

const severityColors = { Critical: 'red', High: 'orange', Medium: 'gold', Low: 'blue' };

const TOP_TAB_CONFIG = {
  'user-workloads': {
    entityTypes: ['Deployment'],
    title: 'User workload violations',
    description: 'Build/Deploy-stage violations for workloads currently in violation, along with unresolved Runtime violations',
  },
  platform: {
    entityTypes: ['Platform'],
    title: 'Platform violations',
    description: 'Violations detected in platform-level components and infrastructure services',
  },
  nodes: {
    entityTypes: ['Node'],
    title: 'Node violations',
    description: 'Violations detected on cluster nodes including kernel CVEs and CIS benchmarks',
  },
  'all-violations': {
    entityTypes: null,
    title: 'All violations',
    description: 'All policy violations across user workloads, platform, and nodes',
  },
};

export default function ViolationsPage({ routePrefix }) {
  const syncState = useLiveSync();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);
  const [topTab, setTopTab] = useState('user-workloads');
  const [stateTab, setStateTab] = useState('Active');
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filterFieldOpen, setFilterFieldOpen] = useState(false);
  const [filterField, setFilterField] = useState('Policy');

  const allViolations = useMemo(() => VIOLATIONS.map((v) => ({
    id: v.id,
    policy: v.policy,
    entity: v.entity,
    type: v.entityType,
    enforced: v.enforced,
    severity: v.severity,
    categories: v.categories || [],
    lifecycle: (v.lifecycle || 'DEPLOY').toUpperCase(),
    state: v.state || 'Active',
    time: new Date(v.time).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
  })), [syncState?.version]);

  const topTabConfig = TOP_TAB_CONFIG[topTab];

  const entityFiltered = useMemo(() => {
    if (!topTabConfig.entityTypes) return allViolations;
    return allViolations.filter((v) => topTabConfig.entityTypes.includes(v.type));
  }, [allViolations, topTab]);

  const activeCount = useMemo(() => entityFiltered.filter((v) => v.state === 'Active').length, [entityFiltered]);
  const resolvedCount = useMemo(() => entityFiltered.filter((v) => v.state === 'Resolved').length, [entityFiltered]);
  const attemptedCount = useMemo(() => entityFiltered.filter((v) => v.state === 'Attempted').length, [entityFiltered]);

  const stateFiltered = useMemo(() =>
    entityFiltered.filter((v) => v.state === stateTab),
    [entityFiltered, stateTab]
  );

  const filteredViolations = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return stateFiltered;
    return stateFiltered.filter((v) => {
      const fieldValue = filterField === 'Policy' ? v.policy : v.entity;
      return String(fieldValue).toLowerCase().includes(q);
    });
  }, [stateFiltered, searchValue, filterField]);

  const paginatedViolations = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredViolations.slice(start, start + perPage);
  }, [filteredViolations, page, perPage]);

  return (
    <>
      <PageSection padding={{ default: 'noPadding' }} style={{ paddingInline: '24px' }}>
        <Tabs
          activeKey={topTab}
          onSelect={(_e, k) => { setTopTab(k); setStateTab('Active'); setSearchValue(''); setPage(1); }}
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
        <Title headingLevel="h1">{topTabConfig.title}</Title>
      </PageSection>

      <PageSection padding={{ default: 'noPadding' }}>
        <Tabs activeKey={stateTab} onSelect={(_e, k) => { setStateTab(k); setPage(1); }} style={{ paddingInline: '24px' }}>
          <Tab eventKey="Active" title={<TabTitleText>Active</TabTitleText>} />
          <Tab eventKey="Resolved" title={<TabTitleText>Resolved</TabTitleText>} />
          <Tab eventKey="Attempted" title={<TabTitleText>Attempted</TabTitleText>} />
        </Tabs>
      </PageSection>

      <PageSection>
        <Content component="p" style={{ marginBottom: '16px' }}>{topTabConfig.description}</Content>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Select
                isOpen={filterFieldOpen}
                onOpenChange={setFilterFieldOpen}
                selected={filterField}
                onSelect={(_e, val) => { setFilterField(val); setFilterFieldOpen(false); }}
                toggle={(ref) => (
                  <MenuToggle ref={ref} onClick={() => setFilterFieldOpen(!filterFieldOpen)} isExpanded={filterFieldOpen} style={{ minWidth: '100px' }}>
                    {filterField}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="Policy">Policy</SelectOption>
                  <SelectOption value="Name">Name</SelectOption>
                </SelectList>
              </Select>
            </ToolbarItem>
            <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
              <SearchInput
                placeholder={`Filter results by ${filterField} name`}
                value={searchValue}
                onChange={(_e, v) => { setSearchValue(v); setPage(1); }}
                onClear={() => { setSearchValue(''); setPage(1); }}
              />
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={filteredViolations.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => { setPerPage(pp); setPage(1); }}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Violations table" variant="compact">
          <Thead>
            <Tr>
              <Th>Policy</Th>
              <Th>Entity</Th>
              <Th>Type</Th>
              <Th>Enforced</Th>
              <Th>Severity</Th>
              <Th>Categories</Th>
              <Th>Lifecycle</Th>
              <Th>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedViolations.map((v) => (
              <Tr key={v.id} isClickable onClick={() => navigate(`${routes.violationsPath}/${v.id}`)}>
                <Td><Button variant="link" isInline onClick={(e) => { e.stopPropagation(); navigate(`${routes.violationsPath}/${v.id}`); }}>{v.policy}</Button></Td>
                <Td><Button variant="link" isInline onClick={(e) => {
                  e.stopPropagation();
                  if (v.type === 'Deployment') {
                    const dep = DEPLOYMENTS.find((d) => d.name === v.entity);
                    navigate(`${routes.deploymentDetailPath}/${dep ? dep.id : v.entity}`);
                  } else {
                    navigate(`${routes.violationsPath}/${v.id}`);
                  }
                }}>{v.entity}</Button></Td>
                <Td>{v.type}</Td>
                <Td>{v.enforced ? 'Yes' : 'No'}</Td>
                <Td><Label color={severityColors[v.severity]}>{v.severity}</Label></Td>
                <Td>{v.categories.join(', ')}</Td>
                <Td>{v.lifecycle}</Td>
                <Td style={{ whiteSpace: 'nowrap' }}>{v.time}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
}
