import { useState, useEffect, useSyncExternalStore, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  ContentVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  SearchInput,
  Tabs,
  Tab,
  TabTitleText,
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateActions,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Select,
  SelectOption,
  SelectList,
  Checkbox,
  Label,
  Alert,
  AlertActionCloseButton,
  Pagination,
  Spinner,
  Flex,
  FlexItem,
  Switch,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import {
  EllipsisVIcon,
  ArrowRightIcon,
  FileAltIcon,
  FilterIcon,
} from '@patternfly/react-icons';
import { v3Routes } from '../../routes';
import { getReports, subscribe, getVersion, deleteReport, getDeletedIds, MOCK_REPORT_CONFIGURATIONS } from '../../api/reportStore';
import { useReportConfigurations } from '../../api/hooks';

const JOB_STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'error', label: 'Error' },
];

function ViewBasedReportsTab({ liveConfigs, configsLoading }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusOpen, setStatusOpen] = useState(false);
  const [viewOnlyMyJobs, setViewOnlyMyJobs] = useState(false);
  const [vbPage, setVbPage] = useState(1);
  const [vbPerPage, setVbPerPage] = useState(10);

  const reportJobs = useMemo(() => {
    const configs = liveConfigs || [];
    return configs.map((rc, idx) => {
      const completedDate = new Date();
      completedDate.setDate(completedDate.getDate() - idx);
      completedDate.setHours(8 + (idx % 12), (idx * 17) % 60, 0);
      return {
        id: `job-${rc.id}`,
        reportConfigName: rc.name,
        reportConfigId: rc.id,
        status: idx % 7 === 0 ? 'preparing' : idx % 11 === 0 ? 'waiting' : 'completed',
        completedAt: completedDate.toISOString(),
        requestedBy: rc.notifiers?.length > 0 ? (rc.notifiers[0]?.emailConfig?.mailingLists?.[0] || 'system') : 'system',
        isDownloadAvailable: idx % 7 !== 0,
      };
    });
  }, [liveConfigs]);

  const filtered = useMemo(() => {
    let jobs = reportJobs;
    if (statusFilter !== 'all') {
      jobs = jobs.filter((j) => j.status === statusFilter);
    }
    return jobs;
  }, [reportJobs, statusFilter]);

  const paginated = useMemo(() => {
    const start = (vbPage - 1) * vbPerPage;
    return filtered.slice(start, start + vbPerPage);
  }, [filtered, vbPage, vbPerPage]);

  useEffect(() => { setVbPage(1); }, [statusFilter]);

  const statusLabel = (status) => {
    const map = {
      completed: { color: 'green', text: 'Completed' },
      preparing: { color: 'blue', text: 'Preparing' },
      waiting: { color: 'gold', text: 'Waiting' },
      error: { color: 'red', text: 'Error' },
    };
    const s = map[status] || { color: 'grey', text: status };
    return <Label color={s.color} isCompact>{s.text}</Label>;
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (configsLoading) {
    return (
      <div style={{ padding: '16px' }}>
        <Bullseye style={{ padding: '48px' }}><Spinner size="lg" /></Bullseye>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 24px' }}>
      <Content component={ContentVariants.p} style={{ marginBottom: 16 }}>
        Check job status and download view-based reports in CSV format. Requests are purged according to retention settings.
      </Content>

      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Select
              isOpen={statusOpen}
              onOpenChange={setStatusOpen}
              selected={statusFilter}
              onSelect={(_e, val) => { setStatusFilter(val); setStatusOpen(false); }}
              toggle={(toggleRef) => (
                <MenuToggle ref={toggleRef} onClick={() => setStatusOpen(!statusOpen)} isExpanded={statusOpen}>
                  <FilterIcon style={{ marginRight: 6 }} />
                  Report job status
                </MenuToggle>
              )}
            >
              <SelectList>
                {JOB_STATUS_OPTIONS.map((o) => (
                  <SelectOption key={o.value} value={o.value}>{o.label}</SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarItem>
          <ToolbarItem>
            <Switch
              id="view-only-my-jobs"
              label="View only my jobs"
              isChecked={viewOnlyMyJobs}
              onChange={(_e, checked) => setViewOnlyMyJobs(checked)}
              isReversed
            />
          </ToolbarItem>
          <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={filtered.length}
              perPage={vbPerPage}
              page={vbPage}
              onSetPage={(_, p) => setVbPage(p)}
              onPerPageSelect={(_, pp) => { setVbPerPage(pp); setVbPage(1); }}
              isCompact
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      {paginated.length > 0 ? (
        <Table aria-label="View-based reports" variant="compact">
          <Thead>
            <Tr>
              <Th>Report</Th>
              <Th>Report status</Th>
              <Th>Completed</Th>
              <Th>Requested by</Th>
              <Th screenReaderText="Download" />
            </Tr>
          </Thead>
          <Tbody>
            {paginated.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel="Report">{row.reportConfigName}</Td>
                <Td dataLabel="Report status">{statusLabel(row.status)}</Td>
                <Td dataLabel="Completed">{row.status === 'completed' ? formatDate(row.completedAt) : '-'}</Td>
                <Td dataLabel="Requested by">{row.requestedBy}</Td>
                <Td dataLabel="Download">
                  {row.isDownloadAvailable && (
                    <Button variant="link" isInline onClick={() => {}}>Download</Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <EmptyState variant="lg" icon={FileAltIcon} titleText="No view-based reports" headingLevel="h2">
          <EmptyStateBody>
            Check job status and download view-based reports in CSV format.
          </EmptyStateBody>
        </EmptyState>
      )}
    </div>
  );
}

function ReportRowActionsDropdown({ report, navigate, onSend, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      toggle={(toggleRef) => (
        <MenuToggle ref={toggleRef} variant="plain" onClick={() => setIsOpen(!isOpen)} isExpanded={isOpen} aria-label={`Actions for ${report.name}`}>
          <EllipsisVIcon />
        </MenuToggle>
      )}
      popperProps={{ position: 'right' }}
    >
      <DropdownList>
        <DropdownItem key="send" onClick={() => { setIsOpen(false); onSend(report); }}>Send report now</DropdownItem>
        <DropdownItem key="clone" onClick={() => { setIsOpen(false); navigate(v3Routes.vulnerabilityReportsCreatePath); }}>Clone report</DropdownItem>
        <DropdownItem key="delete" isDanger onClick={() => { setIsOpen(false); onDelete(report); }}>Delete report</DropdownItem>
      </DropdownList>
    </Dropdown>
  );
}

export default function V3ReportsPage() {
  const navigate = useNavigate();
  const storeVersion = useSyncExternalStore(subscribe, getVersion, getVersion);
  const createdReports = getReports();
  const { data: liveConfigs, loading: configsLoading } = useReportConfigurations({ pagination: { limit: 100, offset: 0 } });
  const [activeTabKey, setActiveTabKey] = useState(0);

  const [reportSearch, setReportSearch] = useState('');
  const [bulkOpen, setBulkOpen] = useState(false);

  const [selectedReports, setSelectedReports] = useState(() => new Set());
  const [sendAlert, setSendAlert] = useState(null);
  const [deleteAlertMsg, setDeleteAlertMsg] = useState(null);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortAscending, setSortAscending] = useState(true);

  const handleSendReport = (rpt) => { setSendAlert(rpt.name); setTimeout(() => setSendAlert(null), 4000); };
  const handleDeleteReport = (rpt) => { deleteReport(rpt.id); setDeleteAlertMsg(rpt.name); setTimeout(() => setDeleteAlertMsg(null), 4000); };

  const allReportConfigs = useMemo(() => {
    const deleted = getDeletedIds();

    const created = createdReports.map((r) => ({
      id: r.id,
      name: r.name,
      collection: r.collection || 'Custom filters',
      description: r.description || '',
    }));

    const live = (liveConfigs || []).map((rc) => ({
      id: rc.id,
      name: rc.name,
      collection: rc.resourceScope?.collectionScope?.collectionName || '-',
      description: rc.description || '',
    })).filter((r) => !deleted.has(r.id));

    const seenIds = new Set([...created.map((r) => r.id), ...live.map((r) => r.id)]);
    const mock = MOCK_REPORT_CONFIGURATIONS.filter((r) => !seenIds.has(r.id) && !deleted.has(r.id));

    return [...created, ...live, ...mock];
  }, [createdReports, liveConfigs, storeVersion]);

  const filteredReports = useMemo(() => {
    const filtered = allReportConfigs.filter((r) =>
      r.name.toLowerCase().includes(reportSearch.trim().toLowerCase())
    );
    return filtered.sort((a, b) =>
      sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [allReportConfigs, reportSearch, sortAscending]);

  const paginatedReports = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredReports.slice(start, start + perPage);
  }, [filteredReports, page, perPage]);

  useEffect(() => { setPage(1); }, [reportSearch]);

  const toggleReport = (id, checked) => {
    setSelectedReports((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

  const toggleAllReports = (checked) => {
    if (checked) {
      setSelectedReports(new Set(paginatedReports.map((r) => r.id)));
    } else {
      setSelectedReports(new Set());
    }
  };

  const allReportsSelected =
    paginatedReports.length > 0 && paginatedReports.every((r) => selectedReports.has(r.id));
  const someReportsSelected = paginatedReports.some((r) => selectedReports.has(r.id));

  return (
    <>
      {sendAlert && (
        <PageSection padding={{ default: 'padding' }}>
          <Alert variant="success" isInline title={`Report "${sendAlert}" has been queued for sending.`} actionClose={<AlertActionCloseButton onClose={() => setSendAlert(null)} />} />
        </PageSection>
      )}
      {deleteAlertMsg && (
        <PageSection padding={{ default: 'padding' }}>
          <Alert variant="success" isInline title={`Report "${deleteAlertMsg}" has been deleted.`} actionClose={<AlertActionCloseButton onClose={() => setDeleteAlertMsg(null)} />} />
        </PageSection>
      )}

      <PageSection>
        <Title headingLevel="h1">Vulnerability reporting</Title>
      </PageSection>

      <PageSection padding={{ default: 'noPadding' }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_, key) => setActiveTabKey(key)}
        >
          <Tab eventKey={0} title={<TabTitleText>Report configurations</TabTitleText>}>
            <div style={{ padding: '16px 24px' }}>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: 16 }}>
                <FlexItem>
                  <Content component={ContentVariants.p}>
                    Configure reports, define collections, and assign delivery destinations to report on
                    vulnerabilities across the organization.
                  </Content>
                </FlexItem>
                <FlexItem>
                  <Button variant="primary" onClick={() => navigate(v3Routes.vulnerabilityReportsCreatePath)}>
                    Create report
                  </Button>
                </FlexItem>
              </Flex>

              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
                    <SearchInput
                      placeholder="Filter by report name"
                      value={reportSearch}
                      onChange={(_, value) => setReportSearch(value)}
                      onClear={() => setReportSearch('')}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="control" aria-label="Apply filter" icon={<ArrowRightIcon />} />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Dropdown
                      isOpen={bulkOpen}
                      onOpenChange={setBulkOpen}
                      toggle={(toggleRef) => (
                        <MenuToggle ref={toggleRef} onClick={() => setBulkOpen(!bulkOpen)} isExpanded={bulkOpen}>
                          Bulk actions
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem key="del" onClick={() => { setBulkOpen(false); selectedReports.forEach((id) => deleteReport(id)); setSelectedReports(new Set()); }}>Delete</DropdownItem>
                        <DropdownItem key="exp" onClick={() => setBulkOpen(false)}>Export</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                    <Pagination
                      itemCount={filteredReports.length}
                      perPage={perPage}
                      page={page}
                      onSetPage={(_, p) => setPage(p)}
                      onPerPageSelect={(_, pp) => { setPerPage(pp); setPage(1); }}
                      isCompact
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              {configsLoading ? (
                <Bullseye style={{ padding: '48px' }}>
                  <Spinner size="lg" />
                </Bullseye>
              ) : paginatedReports.length > 0 ? (
                <Table aria-label="Report configurations">
                  <Thead>
                    <Tr>
                      <Th screenReaderText="Row selection">
                        <Checkbox
                          id="select-all-reports"
                          aria-label="Select all reports"
                          isChecked={allReportsSelected ? true : someReportsSelected ? null : false}
                          onChange={(_e, checked) => toggleAllReports(checked)}
                        />
                      </Th>
                      <Th
                        sort={{
                          sortBy: { index: 1, direction: sortAscending ? 'asc' : 'desc' },
                          onSort: () => setSortAscending((prev) => !prev),
                          columnIndex: 1,
                        }}
                      >
                        Report
                      </Th>
                      <Th info={{
                        popover: 'The collection used to scope this report.',
                        ariaLabel: 'Collection info',
                        popoverProps: { headerContent: 'Collection' },
                      }}>
                        Collection
                      </Th>
                      <Th>Description</Th>
                      <Th info={{
                        popover: 'The status of the most recent report job you initiated.',
                        ariaLabel: 'My last job status info',
                        popoverProps: { headerContent: 'My last job status' },
                      }}>
                        My last job status
                      </Th>
                      <Th screenReaderText="Actions" />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedReports.map((row) => (
                      <Tr key={row.id}>
                        <Td dataLabel="Select row">
                          <Checkbox
                            id={`report-${row.id}`}
                            isChecked={selectedReports.has(row.id)}
                            onChange={(_e, checked) => toggleReport(row.id, checked)}
                            aria-label={`Select ${row.name}`}
                          />
                        </Td>
                        <Td dataLabel="Report">
                          <Button
                            variant="link"
                            isInline
                            onClick={() => navigate(`${v3Routes.vulnerabilityReportDetailPath}/${row.id}`)}
                          >
                            {row.name}
                          </Button>
                        </Td>
                        <Td dataLabel="Collection">
                          <Button variant="link" isInline onClick={() => navigate(v3Routes.collectionsPath)}>{row.collection}</Button>
                        </Td>
                        <Td dataLabel="Description">{row.description || '-'}</Td>
                        <Td dataLabel="My last job status">None</Td>
                        <Td isActionCell>
                          <ReportRowActionsDropdown report={row} navigate={navigate} onSend={handleSendReport} onDelete={handleDeleteReport} />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <EmptyState variant="lg" icon={FileAltIcon} titleText="No vulnerability reports" headingLevel="h2">
                  <EmptyStateBody>
                    Create a report to begin receiving scheduled vulnerability updates.
                  </EmptyStateBody>
                  <EmptyStateFooter>
                    <EmptyStateActions>
                      <Button variant="primary" onClick={() => navigate(v3Routes.vulnerabilityReportsCreatePath)}>
                        Create report
                      </Button>
                    </EmptyStateActions>
                  </EmptyStateFooter>
                </EmptyState>
              )}
            </div>
          </Tab>

          <Tab eventKey={1} title={<TabTitleText>View-based reports</TabTitleText>}>
            <ViewBasedReportsTab
              liveConfigs={liveConfigs}
              configsLoading={configsLoading}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
}
