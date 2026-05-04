import { useState } from 'react';
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
  Progress,
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { COMPLIANCE_PROFILES, COMPLIANCE_CHECKS } from '../mockData';
import { useLiveSync } from '../api/hooks';

const profiles = COMPLIANCE_PROFILES.map((p) => ({
  name: p.name,
  checks: p.totalChecks,
  passing: p.passing,
  failing: p.failing,
  manual: p.manual,
  other: p.other,
  compliance: p.compliance,
}));

const checks = COMPLIANCE_CHECKS.map((c) => ({
  check: `${c.control} - ${c.description}`,
  controls: c.control,
  description: c.description,
  pass: c.status === 'Pass' ? 5 : c.status === 'Manual' ? 0 : (c.status === 'Fail' ? 4 : 3),
  fail: c.status === 'Fail' ? 1 : 0,
  manual: c.status === 'Manual' ? 5 : 0,
  other: 0,
  compliance: c.status === 'Pass' ? 100 : c.status === 'Manual' ? 0 : 80,
  status: c.status,
  clusters: ['production-secured-cluster', 'staging-secured-cluster', 'dev-secured-cluster'],
}));

export default function ComplianceCoveragePage({ routePrefix }) {
  useLiveSync();
  const [selectedProfile, setSelectedProfile] = useState('ocp4-cis');
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const profile = profiles.find(p => p.name === selectedProfile) || profiles[0];

  const paginatedChecks = checks.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Compliance coverage</Title>
        <Content component="p">View compliance status across your clusters and standards</Content>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <ToggleGroup aria-label="Compliance profiles">
          {profiles.map(p => (
            <ToggleGroupItem key={p.name} text={p.name} isSelected={selectedProfile === p.name} onChange={() => { setSelectedProfile(p.name); setPage(1); }} />
          ))}
        </ToggleGroup>
      </PageSection>
      <PageSection>
        <Card>
          <CardBody>
            <Flex gap={{ default: 'gapLg' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem style={{ minWidth: '200px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>{profile.name}</div>
                <Progress value={profile.compliance} title="Compliance" measureLocation="outside" variant={profile.compliance >= 80 ? 'success' : profile.compliance >= 60 ? 'warning' : 'danger'} />
              </FlexItem>
              <FlexItem><Label color="green">{profile.passing} Passing</Label></FlexItem>
              <FlexItem><Label color="red">{profile.failing} Failing</Label></FlexItem>
              <FlexItem><Label color="blue">{profile.manual} Manual</Label></FlexItem>
              <FlexItem><Label color="grey">{profile.other} Other</Label></FlexItem>
              <FlexItem><span style={{ fontSize: '14px' }}>{profile.checks} checks total</span></FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </PageSection>
      <PageSection>
        <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} style={{ marginBottom: '8px' }}>
          <FlexItem>
            <Pagination itemCount={checks.length} perPage={perPage} page={page}
              onSetPage={(_e, p) => setPage(p)} isCompact />
          </FlexItem>
        </Flex>
        <Table aria-label="Compliance checks" variant="compact">
          <Thead>
            <Tr>
              <Th>Check</Th>
              <Th>Controls</Th>
              <Th>Pass</Th>
              <Th>Fail</Th>
              <Th>Manual</Th>
              <Th>Other</Th>
              <Th>Compliance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedChecks.map((c, i) => (
              <Tr key={i} isClickable onClick={() => setSelectedCheck(c)}>
                <Td><Button variant="link" isInline onClick={(e) => { e.stopPropagation(); setSelectedCheck(c); }}>{c.check}</Button></Td>
                <Td>{c.controls}</Td>
                <Td><Label isCompact color="green">{c.pass}</Label></Td>
                <Td><Label isCompact color="red">{c.fail}</Label></Td>
                <Td><Label isCompact color="blue">{c.manual}</Label></Td>
                <Td>{c.other}</Td>
                <Td>
                  <Progress value={c.compliance} size="sm" measureLocation="outside" variant={c.compliance >= 80 ? 'success' : c.compliance >= 60 ? 'warning' : 'danger'} style={{ minWidth: '80px' }} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>

      {selectedCheck && (
        <Modal isOpen onClose={() => setSelectedCheck(null)} variant="medium">
          <ModalHeader title={selectedCheck.check} />
          <ModalBody>
            <Card isFlat style={{ marginBottom: '16px' }}>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 16px' }}>
                  <span style={{ fontWeight: 600 }}>Control:</span><span>{selectedCheck.controls}</span>
                  <span style={{ fontWeight: 600 }}>Description:</span><span>{selectedCheck.description}</span>
                  <span style={{ fontWeight: 600 }}>Status:</span><span><Label isCompact color={selectedCheck.status === 'Pass' ? 'green' : selectedCheck.status === 'Fail' ? 'red' : 'blue'}>{selectedCheck.status}</Label></span>
                  <span style={{ fontWeight: 600 }}>Compliance:</span><span>{selectedCheck.compliance}%</span>
                  <span style={{ fontWeight: 600 }}>Pass:</span><span>{selectedCheck.pass} cluster(s)</span>
                  <span style={{ fontWeight: 600 }}>Fail:</span><span>{selectedCheck.fail} cluster(s)</span>
                  <span style={{ fontWeight: 600 }}>Manual:</span><span>{selectedCheck.manual} cluster(s)</span>
                </div>
              </CardBody>
            </Card>
            <Title headingLevel="h4" style={{ marginBottom: '8px' }}>Cluster results</Title>
            <Table aria-label="Cluster compliance results" variant="compact">
              <Thead>
                <Tr>
                  <Th>Cluster</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {selectedCheck.clusters.map((cl, i) => (
                  <Tr key={cl}>
                    <Td>{cl}</Td>
                    <Td><Label isCompact color={i === 0 && selectedCheck.status === 'Fail' ? 'red' : 'green'}>{i === 0 && selectedCheck.status === 'Fail' ? 'Fail' : 'Pass'}</Label></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button variant="link" onClick={() => setSelectedCheck(null)}>Close</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
