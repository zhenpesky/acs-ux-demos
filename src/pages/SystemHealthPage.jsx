import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
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
  Spinner,
  Title,
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, DownloadIcon } from '@patternfly/react-icons';
import { prefixRoutes } from '../routes';
import { SYSTEM_HEALTH } from '../mockData';
import { useLiveSync } from '../api/hooks';

const clusterHealthData = SYSTEM_HEALTH.clusterHealth.map((c) => {
  const statusLabel = (s) => s === 'HEALTHY' ? 'Healthy' : s === 'DEGRADED' ? 'Degraded' : 'Unhealthy';
  return {
    name: c.name,
    collector: statusLabel(c.collectorStatus),
    sensor: statusLabel(c.sensorStatus),
    admission: statusLabel(c.admissionControlStatus),
    healthy: c.sensorStatus === 'HEALTHY',
  };
});

function HealthStatusIcon({ status }) {
  if (status === 'Healthy') return <Label isCompact color="green" icon={<CheckCircleIcon />}>{status}</Label>;
  if (status === 'Degraded') return <Label isCompact color="gold" icon={<ExclamationTriangleIcon />}>{status}</Label>;
  return <Label isCompact color="red" icon={<ExclamationCircleIcon />}>{status}</Label>;
}

export default function SystemHealthPage({ routePrefix }) {
  useLiveSync();
  const navigate = useNavigate();
  const { clustersPath } = prefixRoutes(routePrefix);
  const [diagModalOpen, setDiagModalOpen] = useState(false);
  const [diagState, setDiagState] = useState('idle');

  const handleGenerateDiagnostic = () => {
    setDiagState('generating');
    setDiagModalOpen(true);
    setTimeout(() => setDiagState('done'), 2000);
  };

  return (
    <>
      <PageSection>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <Title headingLevel="h1">System Health</Title>
          <Button variant="secondary" icon={<DownloadIcon />} onClick={handleGenerateDiagnostic}>Generate diagnostic bundle</Button>
        </Flex>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <Card>
            <CardTitle>Cluster Health</CardTitle>
            <CardBody>
              {clusterHealthData.map((c) => (
                <Flex key={c.name} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ padding: '8px 0', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                  <FlexItem><Button variant="link" isInline onClick={() => navigate(clustersPath)}>{c.name}</Button></FlexItem>
                  <Flex gap={{ default: 'gapSm' }}>
                    <HealthStatusIcon status={c.collector} />
                  </Flex>
                </Flex>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Central Database</CardTitle>
            <CardBody>
              <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <span>Database type</span><span>PostgreSQL</span>
                </Flex>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <span>Status</span><Label color="green" icon={<CheckCircleIcon />}>Active</Label>
                </Flex>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <span>Database available disk</span><span>{SYSTEM_HEALTH.centralDb.usedStorage}</span>
                </Flex>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <span>Total database disk</span><span>{SYSTEM_HEALTH.centralDb.totalStorage}</span>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Vulnerability Definitions</CardTitle>
            <CardBody>
              <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <span>Scanner</span><Label color="green" icon={<CheckCircleIcon />}>Up to date</Label>
                </Flex>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <span>Last updated</span><span>Mar 30, 2026, 2:00 AM</span>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Integration Health</CardTitle>
            <CardBody>
              <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <span>Image integrations</span><Label color="green" icon={<CheckCircleIcon />}>{SYSTEM_HEALTH.integrationHealth.imageIntegrations} healthy</Label>
                </Flex>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <span>Notifier integrations</span><Label color="green" icon={<CheckCircleIcon />}>{SYSTEM_HEALTH.integrationHealth.notifiers} healthy</Label>
                </Flex>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                  <span>Backup integrations</span><Label color="green" icon={<CheckCircleIcon />}>{SYSTEM_HEALTH.integrationHealth.backupIntegrations} healthy</Label>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        </div>
      </PageSection>

      <Modal
        isOpen={diagModalOpen}
        onClose={() => { setDiagModalOpen(false); setDiagState('idle'); }}
        variant="small"
      >
        <ModalHeader title="Generate diagnostic bundle" />
        <ModalBody>
          {diagState === 'generating' && (
            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} style={{ padding: '24px' }}>
              <Spinner size="lg" />
              <Content component="p">Generating diagnostic data from all clusters...</Content>
            </Flex>
          )}
          {diagState === 'done' && (
            <Alert variant="success" isInline title="Diagnostic bundle generated successfully">
              The diagnostic bundle has been generated and is ready for download. Bundle contains system logs, cluster status, and configuration data.
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          {diagState === 'done' && (
            <Button variant="primary" onClick={() => { setDiagModalOpen(false); setDiagState('idle'); }}>
              Download bundle
            </Button>
          )}
          <Button variant="link" onClick={() => { setDiagModalOpen(false); setDiagState('idle'); }}>
            {diagState === 'generating' ? 'Cancel' : 'Close'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
