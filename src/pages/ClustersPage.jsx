import { useState, useMemo } from 'react';
import {
  Alert,
  AlertActionCloseButton,
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
  Progress,
  SearchInput,
  Tab,
  Tabs,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { prefixRoutes } from '../routes';
import { CLUSTERS } from '../mockData';
import { useLiveSync } from '../api/hooks';

export default function ClustersPage({ routePrefix }) {
  const syncState = useLiveSync();
  const routes = prefixRoutes(routePrefix);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [secureAlert, setSecureAlert] = useState(false);

  const mockClusters = useMemo(() => CLUSTERS.map((c) => {
    const providerName = c.status?.providerMetadata?.cluster?.type || c.type || '';
    const region = c.status?.providerMetadata?.region || '';
    const sensorHealth = c.healthStatus?.sensorHealthStatus;
    const healthy = sensorHealth === 'HEALTHY';
    const sensorVersion = c.status?.sensorVersion || '';
    const certExpiry = c.status?.certExpiryStatus?.sensorCertExpiry;
    const credentialExpiration = certExpiry
      ? new Date(certExpiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—';
    const provider = region ? `${providerName} (${region})` : providerName;

    return {
      id: c.id,
      name: c.name,
      provider,
      providerName,
      region,
      status: healthy ? 'Healthy' : 'Degraded',
      sensorUpgrade: healthy ? 'Up to date' : 'Upgrade available',
      sensorVersion: sensorVersion || '—',
      centralVersion: '—',
      credentialExpiration,
      healthy,
      namespaces: '—',
      nodes: '—',
      deployments: '—',
    };
  }), [syncState?.version]);

  const filteredClusters = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return mockClusters;
    return mockClusters.filter((c) =>
      [c.name, c.provider, c.status, c.sensorUpgrade].some((f) => String(f).toLowerCase().includes(q))
    );
  }, [searchValue, mockClusters]);

  const paginatedClusters = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredClusters.slice(start, start + perPage);
  }, [filteredClusters, page, perPage]);

  return (
    <>
      <PageSection>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <div>
            <Title headingLevel="h1">Clusters</Title>
            <Content component="p">View the status of secured cluster services</Content>
          </div>
          <Button variant="primary" onClick={() => setSecureAlert(true)}>Secure a cluster</Button>
        </Flex>
      </PageSection>
      <Divider component="div" />

      {secureAlert && (
        <PageSection padding={{ default: 'noPadding' }} style={{ padding: '16px 24px 0' }}>
          <Alert variant="info" isInline title="To secure a new cluster, use the StackRox roxctl CLI or the operator to generate a sensor bundle and deploy it to your cluster."
            actionClose={<AlertActionCloseButton onClose={() => setSecureAlert(false)} />} />
        </PageSection>
      )}

      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
              <SearchInput placeholder="Filter clusters" value={searchValue}
                onChange={(_e, v) => { setSearchValue(v); setPage(1); }}
                onClear={() => { setSearchValue(''); setPage(1); }} />
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination itemCount={filteredClusters.length} perPage={perPage} page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => { setPerPage(pp); setPage(1); }} isCompact />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Clusters table" variant="compact">
          <Thead>
            <Tr>
              <Th>Cluster</Th>
              <Th>Provider (Region)</Th>
              <Th>Cluster status</Th>
              <Th>Sensor upgrade</Th>
              <Th>Credential expiration</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedClusters.map((c) => (
              <Tr key={c.id} isClickable onClick={() => setSelectedCluster(c)}>
                <Td><Button variant="link" isInline onClick={(e) => { e.stopPropagation(); setSelectedCluster(c); }}>{c.name}</Button></Td>
                <Td>{c.provider}</Td>
                <Td>
                  {c.healthy
                    ? <Label color="green" icon={<CheckCircleIcon />}>{c.status}</Label>
                    : <Label color="red" icon={<ExclamationCircleIcon />}>{c.status}</Label>
                  }
                </Td>
                <Td>{c.sensorUpgrade}</Td>
                <Td style={{ whiteSpace: 'nowrap' }}>{c.credentialExpiration}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>

      {selectedCluster && (
        <Modal isOpen onClose={() => setSelectedCluster(null)} variant="large">
          <ModalHeader title={`Cluster: ${selectedCluster.name}`} />
          <ModalBody>
            <Tabs defaultActiveKey={0}>
              <Tab eventKey={0} title="Overview">
                <div style={{ marginTop: '16px' }}>
                  <Card isFlat style={{ marginBottom: '16px' }}>
                    <CardBody>
                      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '8px 16px' }}>
                        <span style={{ fontWeight: 600 }}>Cluster name:</span><span>{selectedCluster.name}</span>
                        <span style={{ fontWeight: 600 }}>Provider:</span><span>{selectedCluster.providerName}</span>
                        <span style={{ fontWeight: 600 }}>Region:</span><span>{selectedCluster.region}</span>
                        <span style={{ fontWeight: 600 }}>Status:</span><span>
                          {selectedCluster.healthy
                            ? <Label color="green" icon={<CheckCircleIcon />}>{selectedCluster.status}</Label>
                            : <Label color="red" icon={<ExclamationCircleIcon />}>{selectedCluster.status}</Label>
                          }
                        </span>
                        <span style={{ fontWeight: 600 }}>Sensor version:</span><span>{selectedCluster.sensorVersion}</span>
                        <span style={{ fontWeight: 600 }}>Central version:</span><span>{selectedCluster.centralVersion}</span>
                        <span style={{ fontWeight: 600 }}>Sensor upgrade:</span><span>{selectedCluster.sensorUpgrade}</span>
                        <span style={{ fontWeight: 600 }}>Credential expiration:</span><span>{selectedCluster.credentialExpiration}</span>
                        <span style={{ fontWeight: 600 }}>Namespaces:</span><span>{selectedCluster.namespaces}</span>
                        <span style={{ fontWeight: 600 }}>Nodes:</span><span>{selectedCluster.nodes}</span>
                        <span style={{ fontWeight: 600 }}>Deployments:</span><span>{selectedCluster.deployments}</span>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>
              <Tab eventKey={1} title="Health status">
                <div style={{ marginTop: '16px' }}>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                    <FlexItem><Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}><FlexItem>Sensor</FlexItem><FlexItem><Label isCompact color="green">Healthy</Label></FlexItem></Flex></FlexItem>
                    <FlexItem><Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}><FlexItem>Collector</FlexItem><FlexItem><Label isCompact color="green">Healthy</Label></FlexItem></Flex></FlexItem>
                    <FlexItem><Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}><FlexItem>Admission control</FlexItem><FlexItem><Label isCompact color="green">Healthy</Label></FlexItem></Flex></FlexItem>
                    <FlexItem><Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}><FlexItem>Scanner</FlexItem><FlexItem><Label isCompact color="green">Healthy</Label></FlexItem></Flex></FlexItem>
                  </Flex>
                </div>
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setSelectedCluster(null)}>Manage cluster</Button>
            <Button variant="link" onClick={() => setSelectedCluster(null)}>Close</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
