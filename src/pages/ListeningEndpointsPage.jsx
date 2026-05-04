import { useMemo, useState } from 'react';
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
import { LISTENING_ENDPOINTS, DEPLOYMENTS } from '../mockData';
import { useLiveSync } from '../api/hooks';

const mockEndpoints = LISTENING_ENDPOINTS;

export default function ListeningEndpointsPage({ routePrefix }) {
  useLiveSync();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filteredEndpoints = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return mockEndpoints;
    return mockEndpoints.filter((ep) =>
      [ep.deployment, ep.namespace, ep.cluster, String(ep.port), ep.protocol, ep.exposure].some((field) =>
        String(field).toLowerCase().includes(q)
      )
    );
  }, [searchValue]);

  const paginatedEndpoints = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredEndpoints.slice(start, start + perPage);
  }, [filteredEndpoints, page, perPage]);

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Listening Endpoints</Title>
        <Content component="p">View listening endpoints and their deployment associations</Content>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
              <SearchInput
                placeholder="Filter endpoints"
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
                itemCount={filteredEndpoints.length}
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
        <Table aria-label="Listening endpoints" variant="compact">
          <Thead>
            <Tr>
              <Th>Deployment</Th>
              <Th>Namespace</Th>
              <Th>Cluster</Th>
              <Th>Port</Th>
              <Th>Protocol</Th>
              <Th>Exposure</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedEndpoints.map((ep, i) => (
              <Tr key={i}>
                <Td>
                  <Button variant="link" isInline onClick={() => {
                    const dep = DEPLOYMENTS.find((d) => d.name === ep.deployment);
                    navigate(`${routes.deploymentDetailPath}/${dep ? dep.id : ep.deployment}`);
                  }}>
                    {ep.deployment}
                  </Button>
                </Td>
                <Td>{ep.namespace}</Td>
                <Td>
                  <Button variant="link" isInline onClick={() => navigate(routes.clustersPath)}>
                    {ep.cluster}
                  </Button>
                </Td>
                <Td>{ep.port}</Td>
                <Td>{ep.protocol}</Td>
                <Td>{ep.exposure}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
}
