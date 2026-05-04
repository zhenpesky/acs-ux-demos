import { useState } from 'react';
import {
  Button,
  Content,
  Divider,
  Flex,
  Form,
  FormGroup,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Select,
  SelectList,
  SelectOption,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { CLUSTERS, NETWORK_NAMESPACES } from '../mockData';
import { useLiveSync } from '../api/hooks';

export default function NetworkGraphPage() {
  useLiveSync();
  const [cluster, setCluster] = useState(CLUSTERS[0]?.name || '');
  const [isClusterOpen, setIsClusterOpen] = useState(false);
  const [cidrModalOpen, setCidrModalOpen] = useState(false);
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [cidrName, setCidrName] = useState('');
  const [cidrBlock, setCidrBlock] = useState('');

  return (
    <>
      <PageSection>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <Title headingLevel="h1">Network Graph</Title>
          <Flex gap={{ default: 'gapSm' }}>
            <Button variant="secondary" onClick={() => setCidrModalOpen(true)}>Manage CIDR blocks</Button>
            <Button variant="primary" onClick={() => setSimModalOpen(true)}>Simulate network policy</Button>
          </Flex>
        </Flex>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Select
                isOpen={isClusterOpen}
                onOpenChange={setIsClusterOpen}
                selected={cluster}
                onSelect={(_e, val) => { setCluster(val); setIsClusterOpen(false); }}
                toggle={(ref) => (
                  <MenuToggle ref={ref} onClick={() => setIsClusterOpen(!isClusterOpen)} isExpanded={isClusterOpen} style={{ minWidth: '240px' }}>
                    {cluster}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {CLUSTERS.map((c) => (
                    <SelectOption key={c.id} value={c.name}>{c.name}</SelectOption>
                  ))}
                </SelectList>
              </Select>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection isFilled style={{ backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', minHeight: '500px' }}>
        <div style={{
          height: '100%',
          minHeight: '400px',
          border: '1px solid var(--pf-t--global--border--color--default)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          color: 'var(--pf-t--global--text--color--regular)',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {NETWORK_NAMESPACES.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {row.map((ns) => (
                <div key={ns} style={{
                  width: '120px', height: '80px', border: `1px solid ${rowIdx === 0 ? 'var(--pf-t--global--color--status--info--default)' : 'var(--pf-t--global--color--status--success--default)'}`, borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', textAlign: 'center', padding: '8px', backgroundColor: rowIdx === 0 ? 'var(--pf-t--global--background--color--status--info--default)' : 'var(--pf-t--global--background--color--status--success--default)',
                }}>
                  {ns}
                </div>
              ))}
            </div>
          ))}
          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '16px' }}>
            Network flow visualization &bull; {NETWORK_NAMESPACES.flat().length} namespaces &bull; 42 deployments &bull; 156 active connections
          </div>
        </div>
      </PageSection>

      <Modal isOpen={cidrModalOpen} onClose={() => setCidrModalOpen(false)} variant="medium">
        <ModalHeader title="Manage CIDR blocks" />
        <ModalBody>
          <Content component="p" style={{ marginBottom: 16 }}>
            CIDR blocks allow you to label IP address ranges in the network graph for easier identification.
          </Content>
          <div style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>CIDR block</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                  <td style={{ padding: '8px' }}>Internal Services</td>
                  <td style={{ padding: '8px' }}>10.0.0.0/8</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                  <td style={{ padding: '8px' }}>External Traffic</td>
                  <td style={{ padding: '8px' }}>0.0.0.0/0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Form>
            <Flex gap={{ default: 'gapMd' }}>
              <FormGroup label="Name" fieldId="cidr-name" style={{ flex: 1 }}>
                <TextInput id="cidr-name" value={cidrName} onChange={(_e, v) => setCidrName(v)} placeholder="e.g. Database subnet" />
              </FormGroup>
              <FormGroup label="CIDR block" fieldId="cidr-block" style={{ flex: 1 }}>
                <TextInput id="cidr-block" value={cidrBlock} onChange={(_e, v) => setCidrBlock(v)} placeholder="e.g. 192.168.1.0/24" />
              </FormGroup>
            </Flex>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => { setCidrModalOpen(false); setCidrName(''); setCidrBlock(''); }} isDisabled={!cidrName.trim() || !cidrBlock.trim()}>Add CIDR block</Button>
          <Button variant="link" onClick={() => setCidrModalOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={simModalOpen} onClose={() => setSimModalOpen(false)} variant="medium">
        <ModalHeader title="Simulate network policy" />
        <ModalBody>
          <Content component="p" style={{ marginBottom: 16 }}>
            Upload or paste a network policy YAML to simulate its effect on the network graph.
          </Content>
          <Form>
            <FormGroup label="Network policy YAML" fieldId="policy-yaml">
              <textarea
                id="policy-yaml"
                rows={12}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: 13,
                  padding: 12,
                  border: '1px solid var(--pf-t--global--border--color--default)',
                  borderRadius: 6,
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                }}
                placeholder={`apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: deny-all\n  namespace: default\nspec:\n  podSelector: {}\n  policyTypes:\n    - Ingress\n    - Egress`}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setSimModalOpen(false)}>Simulate</Button>
          <Button variant="secondary" onClick={() => setSimModalOpen(false)}>Upload YAML</Button>
          <Button variant="link" onClick={() => setSimModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
