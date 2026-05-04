import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Content,
  Divider,
  Label,
  PageSection,
  Pagination,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { prefixRoutes } from '../routes';
import { ADMIN_EVENTS } from '../mockData';
import { useLiveSync } from '../api/hooks';

const mockEvents = ADMIN_EVENTS.map((e) => ({
  domain: e.domain,
  type: e.type,
  resource: e.resource,
  level: e.level.toUpperCase(),
  lastOccurred: new Date(e.lastOccurred).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
  count: e.count,
}));

const levelColors = { INFO: 'blue', WARNING: 'gold', ERROR: 'red' };

function routeForResource(domain, routes) {
  switch (domain) {
    case 'Image Scanning':
      return routes.vulnerabilitiesUserWorkloadsPath;
    case 'Compliance':
      return routes.complianceCoveragePath;
    case 'Authentication':
      return routes.accessControlPath;
    case 'Notifier':
      return routes.integrationsPath;
    case 'Cluster':
      return routes.clustersPath;
    case 'Policy':
      return routes.policiesPath;
    case 'API Token':
      return routes.accessControlPath;
    default:
      return routes.dashboardPath;
  }
}

export default function AdministrationEventsPage({ routePrefix = '/v1' }) {
  useLiveSync();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filteredEvents = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return mockEvents;
    return mockEvents.filter((e) =>
      [e.domain, e.type, e.resource, e.level, String(e.count), e.lastOccurred].some((field) =>
        String(field).toLowerCase().includes(q)
      )
    );
  }, [searchValue]);

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredEvents.slice(start, start + perPage);
  }, [filteredEvents, page, perPage]);

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Administration Events</Title>
        <Content component="p">View administrative events and audit logs</Content>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
              <SearchInput
                placeholder="Filter events"
                value={searchValue}
                onChange={(_e, v) => {
                  setSearchValue(v);
                  setPage(1);
                }}
                onClear={() => {
                  setSearchValue('');
                  setPage(1);
                }}
              />
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={filteredEvents.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => {
                  setPerPage(pp);
                  setPage(1);
                }}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Administration events" variant="compact">
          <Thead>
            <Tr>
              <Th>Domain</Th>
              <Th>Type</Th>
              <Th>Resource</Th>
              <Th>Level</Th>
              <Th>Last occurred</Th>
              <Th>Count</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedEvents.map((e, i) => (
              <Tr key={i}>
                <Td>{e.domain}</Td>
                <Td>{e.type}</Td>
                <Td>
                  <Button variant="link" isInline onClick={() => navigate(routeForResource(e.domain, routes))}>
                    {e.resource}
                  </Button>
                </Td>
                <Td><Label isCompact color={levelColors[e.level]}>{e.level}</Label></Td>
                <Td style={{ whiteSpace: 'nowrap' }}>{e.lastOccurred}</Td>
                <Td>{e.count}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
}
