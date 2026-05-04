import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertActionCloseButton,
  Button,
  Content,
  Divider,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Pagination,
  Select,
  SelectList,
  SelectOption,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { prefixRoutes } from '../routes';
import { COMPLIANCE_SCHEDULES, CLUSTERS } from '../mockData';
import { useLiveSync } from '../api/hooks';

const mockSchedules = COMPLIANCE_SCHEDULES.map((s) => ({
  name: s.name,
  schedule: s.schedule,
  lastScanned: new Date(s.lastScanned).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
  clusters: s.clusters,
  profiles: s.profiles,
}));

export default function ComplianceSchedulesPage({ routePrefix }) {
  useLiveSync();
  const navigate = useNavigate();
  const { complianceCoveragePath } = prefixRoutes(routePrefix);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleFreq, setScheduleFreq] = useState('Weekly');
  const [freqOpen, setFreqOpen] = useState(false);
  const [clusterSel, setClusterSel] = useState(CLUSTERS[0]?.name || '');
  const [clusterOpen, setClusterOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const paginatedSchedules = useMemo(() => {
    const start = (page - 1) * perPage;
    return mockSchedules.slice(start, start + perPage);
  }, [page, perPage]);

  const handleCreate = () => {
    setCreateModalOpen(false);
    setSuccessAlert(true);
    setScheduleName('');
    setTimeout(() => setSuccessAlert(false), 4000);
  };

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Compliance - Schedules</Title>
        <Content component="p">Configure compliance scan schedules</Content>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <Alert variant="info" isInline title="Compliance Operator v1.6+ required" component="p">
          Schedule-based compliance scanning requires the Compliance Operator v1.6 or later to be installed on your clusters.
        </Alert>
      </PageSection>
      <PageSection>
        {successAlert && (
          <Alert variant="success" isInline title="Scan schedule created successfully" style={{ marginBottom: 16 }}
            actionClose={<AlertActionCloseButton onClose={() => setSuccessAlert(false)} />}
          />
        )}
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Button variant="primary" onClick={() => setCreateModalOpen(true)}>Create scan schedule</Button>
            </ToolbarItem>
            <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={COMPLIANCE_SCHEDULES.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => { setPerPage(pp); setPage(1); }}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Scan schedules" variant="compact">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Schedule</Th>
              <Th>Last scanned</Th>
              <Th>Clusters</Th>
              <Th>Profiles</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedSchedules.map((s, i) => (
              <Tr key={i}>
                <Td>
                  <Button variant="link" isInline onClick={() => navigate(complianceCoveragePath)}>
                    {s.name}
                  </Button>
                </Td>
                <Td>{s.schedule}</Td>
                <Td style={{ whiteSpace: 'nowrap' }}>{s.lastScanned}</Td>
                <Td>{s.clusters}</Td>
                <Td>{s.profiles}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} variant="medium">
        <ModalHeader title="Create scan schedule" />
        <ModalBody>
          <Form>
            <FormGroup label="Name" isRequired fieldId="schedule-name">
              <TextInput id="schedule-name" value={scheduleName} onChange={(_e, v) => setScheduleName(v)} placeholder="Enter schedule name" />
            </FormGroup>
            <FormGroup label="Frequency" fieldId="schedule-freq">
              <Select
                isOpen={freqOpen}
                onOpenChange={setFreqOpen}
                selected={scheduleFreq}
                onSelect={(_e, val) => { setScheduleFreq(val); setFreqOpen(false); }}
                toggle={(ref) => (
                  <MenuToggle ref={ref} onClick={() => setFreqOpen(!freqOpen)} isExpanded={freqOpen} style={{ minWidth: 200 }}>
                    {scheduleFreq}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="Daily">Daily</SelectOption>
                  <SelectOption value="Weekly">Weekly</SelectOption>
                  <SelectOption value="Monthly">Monthly</SelectOption>
                </SelectList>
              </Select>
            </FormGroup>
            <FormGroup label="Cluster" fieldId="schedule-cluster">
              <Select
                isOpen={clusterOpen}
                onOpenChange={setClusterOpen}
                selected={clusterSel}
                onSelect={(_e, val) => { setClusterSel(val); setClusterOpen(false); }}
                toggle={(ref) => (
                  <MenuToggle ref={ref} onClick={() => setClusterOpen(!clusterOpen)} isExpanded={clusterOpen} style={{ minWidth: 200 }}>
                    {clusterSel}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {CLUSTERS.map((c) => (
                    <SelectOption key={c.id} value={c.name}>{c.name}</SelectOption>
                  ))}
                </SelectList>
              </Select>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleCreate} isDisabled={!scheduleName.trim()}>Create</Button>
          <Button variant="link" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
