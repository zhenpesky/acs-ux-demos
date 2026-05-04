import { useState } from 'react';
import {
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
  Title,
} from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import { prefixRoutes } from '../routes';
import { CONFIG_MANAGEMENT, VIOLATION_SEVERITY, DEPLOYMENTS } from '../mockData';
import { useLiveSync } from '../api/hooks';

const policyViolations = {
  critical: VIOLATION_SEVERITY.critical,
  high: VIOLATION_SEVERITY.high,
  medium: VIOLATION_SEVERITY.medium,
  low: VIOLATION_SEVERITY.low,
};
const severityBarColors = { critical: 'var(--pf-t--global--color--status--danger--default)', high: 'var(--pf-t--global--color--status--warning--default)', medium: 'var(--pf-t--global--color--status--warning--default)', low: 'var(--pf-t--global--color--status--success--default)' };

const topSecretsByDeployment = CONFIG_MANAGEMENT.topSecrets.map((s) => ({
  deployment: s.deployment,
  namespace: 'default',
  secrets: s.secrets,
}));

const topClusterAdmins = CONFIG_MANAGEMENT.topClusterAdmins;

export default function ConfigManagementPage({ routePrefix = '/v1' }) {
  useLiveSync();
  const navigate = useNavigate();
  const routes = prefixRoutes(routePrefix);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Configuration Management</Title>
        <Content component="p">Analyze and manage Kubernetes configurations</Content>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <Card>
            <CardTitle>Policy violations by severity</CardTitle>
            <CardBody>
              <Flex gap={{ default: 'gapSm' }} style={{ marginBottom: '16px' }}>
                {Object.entries(policyViolations).map(([key, val]) => (
                  <FlexItem key={key} style={{ flex: 1 }}>
                    <Button variant="plain" style={{ padding: 0, width: '100%' }} onClick={() => navigate(routes.violationsPath)}>
                      <div style={{
                        backgroundColor: severityBarColors[key], borderRadius: '4px',
                        padding: '6px 8px', textAlign: 'center', color: 'var(--pf-t--global--text--color--on-brand--default)', fontWeight: 'bold', fontSize: '16px',
                      }}>
                        {val.toLocaleString()}
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px', textTransform: 'capitalize' }}>{key}</div>
                    </Button>
                  </FlexItem>
                ))}
              </Flex>
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Users with most cluster admin roles</CardTitle>
            <CardBody>
              {topClusterAdmins.map((u, i) => (
                <Flex key={i} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ padding: '8px 0', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                  <FlexItem><Button variant="link" isInline onClick={() => setSelectedUser(u)}>{u.user}</Button></FlexItem>
                  <FlexItem>{u.cluster}</FlexItem>
                  <FlexItem><Label isCompact>{u.roles} roles</Label></FlexItem>
                </Flex>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Secrets most used across deployments</CardTitle>
            <CardBody>
              {topSecretsByDeployment.map((d, i) => {
                const dep = DEPLOYMENTS.find((dd) => dd.name === d.deployment);
                return (
                  <Flex key={i} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ padding: '8px 0', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                    <FlexItem><Button variant="link" isInline onClick={() => navigate(`${routes.deploymentDetailPath}/${dep ? dep.id : d.deployment}`)}>{d.deployment}</Button></FlexItem>
                    <FlexItem>{d.namespace}</FlexItem>
                    <FlexItem><Label isCompact color="blue">{d.secrets} secrets</Label></FlexItem>
                  </Flex>
                );
              })}
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Compliance by controls</CardTitle>
            <CardBody>
              <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                {CONFIG_MANAGEMENT.complianceByControls.map((c) => ({ standard: c.standard, passing: c.percentage, total: 100 })).map((s) => (
                  <Button key={s.standard} variant="plain" style={{ padding: 0, textAlign: 'left' }} onClick={() => navigate(routes.complianceCoveragePath)}>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem style={{ flex: 1 }}><span style={{ fontSize: '14px' }}>{s.standard}</span></FlexItem>
                      <FlexItem>
                        <div style={{ width: '120px', height: '8px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${s.passing}%`, height: '100%', backgroundColor: s.passing >= 75 ? 'var(--pf-t--global--color--status--success--default)' : s.passing >= 60 ? 'var(--pf-t--global--color--status--warning--default)' : 'var(--pf-t--global--color--status--danger--default)', borderRadius: '4px' }} />
                        </div>
                      </FlexItem>
                      <FlexItem style={{ minWidth: '40px', textAlign: 'right' }}><span style={{ fontSize: '14px', fontWeight: 600 }}>{s.passing}%</span></FlexItem>
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </CardBody>
          </Card>
        </div>
      </PageSection>

      {selectedUser && (
        <Modal isOpen onClose={() => setSelectedUser(null)} variant="medium">
          <ModalHeader title={`User: ${selectedUser.user}`} />
          <ModalBody>
            <Card isFlat>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 16px' }}>
                  <span style={{ fontWeight: 600 }}>Username:</span><span>{selectedUser.user}</span>
                  <span style={{ fontWeight: 600 }}>Cluster:</span><span>{selectedUser.cluster}</span>
                  <span style={{ fontWeight: 600 }}>Admin roles:</span><span>{selectedUser.roles}</span>
                  <span style={{ fontWeight: 600 }}>Type:</span><span>ServiceAccount</span>
                  <span style={{ fontWeight: 600 }}>Namespace:</span><span>kube-system</span>
                </div>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button variant="link" onClick={() => setSelectedUser(null)}>Close</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
