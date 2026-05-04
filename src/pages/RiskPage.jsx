import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Content,
  Divider,
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
import { DEPLOYMENTS, SUMMARY_COUNTS } from '../mockData';
import { useLiveSync } from '../api/hooks';

export default function RiskPage({ routePrefix }) {
  useLiveSync();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const mockDeployments = DEPLOYMENTS.map((d) => ({
    id: d.id,
    name: d.name,
    created: new Date(d.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    cluster: d.clusterName,
    namespace: d.namespace,
    priority: d.priority || '—',
  }));

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Risk</Title>
        <Content component="p">View deployment risk scores and indicators</Content>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
              <SearchInput placeholder="Filter deployments" value={searchValue} onChange={(_e, v) => setSearchValue(v)} onClear={() => setSearchValue('')} />
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={SUMMARY_COUNTS.deploymentCount}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => setPerPage(pp)}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Risk table" variant="compact">
          <Thead>
            <Tr>
              <Th sort={{ sortBy: { index: 4, direction: 'asc' }, onSort: () => {}, columnIndex: 4 }}>Name</Th>
              <Th>Created</Th>
              <Th>Cluster</Th>
              <Th>Namespace</Th>
              <Th>Priority</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mockDeployments.map((d, i) => (
              <Tr key={i}>
                <Td><Button variant="link" isInline onClick={() => navigate(`${routes.deploymentDetailPath}/${d.id}`)}>{d.name}</Button></Td>
                <Td style={{ whiteSpace: 'nowrap' }}>{d.created}</Td>
                <Td>{d.cluster}</Td>
                <Td>{d.namespace}</Td>
                <Td>{d.priority}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
}
