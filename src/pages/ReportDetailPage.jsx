import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateActions,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  MenuToggle,
  Stack,
  StackItem,
  PageSection,
  Spinner,
  Tab,
  Tabs,
  TabTitleText,
  Title,
} from "@patternfly/react-core";
import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  DownloadIcon,
} from "@patternfly/react-icons";
import { prefixRoutes } from "../routes";
import { getReportById, deleteReport, subscribe, getVersion } from "../api/reportStore";
import api from "../api/index";

const STATIC_COLUMNS = [
  "Cluster", "Namespace", "Deployment", "Image", "Component",
  "CVE", "Fixable", "CVE Fixed In", "Severity", "CVSS",
  "Discovered At", "Reference",
];

function formatSeverity(apiSeverity) {
  if (!apiSeverity) return null;
  const s = apiSeverity.replace(/_VULNERABILITY_SEVERITY$/, '');
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function formatFixability(fixability) {
  if (!fixability) return "Fixable and Not fixable";
  if (fixability === "FIXABLE") return "Fixable";
  if (fixability === "NOT_FIXABLE") return "Not fixable";
  return "Fixable and Not fixable";
}

function formatImageTypes(imageTypes) {
  if (!imageTypes?.length) return ["Deployed images", "Watched images"];
  return imageTypes.map((t) => {
    if (t === "DEPLOYED") return "Deployed images";
    if (t === "WATCHED") return "Watched images";
    return t;
  });
}

function apiConfigToReport(config) {
  return {
    id: config.id,
    name: config.name,
    description: config.description || "",
    collection: config.resourceScope?.collectionScope?.collectionName || "-",
    cveSeverities: (config.vulnReportFilters?.severities || []).map(formatSeverity).filter(Boolean),
    cveStatus: formatFixability(config.vulnReportFilters?.fixability),
    imageType: formatImageTypes(config.vulnReportFilters?.imageTypes),
    schedule: config.schedule ? "Scheduled" : "No schedule set",
    deliveryEmail: config.notifiers?.[0]?.emailConfig?.mailingLists?.join(", ") || null,
    notifierName: config.notifiers?.[0]?.notifierName || null,
  };
}

function mockJobs() {
  const now = Date.now();
  return [
    { id: "j1", completedAt: new Date(now - 86400000).toLocaleString(), status: "Completed", requester: "admin@example.com", download: true },
    { id: "j2", completedAt: new Date(now - 604800000).toLocaleString(), status: "Completed", requester: "admin@example.com", download: true },
    { id: "j3", completedAt: new Date(now - 1209600000).toLocaleString(), status: "Completed", requester: "scheduled", download: false },
  ];
}

const severityColors = { Critical: "red", Important: "orange", Moderate: "gold", Low: "blue" };

export default function ReportDetailPage({ routePrefix }) {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const routes = prefixRoutes(routePrefix);
  const [selectedTab, setSelectedTab] = useState("CONFIGURATION_DETAILS");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [liveConfig, setLiveConfig] = useState(null);
  const [loadingLive, setLoadingLive] = useState(false);

  const storeVersion = useSyncExternalStore(subscribe, getVersion, getVersion);
  const storeReport = useMemo(() => getReportById(reportId), [reportId, storeVersion]);

  useEffect(() => {
    if (!storeReport && reportId) {
      setLoadingLive(true);
      api.getReportConfiguration(reportId)
        .then((config) => {
          if (config?.id) setLiveConfig(apiConfigToReport(config));
        })
        .catch(() => {})
        .finally(() => setLoadingLive(false));
    }
  }, [reportId, storeReport]);

  const report = storeReport || liveConfig;

  if (loadingLive) {
    return (
      <PageSection isFilled>
        <Bullseye>
          <Spinner size="lg" />
        </Bullseye>
      </PageSection>
    );
  }

  if (!report) {
    return (
      <PageSection isFilled>
        <EmptyState variant="lg" titleText="Report not found" headingLevel="h2" status="danger">
          <EmptyStateBody>The requested report configuration could not be found.</EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button variant="primary" onClick={() => navigate(routes.vulnerabilityReportsPath)}>
                Back to reports
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </PageSection>
    );
  }

  const jobs = mockJobs();

  const handleDelete = () => {
    deleteReport(reportId);
    navigate(routes.vulnerabilityReportsPath);
  };

  return (
    <>
      <PageSection padding={{ default: "padding" }}>
        <Breadcrumb>
          <BreadcrumbItem to={routes.vulnerabilityReportsPath} onClick={(e) => { e.preventDefault(); navigate(routes.vulnerabilityReportsPath); }}>
            Vulnerability reporting
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{report.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <Divider />

      <PageSection>
        <Flex justifyContent={{ default: "justifyContentSpaceBetween" }} alignItems={{ default: "alignItemsCenter" }}>
          <FlexItem>
            <Title headingLevel="h1">{report.name}</Title>
          </FlexItem>
          <FlexItem>
            <Dropdown
              isOpen={actionsOpen}
              onOpenChange={setActionsOpen}
              toggle={(ref) => (
                <MenuToggle ref={ref} onClick={() => setActionsOpen(!actionsOpen)} isExpanded={actionsOpen}>
                  Actions
                </MenuToggle>
              )}
              popperProps={{ position: "right" }}
            >
              <DropdownList>
                <DropdownItem key="edit" onClick={() => { setActionsOpen(false); navigate(routes.vulnerabilityReportsCreatePath, { state: { editReport: report } }); }}>
                  Edit report
                </DropdownItem>
                <DropdownItem key="send" onClick={() => setActionsOpen(false)}>
                  Send report now
                </DropdownItem>
                <DropdownItem key="download" onClick={() => setActionsOpen(false)}>
                  Generate download
                </DropdownItem>
                <DropdownItem key="clone" onClick={() => { setActionsOpen(false); navigate(routes.vulnerabilityReportsCreatePath); }}>
                  Clone report
                </DropdownItem>
                <DropdownItem key="delete" isDanger onClick={() => { setActionsOpen(false); handleDelete(); }}>
                  Delete report
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection padding={{ default: "noPadding" }}>
        <Tabs
          activeKey={selectedTab}
          onSelect={(_e, k) => setSelectedTab(k)}
          usePageInsets
          aria-label="Report details tabs"
        >
          <Tab eventKey="CONFIGURATION_DETAILS" title={<TabTitleText>Configuration details</TabTitleText>} />
          <Tab eventKey="ALL_REPORT_JOBS" title={<TabTitleText>All report jobs</TabTitleText>} />
        </Tabs>
      </PageSection>

      {selectedTab === "CONFIGURATION_DETAILS" && (
        <PageSection>
          <Card>
            <CardBody>
              <Stack hasGutter>
                <StackItem>
                  <Title headingLevel="h2" size="lg">Report parameters</Title>
                </StackItem>
                <StackItem>
                  <DescriptionList columnModifier={{ default: "2Col", md: "3Col" }}>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Report name</DescriptionListTerm>
                      <DescriptionListDescription>{report.name}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Description</DescriptionListTerm>
                      <DescriptionListDescription>{report.description || "—"}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>CVE severity</DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {(report.cveSeverities || ["Critical", "Important", "Moderate", "Low"]).map((s) => (
                            <Label key={s} isCompact color={severityColors[s]}>{s}</Label>
                          ))}
                        </LabelGroup>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>CVE status</DescriptionListTerm>
                      <DescriptionListDescription>{report.cveStatus || "Fixable and Not fixable"}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Collection</DescriptionListTerm>
                      <DescriptionListDescription>{report.collection || report.savedFilter || report.scopeMethod || "Custom filters"}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Image type</DescriptionListTerm>
                      <DescriptionListDescription>
                        {(report.imageType || ["Deployed images", "Watched images"]).join(", ")}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>CVEs discovered since</DescriptionListTerm>
                      <DescriptionListDescription>{report.cvesDiscoveredSince || "All time"}</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </StackItem>
                <StackItem>
                  <Title headingLevel="h3" size="md">Report columns</Title>
                  <Content component="p" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>
                    {STATIC_COLUMNS.join(", ")}
                  </Content>
                </StackItem>
                <Divider />
                <StackItem>
                  <Stack hasGutter>
                    <StackItem>
                      <Title headingLevel="h2" size="lg">Delivery destinations</Title>
                    </StackItem>
                    <StackItem>
                      {report.deliveryEmail || report.notifierName ? (
                        <DescriptionList>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Email notifier</DescriptionListTerm>
                            <DescriptionListDescription>{report.notifierName || "Default email integration"}</DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Distribution list</DescriptionListTerm>
                            <DescriptionListDescription>
                              {report.deliveryEmail || "—"}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      ) : (
                        <Content component="p" style={{ color: "var(--pf-t--global--text--color--subtle)" }}>
                          No delivery destinations configured
                        </Content>
                      )}
                    </StackItem>
                  </Stack>
                </StackItem>
                <Divider />
                <StackItem>
                  <Stack hasGutter>
                    <StackItem>
                      <Title headingLevel="h2" size="lg">Schedule details</Title>
                    </StackItem>
                    <StackItem>
                      <DescriptionList>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Schedule</DescriptionListTerm>
                          <DescriptionListDescription>{report.schedule || "No schedule set"}</DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </StackItem>
                  </Stack>
                </StackItem>
              </Stack>
            </CardBody>
          </Card>
        </PageSection>
      )}

      {selectedTab === "ALL_REPORT_JOBS" && (
        <PageSection>
          <Table aria-label="Report jobs" variant="compact">
            <Thead>
              <Tr>
                <Th>Completed</Th>
                <Th>Status</Th>
                <Th>Requester</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {jobs.map((job) => (
                <Tr key={job.id}>
                  <Td>{job.completedAt}</Td>
                  <Td>
                    {job.status === "Completed" ? (
                      <Label isCompact color="green" icon={<CheckCircleIcon />}>{job.status}</Label>
                    ) : (
                      <Label isCompact color="red" icon={<ExclamationCircleIcon />}>{job.status}</Label>
                    )}
                  </Td>
                  <Td>{job.requester}</Td>
                  <Td>
                    {job.download && (
                      <Button variant="link" isInline icon={<DownloadIcon />} onClick={() => {}}>
                        Download report
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageSection>
      )}
    </>
  );
}
