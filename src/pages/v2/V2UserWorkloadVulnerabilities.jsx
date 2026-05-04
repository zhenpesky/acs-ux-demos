import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Title,
  Content,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  MenuToggle,
  Select,
  SelectOption,
  SelectList,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button,
  Tabs,
  Tab,
  TabTitleText,
  Label,
  ToggleGroup,
  ToggleGroupItem,
  Pagination,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  LabelGroup,
  Flex,
  FlexItem,
  Divider,
  TextInput,
  FormGroup,
  Form,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownList,
  Card,
  CardBody,
  Alert,
  PageSection,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateFooter,
  Skeleton,
  Tooltip,
  Nav,
  NavList,
  NavItem,
} from "@patternfly/react-core";

import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";

import {
  FilterIcon,
  CogIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  InfoCircleIcon,
  TimesIcon,
  GlobeAmericasIcon,
  SearchIcon,
  GripVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilAltIcon,
  TrashIcon,
  AngleUpIcon,
  AngleDownIcon,
} from "@patternfly/react-icons";

import { v2Routes } from "../../routes";
import {
  useWorkloadCVEs,
  useClusters,
  useVulnerabilitySummary,
  useSavedFilters,
  useReports,
} from "../../api/hooks";
import {
  formatTimeAgo,
  getClusterNames,
  getNamespaceNames,
  getDeploymentNames,
  CLUSTERS,
  NAMESPACES,
  DEPLOYMENTS,
  CVES,
  SAVED_FILTERS,
  deriveCveSeverity,
} from "../../mockData";
import { useLiveSync } from "../../api/hooks";

const SEVERITIES = ["Critical", "Important", "Moderate", "Low", "Unknown"];
const CVE_STATUSES = ["Fixable", "Not fixable"];
const VULN_STATES = ["OBSERVED", "DEFERRED", "FALSE_POSITIVE"];
const VULN_STATE_LABELS = { OBSERVED: "Observed", DEFERRED: "Excepted", FALSE_POSITIVE: "Undetermined" };

const FILTER_ENTITIES = [
  {
    key: "Cluster",
    label: "Cluster",
    attributes: [
      { key: "id", label: "ID", inputType: "autocomplete" },
      { key: "label", label: "Label", inputType: "autocomplete" },
      { key: "name", label: "Name", inputType: "autocomplete" },
      { key: "platformType", label: "Platform type", inputType: "autocomplete" },
      { key: "type", label: "Type", inputType: "autocomplete" },
    ],
  },
  {
    key: "CVE",
    label: "CVE",
    attributes: [
      { key: "cvss", label: "CVSS", inputType: "condition-number" },
      { key: "discoveredTime", label: "Discovered time", inputType: "date-picker" },
      { key: "epss", label: "EPSS probability", inputType: "condition-text" },
      { key: "name", label: "Name", inputType: "autocomplete" },
    ],
  },
  {
    key: "Deployment",
    label: "Deployment",
    attributes: [
      { key: "annotation", label: "Annotation", inputType: "autocomplete" },
      { key: "id", label: "ID", inputType: "autocomplete" },
      { key: "label", label: "Label", inputType: "autocomplete" },
      { key: "name", label: "Name", inputType: "autocomplete" },
    ],
  },
  {
    key: "Image",
    label: "Image",
    attributes: [
      { key: "label", label: "Label", inputType: "autocomplete" },
      { key: "name", label: "Name", inputType: "autocomplete" },
      { key: "os", label: "Operating system", inputType: "autocomplete" },
      { key: "registry", label: "Registry", inputType: "autocomplete" },
      { key: "tag", label: "Tag", inputType: "autocomplete" },
    ],
  },
  {
    key: "ImageComponent",
    label: "Image component",
    attributes: [
      { key: "layerType", label: "Layer type", inputType: "select", options: ["Application", "Base image"] },
      { key: "name", label: "Name", inputType: "autocomplete" },
      { key: "source", label: "Source", inputType: "select", options: ["OS", "Python", "Java", "Ruby", "Node js", "Go", "Dotnet Core Runtime", "Infrastructure"] },
      { key: "version", label: "Version", inputType: "autocomplete" },
    ],
  },
  {
    key: "Namespace",
    label: "Namespace",
    attributes: [
      { key: "annotation", label: "Annotation", inputType: "autocomplete" },
      { key: "id", label: "ID", inputType: "autocomplete" },
      { key: "label", label: "Label", inputType: "autocomplete" },
      { key: "name", label: "Name", inputType: "autocomplete" },
    ],
  },
];

/** Prototype rows: asset-cache, tls-proxy, wordpress @ staging-secured-cluster / frontend */
const V2_DEMO_DEPLOYMENTS = [
  {
    id: "v2-deploy-asset-cache",
    name: "asset-cache",
    type: "Deployment",
    namespace: "frontend",
    clusterName: "staging-secured-cluster",
    images: [{ id: "img-v2-ac", name: { fullName: "internal-registry/asset-cache:v1", remote: "internal-registry/asset-cache", tag: "v1" } }],
    imageCount: 1,
    created: "2023-06-12T11:30:00Z",
    imageCVECountBySeverity: {
      critical: { total: 2 },
      important: { total: 3 },
      moderate: { total: 1 },
      low: { total: 2 },
    },
    riskScore: 7.2,
    labels: { app: "asset-cache" },
    replicas: 2,
    inactive: false,
  },
  {
    id: "v2-deploy-tls-proxy",
    name: "tls-proxy",
    type: "Deployment",
    namespace: "frontend",
    clusterName: "staging-secured-cluster",
    images: [{ id: "img-v2-tls", name: { fullName: "envoyproxy/envoy:v1.28", remote: "envoyproxy/envoy", tag: "v1.28" } }],
    imageCount: 1,
    created: "2024-02-01T09:15:00Z",
    imageCVECountBySeverity: {
      critical: { total: 0 },
      important: { total: 2 },
      moderate: { total: 4 },
      low: { total: 1 },
    },
    riskScore: 5.4,
    labels: { app: "tls-proxy" },
    replicas: 2,
    inactive: false,
  },
  {
    id: "v2-deploy-wordpress",
    name: "wordpress",
    type: "Deployment",
    namespace: "frontend",
    clusterName: "staging-secured-cluster",
    images: [{ id: "img-v2-wp", name: { fullName: "wordpress:6.4", remote: "wordpress", tag: "6.4" } }],
    imageCount: 1,
    created: "2023-11-20T14:00:00Z",
    imageCVECountBySeverity: {
      critical: { total: 1 },
      important: { total: 2 },
      moderate: { total: 3 },
      low: { total: 5 },
    },
    riskScore: 6.8,
    labels: { app: "wordpress" },
    replicas: 3,
    inactive: false,
  },
];

const SAVED_FILTER_DROPDOWN_OPTIONS = [
  "Front End minimum",
  "Static text",
  "Infra main",
  "etcd critical",
  "Cluster warnings",
  "Silenced alerts",
  "Disabled warnings",
];

const MANAGE_MODAL_DEFAULT_ITEMS = SAVED_FILTER_DROPDOWN_OPTIONS.map((name, i) => ({
  id: `v2-sf-${i}`,
  name,
  hidden: false,
}));

function deploymentCveTotal(d) {
  const sev = d.imageCVECountBySeverity;
  if (!sev) return 0;
  return (sev.critical?.total || 0) + (sev.important?.total || 0) + (sev.moderate?.total || 0) + (sev.low?.total || 0);
}

function applyWorkloadFilters(deployments, filters) {
  let list = [...deployments];
  if (filters.clusterName?.length) {
    list = list.filter((d) => filters.clusterName.includes(d.clusterName));
  }
  if (filters.namespaceName?.length) {
    list = list.filter((d) => filters.namespaceName.includes(d.namespace));
  }
  if (filters.deploymentName?.length) {
    list = list.filter((d) => filters.deploymentName.includes(d.name));
  }
  if (filters.cveSeverity?.length) {
    list = list.filter((d) =>
      filters.cveSeverity.some((sev) => {
        const key = sev.toLowerCase();
        return (d.imageCVECountBySeverity?.[key]?.total || 0) > 0;
      })
    );
  }
  // List API does not expose fixable counts; treat "Fixable" as deployments with any CVE (prototype).
  if (filters.cveStatus?.includes("Fixable")) {
    list = list.filter((d) => deploymentCveTotal(d) > 0);
  }
  if (filters.cveStatus?.includes("Not fixable") && !filters.cveStatus?.includes("Fixable")) {
    list = list.filter((d) => deploymentCveTotal(d) > 0);
  }
  return list;
}

function filtersEqual(a, b) {
  if (!a || !b) return a === b;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const va = a[k] || [];
    const vb = b[k] || [];
    if (va.length !== vb.length) return false;
    const sa = [...va].sort();
    const sb = [...vb].sort();
    if (sa.some((x, i) => x !== sb[i])) return false;
  }
  return true;
}

function SeverityBadge({ count, severity }) {
  if (count === 0) return <span style={{ color: "var(--pf-t--global--text--color--subtle)" }}>0</span>;
  const colors = {
    critical: "var(--pf-t--global--color--status--danger--default)",
    important: "var(--pf-t--global--color--status--warning--default)",
    moderate: "var(--pf-t--global--color--status--info--default)",
    low: "var(--pf-t--global--text--color--subtle)",
  };
  const Icons = { critical: ExclamationCircleIcon, important: ExclamationTriangleIcon, moderate: InfoCircleIcon, low: InfoCircleIcon };
  const Icon = Icons[severity];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
      <Icon style={{ color: colors[severity], fontSize: 14 }} />
      <span style={{ color: colors[severity] }}>{count}</span>
    </span>
  );
}

const FILTER_KEY_LABELS = {
  clusterName: "Cluster",
  clusterLabel: "Cluster label",
  clusterId: "Cluster ID",
  clusterPlatformType: "Cluster platform type",
  clusterType: "Cluster type",
  namespaceName: "Namespace",
  namespaceAnnotation: "Namespace annotation",
  namespaceId: "Namespace ID",
  namespaceLabel: "Namespace label",
  deploymentName: "Deployment",
  deploymentAnnotation: "Deployment annotation",
  deploymentId: "Deployment ID",
  deploymentLabel: "Deployment label",
  cveName: "CVE",
  cveCvss: "CVE CVSS",
  cveDiscoveredTime: "CVE discovered time",
  cveEpss: "CVE EPSS probability",
  cveSeverity: "CVE severity",
  cveStatus: "CVE status",
  imageName: "Image",
  imageLabel: "Image label",
  imageOs: "Image OS",
  imageRegistry: "Image registry",
  imageTag: "Image tag",
  imageComponentName: "Image component",
  imageComponentLayerType: "Image component layer type",
  imageComponentSource: "Image component source",
  imageComponentVersion: "Image component version",
};

function formatCategoryName(key) {
  return FILTER_KEY_LABELS[key] || key;
}

function collectUnique(arr) { return [...new Set(arr)].sort(); }

function getAutocompleteSuggestions(entity, attribute, inputValue) {
  const q = (inputValue || "").toLowerCase();
  const filter = (items) => items.filter((i) => i.toLowerCase().includes(q));

  if (entity === "Cluster") {
    if (attribute === "name") return filter(getClusterNames());
    if (attribute === "id") return filter(CLUSTERS.map((c) => c.id));
    if (attribute === "label") return filter(collectUnique(CLUSTERS.flatMap((c) => Object.entries(c.labels || {}).map(([k, v]) => `${k}=${v}`))));
    if (attribute === "platformType") return filter(collectUnique(CLUSTERS.map((c) => c.provider || "Kubernetes")));
    if (attribute === "type") return filter(collectUnique(CLUSTERS.map((c) => c.type || "KUBERNETES_CLUSTER")));
  }
  if (entity === "Namespace") {
    if (attribute === "name") return filter(getNamespaceNames());
    if (attribute === "id") return filter(NAMESPACES.map((n) => n.metadata?.id || n.id));
    if (attribute === "annotation") return filter(["kubernetes.io/metadata.name", "openshift.io/sa.scc.uid-range", "openshift.io/node-selector"]);
    if (attribute === "label") return filter(["kubernetes.io/metadata.name", "pod-security.kubernetes.io/enforce=privileged", "security.openshift.io/scc.podSecurityLabelSync=true"]);
  }
  if (entity === "Deployment") {
    if (attribute === "name") return filter(getDeploymentNames());
    if (attribute === "id") return filter(DEPLOYMENTS.map((d) => d.id));
    if (attribute === "annotation") return filter(collectUnique(DEPLOYMENTS.flatMap((d) => Object.entries(d.annotations || {}).map(([k, v]) => `${k}=${v}`))).concat(["deployment.kubernetes.io/revision=1", "kubectl.kubernetes.io/last-applied-configuration"]));
    if (attribute === "label") return filter(collectUnique(DEPLOYMENTS.flatMap((d) => Object.entries(d.labels || {}).map(([k, v]) => `${k}=${v}`))));
  }
  if (entity === "CVE") {
    if (attribute === "name") return filter(CVES.map((c) => c.cve));
  }
  if (entity === "Image") {
    const imageFullNames = [
      "registry.redhat.io/rhacs-rhel8/main-rhel8:4.7.0",
      "registry.redhat.io/ubi9/python-312:latest",
      "registry.redhat.io/openshift4/ose-machine-config-operator:v4.16",
      "registry.redhat.io/openshift-service-mesh/proxyv2-rhel9:2.6.3",
      "docker.io/library/nginx:1.25-alpine",
      "docker.io/library/redis:7.2-bookworm",
      "docker.io/library/postgres:16.2-bullseye",
      "quay.io/stehesse/snow-mid-server:latest",
      "quay.io/openshift4/ose-kube-rbac-proxy:v0.14.0",
      "gcr.io/my-project/api-gateway:v2.3.1",
      "gcr.io/my-project/frontend-app:v1.8.0",
      "docker.io/library/node:20-slim",
      "registry.redhat.io/ubi9/ubi-minimal:9.4",
      "docker.io/prom/alertmanager:v0.27.0",
      "docker.io/grafana/grafana:10.4.1",
    ];
    if (attribute === "name") return filter(imageFullNames);
    if (attribute === "label") return filter(["io.buildah.version=1.29.0", "architecture=x86_64", "vendor=Red Hat, Inc.", "com.redhat.component=ose-machine-config-operator-container", "maintainer=Red Hat", "name=ubi9/python-312", "summary=Platform for building and running Python 3.12 applications"]);
    if (attribute === "os") return filter(["linux", "rhel", "centos", "ubuntu", "alpine", "debian"]);
    if (attribute === "registry") return filter(["registry.redhat.io", "docker.io", "quay.io", "gcr.io", "ghcr.io"]);
    if (attribute === "tag") return filter(["latest", "v4.16", "v4.7.0", "2.6.3", "1.25-alpine", "7.2-bookworm", "16.2-bullseye", "v2.3.1", "v1.8.0", "20-slim", "9.4", "v0.27.0", "10.4.1", "v0.14.0", "v1.0.0"]);
  }
  if (entity === "ImageComponent") {
    if (attribute === "name") return filter(["openssl", "glibc", "zlib", "curl", "libxml2", "bash", "coreutils", "systemd", "krb5-libs", "expat", "pcre2", "python3-libs", "golang", "npm", "log4j"]);
    if (attribute === "version") return filter(["1.1.1k", "2.28", "1.2.11", "7.76.1", "3.9.16", "5.1.8", "8.32", "249", "1.19.4", "2.4.9", "10.42", "3.9.18", "1.20.0", "9.8.1", "2.17.1"]);
  }
  return [];
}

function entityFilterKeyMap(entity, attribute) {
  const map = {
    "Cluster:name": "clusterName", "Cluster:id": "clusterId", "Cluster:label": "clusterLabel",
    "Cluster:platformType": "clusterPlatformType", "Cluster:type": "clusterType",
    "Namespace:name": "namespaceName", "Namespace:annotation": "namespaceAnnotation",
    "Namespace:id": "namespaceId", "Namespace:label": "namespaceLabel",
    "Deployment:name": "deploymentName", "Deployment:annotation": "deploymentAnnotation",
    "Deployment:id": "deploymentId", "Deployment:label": "deploymentLabel",
    "CVE:name": "cveName", "CVE:cvss": "cveCvss", "CVE:discoveredTime": "cveDiscoveredTime",
    "CVE:epss": "cveEpss",
    "Image:name": "imageName", "Image:label": "imageLabel", "Image:os": "imageOs",
    "Image:registry": "imageRegistry", "Image:tag": "imageTag",
    "ImageComponent:name": "imageComponentName", "ImageComponent:layerType": "imageComponentLayerType",
    "ImageComponent:source": "imageComponentSource", "ImageComponent:version": "imageComponentVersion",
  };
  return map[`${entity}:${attribute}`] || null;
}

function CompoundSearchFilter({ onAddFilter }) {
  const [entityOpen, setEntityOpen] = useState(false);
  const [attrOpen, setAttrOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(FILTER_ENTITIES[0]);
  const [selectedAttribute, setSelectedAttribute] = useState(FILTER_ENTITIES[0].attributes[0]);
  const [inputValue, setInputValue] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [conditionOp, setConditionOp] = useState(">");
  const [conditionOpen, setConditionOpen] = useState(false);

  const attr = selectedAttribute;
  const suggestions = useMemo(
    () => (attr.inputType === "autocomplete" ? getAutocompleteSuggestions(selectedEntity.key, attr.key, inputValue) : []),
    [selectedEntity.key, attr.key, attr.inputType, inputValue]
  );

  function handleApply(value) {
    if (!value) return;
    const filterKey = entityFilterKeyMap(selectedEntity.key, attr.key);
    if (filterKey) {
      onAddFilter(filterKey, value);
    }
    setInputValue("");
    setSuggestionsOpen(false);
  }

  function renderValueInput() {
    if (attr.inputType === "date-picker") {
      return (
        <>
          <ToolbarItem className="pf-v6-u-flex-grow-1">
            <TextInputGroup>
              <TextInputGroupMain
                value={inputValue}
                onChange={(_e, v) => setInputValue(v)}
                onKeyDown={(e) => { if (e.key === "Enter" && inputValue.trim()) handleApply(inputValue.trim()); }}
                placeholder="MM/DD/YYYY"
                type="date"
                aria-label={`${attr.label} value`}
              />
              {inputValue && (
                <TextInputGroupUtilities>
                  <Button variant="plain" onClick={() => setInputValue("")} aria-label="Clear"><TimesIcon /></Button>
                </TextInputGroupUtilities>
              )}
            </TextInputGroup>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="plain" aria-label="Apply" onClick={() => { if (inputValue.trim()) handleApply(inputValue.trim()); }} icon={<ArrowRightIcon />} />
          </ToolbarItem>
        </>
      );
    }
    if (attr.inputType === "select" && attr.options) {
      return (
        <ToolbarItem className="pf-v6-u-flex-grow-1">
          <Select
            isOpen={suggestionsOpen}
            onOpenChange={setSuggestionsOpen}
            onSelect={(_e, val) => { handleApply(val); setSuggestionsOpen(false); }}
            toggle={(ref) => (
              <MenuToggle ref={ref} onClick={() => setSuggestionsOpen(!suggestionsOpen)} isExpanded={suggestionsOpen} className="pf-v6-u-w-100">
                {`Filter by ${selectedEntity.label} ${attr.label}`}
              </MenuToggle>
            )}
          >
            <SelectList>
              {attr.options.map((o) => (
                <SelectOption key={o} value={o}>
                  {o}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
        </ToolbarItem>
      );
    }
    if (attr.inputType === "date-picker") {
      return (
        <ToolbarItem className="pf-v6-u-flex-grow-1">
          <TextInput
            type="date"
            value={inputValue}
            onChange={(_e, v) => setInputValue(v)}
            aria-label="Discovered time"
          />
        </ToolbarItem>
      );
    }
    if (attr.inputType === "condition-number" || attr.inputType === "condition-text") {
      const ops = [
        { value: ">", label: "Is greater than" },
        { value: ">=", label: "Is greater than or equal to" },
        { value: "<=", label: "Is less than or equal to" },
        { value: "<", label: "Is less than" },
      ];
      return (
        <>
          <ToolbarItem>
            <Select
              isOpen={conditionOpen}
              onOpenChange={setConditionOpen}
              selected={conditionOp}
              onSelect={(_e, val) => { setConditionOp(val); setConditionOpen(false); }}
              toggle={(ref) => (
                <MenuToggle ref={ref} onClick={() => setConditionOpen(!conditionOpen)} isExpanded={conditionOpen} className="pf-v6-u-flex-shrink-0">
                  {ops.find((o) => o.value === conditionOp)?.label}
                </MenuToggle>
              )}
            >
              <SelectList>
                {ops.map((o) => (
                  <SelectOption key={o.value} value={o.value}>
                    {o.label}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarItem>
          <ToolbarItem className="pf-v6-u-flex-grow-1">
            <TextInputGroup>
              <TextInputGroupMain
                value={inputValue}
                onChange={(_e, v) => setInputValue(v)}
                onKeyDown={(e) => { if (e.key === "Enter" && inputValue.trim()) handleApply(`${conditionOp}${inputValue.trim()}`); }}
                placeholder={attr.inputType === "condition-text" ? "0%" : "0"}
                type="text"
                aria-label={`${attr.label} value`}
              />
              {inputValue && (
                <TextInputGroupUtilities>
                  <Button variant="plain" onClick={() => setInputValue("")} aria-label="Clear">
                    <TimesIcon />
                  </Button>
                </TextInputGroupUtilities>
              )}
            </TextInputGroup>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="plain" aria-label="Apply" onClick={() => { if (inputValue.trim()) handleApply(`${conditionOp}${inputValue.trim()}`); }} icon={<ArrowRightIcon />} />
          </ToolbarItem>
        </>
      );
    }
    return (
      <>
        <ToolbarItem className="pf-v6-u-flex-grow-1">
          <Select
            isOpen={suggestionsOpen && suggestions.length > 0}
            onOpenChange={setSuggestionsOpen}
            onSelect={(_e, val) => handleApply(val)}
            toggle={(ref) => (
              <MenuToggle ref={ref} variant="typeahead" onClick={() => setSuggestionsOpen(!suggestionsOpen)} isExpanded={suggestionsOpen} className="pf-v6-u-w-100">
                <TextInputGroup isPlain>
                  <TextInputGroupMain
                    value={inputValue}
                    onChange={(_e, v) => { setInputValue(v); setSuggestionsOpen(true); }}
                    onFocus={() => setSuggestionsOpen(true)}
                    onKeyDown={(e) => { if (e.key === "Enter" && inputValue.trim()) handleApply(inputValue.trim()); }}
                    placeholder={`Filter results by ${selectedEntity.label}...`}
                    autoComplete="off"
                    aria-label="Filter input"
                  />
                  <TextInputGroupUtilities>
                    {inputValue && (
                      <Button variant="plain" onClick={() => { setInputValue(""); setSuggestionsOpen(false); }} aria-label="Clear">
                        <TimesIcon />
                      </Button>
                    )}
                    <Button variant="plain" onClick={() => setSuggestionsOpen(!suggestionsOpen)} aria-label="Open">
                      <ArrowRightIcon style={{ transform: suggestionsOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </Button>
                  </TextInputGroupUtilities>
                </TextInputGroup>
              </MenuToggle>
            )}
          >
            <SelectList>
              {suggestions.slice(0, 15).map((s) => (
                <SelectOption key={s} value={s}>
                  {s}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
        </ToolbarItem>
      </>
    );
  }

  return (
    <ToolbarGroup variant="filter-group" className="pf-v6-u-flex-grow-1">
      <ToolbarItem>
        <Select
          isOpen={entityOpen}
          onOpenChange={setEntityOpen}
          selected={selectedEntity.key}
          onSelect={(_e, val) => {
            const ent = FILTER_ENTITIES.find((e) => e.key === val);
            setSelectedEntity(ent);
            setSelectedAttribute(ent.attributes[0]);
            setEntityOpen(false);
            setInputValue("");
          }}
          toggle={(ref) => (
            <MenuToggle ref={ref} onClick={() => setEntityOpen(!entityOpen)} isExpanded={entityOpen} className="pf-v6-u-flex-shrink-0">
              {selectedEntity.label}
            </MenuToggle>
          )}
        >
          <SelectList>
            {FILTER_ENTITIES.map((e) => (
              <SelectOption key={e.key} value={e.key}>
                {e.label}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      </ToolbarItem>
      <ToolbarItem>
        <Select
          isOpen={attrOpen}
          onOpenChange={setAttrOpen}
          selected={attr.key}
          onSelect={(_e, val) => {
            setSelectedAttribute(selectedEntity.attributes.find((a) => a.key === val));
            setAttrOpen(false);
            setInputValue("");
          }}
          toggle={(ref) => (
            <MenuToggle ref={ref} onClick={() => setAttrOpen(!attrOpen)} isExpanded={attrOpen} className="pf-v6-u-flex-shrink-0">
              {attr.label}
            </MenuToggle>
          )}
        >
          <SelectList>
            {selectedEntity.attributes.map((a) => (
              <SelectOption key={a.key} value={a.key} isSelected={a.key === attr.key}>
                {a.label}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      </ToolbarItem>
      {renderValueInput()}
    </ToolbarGroup>
  );
}

function DefaultFilterModal({ defaultSeverities, defaultFixable, onApply }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sevs, setSevs] = useState(defaultSeverities);
  const [fixable, setFixable] = useState(defaultFixable);
  const totalFilters = sevs.length + (fixable ? 1 : 0);

  return (
    <>
      <Button
        variant="secondary"
        className="pf-v6-u-display-inline-flex pf-v6-u-align-items-center"
        onClick={() => setIsOpen(true)}
        countOptions={totalFilters > 0 ? { isRead: true, count: totalFilters } : undefined}
        icon={<GlobeAmericasIcon />}
      >
        Default filters
      </Button>
      <Modal variant="medium" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader title="Default vulnerability filters" description="Select default vulnerability filters to be applied across all views." />
        <ModalBody>
          <Form>
            <FormGroup label="CVE severity" fieldId="default-severity">
              {SEVERITIES.map((s) => (
                <Checkbox
                  key={s}
                  id={`default-sev-${s}`}
                  label={s}
                  isChecked={sevs.includes(s)}
                  onChange={(_, checked) => setSevs(checked ? [...sevs, s] : sevs.filter((x) => x !== s))}
                />
              ))}
            </FormGroup>
            <FormGroup label="CVE status" fieldId="default-fixable">
              <Checkbox id="default-fixable" label="Fixable" isChecked={fixable} onChange={(_, checked) => setFixable(checked)} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => { onApply(sevs, fixable); setIsOpen(false); }}>Apply filters</Button>
          <Button variant="link" onClick={() => setIsOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

function ManageSavedFiltersModalV2({
  isOpen,
  onClose,
  items,
  onReorder,
  onToggleHidden,
  onRename,
  onDelete,
  onSave,
}) {
  const [localItems, setLocalItems] = useState(items);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (isOpen) setLocalItems(items);
  }, [isOpen, items]);

  const move = (index, dir) => {
    const next = [...localItems];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setLocalItems(next);
    onReorder(next);
  };

  return (
    <Modal variant="medium" isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        title="Manage saved filters"
        description="Hide, edit, or delete saved filters. You can also change the order of items shown in your saved filters menu."
      />
      <ModalBody>
        <Table aria-label="Manage saved filters" variant="compact">
          <Thead>
            <Tr>
              <Th screenReaderText="Reorder" />
              <Th>Name</Th>
              <Th screenReaderText="Visibility" />
              <Th screenReaderText="Edit" />
              <Th screenReaderText="Delete" />
            </Tr>
          </Thead>
          <Tbody>
            {localItems.map((row, index) => (
              <Tr key={row.id}>
                <Td>
                  <Flex gap={{ default: "gapSm" }} alignItems={{ default: "alignItemsCenter" }}>
                    <GripVerticalIcon aria-hidden style={{ color: "var(--pf-t--global--icon--color--subtle)" }} />
                    <Button variant="plain" aria-label="Move up" isDisabled={index === 0} onClick={() => move(index, -1)} icon={<AngleUpIcon />} />
                    <Button variant="plain" aria-label="Move down" isDisabled={index === localItems.length - 1} onClick={() => move(index, 1)} icon={<AngleDownIcon />} />
                  </Flex>
                </Td>
                <Td>
                  {editingId === row.id ? (
                    <TextInput
                      value={editName}
                      onChange={(_e, v) => setEditName(v)}
                      aria-label="Filter name"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const name = editName.trim() || row.name;
                          setLocalItems((prev) => prev.map((r) => (r.id === row.id ? { ...r, name } : r)));
                          onRename(row.id, name);
                          setEditingId(null);
                        }
                      }}
                    />
                  ) : (
                    row.name
                  )}
                </Td>
                <Td>
                  <Tooltip content={row.hidden ? "Show in saved filters menu" : "Hide from saved filters menu"}>
                    <Button
                      variant="plain"
                      aria-label={row.hidden ? "Show in menu" : "Hide from menu"}
                      icon={row.hidden ? <EyeSlashIcon /> : <EyeIcon />}
                      onClick={() => {
                        const next = localItems.map((r) => (r.id === row.id ? { ...r, hidden: !r.hidden } : r));
                        setLocalItems(next);
                        onToggleHidden(row.id);
                      }}
                    />
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip content="Edit filter name">
                    <Button
                      variant="plain"
                      aria-label="Edit filter name"
                      icon={<PencilAltIcon />}
                      onClick={() => {
                        setEditingId(row.id);
                        setEditName(row.name);
                      }}
                    />
                  </Tooltip>
                </Td>
                <Td>
                  <Button
                    variant="plain"
                    aria-label="Delete"
                    icon={<TrashIcon />}
                    onClick={() => {
                      const next = localItems.filter((r) => r.id !== row.id);
                      setLocalItems(next);
                      onDelete(row.id);
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={() => { onSave(localItems); onClose(); }}>Save</Button>
        <Button variant="link" onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}

const V2_FILTER_PARAM_KEYS = [
  'clusterName', 'clusterId', 'clusterLabel', 'clusterPlatformType', 'clusterType',
  'namespaceName', 'namespaceAnnotation', 'namespaceId', 'namespaceLabel',
  'deploymentName', 'deploymentAnnotation', 'deploymentId', 'deploymentLabel',
  'cveName', 'cveCvss', 'cveDiscoveredTime', 'cveEpss',
  'cveSeverity', 'cveStatus',
  'imageName', 'imageLabel', 'imageOs', 'imageRegistry', 'imageTag',
  'imageComponentName', 'imageComponentLayerType', 'imageComponentSource', 'imageComponentVersion',
];

function parseFiltersFromSearchParams(searchParams) {
  const filters = {};
  let hasAny = false;
  V2_FILTER_PARAM_KEYS.forEach((key) => {
    const values = searchParams.getAll(key);
    filters[key] = values;
    if (values.length > 0) hasAny = true;
  });
  const savedFilter = searchParams.get('savedFilter') || null;
  return { filters: hasAny ? filters : null, savedFilter };
}

export default function V2UserWorkloadVulnerabilities() {
  useLiveSync();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [vulnState, setVulnState] = useState("OBSERVED");
  const [activeView, setActiveView] = useState(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'Images' || viewParam === 'CVEs' || viewParam === 'Deployments') return viewParam;
    return 'Deployments';
  });

  const emptyFilters = {
    clusterName: [], clusterId: [], clusterLabel: [], clusterPlatformType: [], clusterType: [],
    namespaceName: [], namespaceAnnotation: [], namespaceId: [], namespaceLabel: [],
    deploymentName: [], deploymentAnnotation: [], deploymentId: [], deploymentLabel: [],
    cveName: [], cveCvss: [], cveDiscoveredTime: [], cveEpss: [],
    cveSeverity: [], cveStatus: [],
    imageName: [], imageLabel: [], imageOs: [], imageRegistry: [], imageTag: [],
    imageComponentName: [], imageComponentLayerType: [], imageComponentSource: [], imageComponentVersion: [],
  };

  const defaultFilters = {
    ...emptyFilters,
    clusterName: ["staging-secured-cluster"],
    namespaceName: ["frontend"],
    deploymentName: ["asset-cache", "tls-proxy", "wordpress"],
    cveSeverity: ["Critical", "Important"],
    cveStatus: ["Fixable"],
  };

  const [activeFilters, setActiveFilters] = useState(() => {
    const { filters } = parseFiltersFromSearchParams(searchParams);
    return filters ? { ...emptyFilters, ...filters } : defaultFilters;
  });

  const [selectedSavedFilterName, setSelectedSavedFilterName] = useState(() => {
    const { savedFilter } = parseFiltersFromSearchParams(searchParams);
    return savedFilter || null;
  });
  const [baselineFilters, setBaselineFilters] = useState(() => {
    const { filters, savedFilter } = parseFiltersFromSearchParams(searchParams);
    return (filters && savedFilter) ? { ...emptyFilters, ...filters } : null;
  });

  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
  const [severityOpen, setSeverityOpen] = useState(false);
  const [cveStatusOpen, setCveStatusOpen] = useState(false);
  const [createReportOpen, setCreateReportOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);

  const [manageSavedFiltersOpen, setManageSavedFiltersOpen] = useState(false);
  const [manageFilterItems, setManageFilterItems] = useState(MANAGE_MODAL_DEFAULT_ITEMS);
  const [updateFilterModalOpen, setUpdateFilterModalOpen] = useState(false);
  const [createReportModalOpen, setCreateReportModalOpen] = useState(false);
  const [saveFilterModalOpen, setSaveFilterModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const [newFilterName, setNewFilterName] = useState("Front End only");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [sortIndex, setSortIndex] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [visibleColumns, setVisibleColumns] = useState({
    deployment: true, cvesBySeverity: true, cluster: true, namespace: true, images: true, firstDiscovered: true,
  });

  const { loading: workloadLoading } = useWorkloadCVEs(activeFilters);
  useClusters();
  useVulnerabilitySummary();
  const { filters: savedFilters, createFilter, updateFilter, deleteFilter } = useSavedFilters();
  const { createReport, generating: reportGenerating } = useReports();

  const filteredDeployments = useMemo(
    () => applyWorkloadFilters(V2_DEMO_DEPLOYMENTS, activeFilters),
    [activeFilters]
  );

  const sortedDeployments = useMemo(() => {
    const list = [...filteredDeployments];
    if (sortIndex === null || sortIndex === undefined) return list;
    const dir = sortDir === 'asc' ? 1 : -1;
    const cveTotal = (d) => deploymentCveTotal(d);
    list.sort((a, b) => {
      switch (sortIndex) {
        case 0: return dir * String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' });
        case 1: return dir * (cveTotal(a) - cveTotal(b));
        case 2: return dir * String(a.clusterName || '').localeCompare(String(b.clusterName || ''), undefined, { sensitivity: 'base' });
        case 3: return dir * String(a.namespace || '').localeCompare(String(b.namespace || ''), undefined, { sensitivity: 'base' });
        case 4: return dir * ((a.imageCount || 0) - (b.imageCount || 0));
        case 5: {
          const ta = a.created ? new Date(a.created).getTime() : 0;
          const tb = b.created ? new Date(b.created).getTime() : 0;
          return dir * (ta - tb);
        }
        default: return 0;
      }
    });
    return list;
  }, [filteredDeployments, sortIndex, sortDir]);

  const updateFilterDiffDescription = useMemo(() => {
    if (!baselineFilters) return '';
    const changes = [];
    const allKeys = new Set([...Object.keys(activeFilters), ...Object.keys(baselineFilters)]);
    for (const key of allKeys) {
      const oldVals = baselineFilters[key] || [];
      const newVals = activeFilters[key] || [];
      const added = newVals.filter((v) => !oldVals.includes(v));
      const removed = oldVals.filter((v) => !newVals.includes(v));
      const label = formatCategoryName(key);
      if (added.length) changes.push(`Added ${label}: ${added.join(', ')}`);
      if (removed.length) changes.push(`Removed ${label}: ${removed.join(', ')}`);
    }
    return changes.length ? changes.join('. ') : 'No changes';
  }, [baselineFilters, activeFilters]);

  const filtersModified = selectedSavedFilterName ? !filtersEqual(activeFilters, baselineFilters) : false;

  const totalImages = useMemo(() => filteredDeployments.reduce((acc, d) => acc + (d.imageCount || 0), 0), [filteredDeployments]);

  const imageRows = useMemo(() => {
    const imgMap = new Map();
    filteredDeployments.forEach((d) => {
      const sev = d.imageCVECountBySeverity;
      const addSevToEntry = (entry) => {
        if (!sev) return;
        entry.vulnerabilities.critical += sev.critical?.total || 0;
        entry.vulnerabilities.important += sev.important?.total || 0;
        entry.vulnerabilities.moderate += sev.moderate?.total || 0;
        entry.vulnerabilities.low += sev.low?.total || 0;
      };
      const hasImages = (d.images || []).length > 0;
      if (hasImages) {
        (d.images || []).forEach((img) => {
          const key = img.name.fullName;
          if (!imgMap.has(key)) {
            imgMap.set(key, {
              id: img.id,
              name: key,
              tag: img.name.tag || 'latest',
              os: 'linux',
              status: 'Active',
              created: d.created,
              deploymentCount: 0,
              vulnerabilities: { critical: 0, important: 0, moderate: 0, low: 0 },
            });
          }
          const entry = imgMap.get(key);
          entry.deploymentCount += 1;
          addSevToEntry(entry);
        });
      } else if (d.imageCount > 0) {
        const syntheticName = `${d.name}:latest`;
        if (!imgMap.has(syntheticName)) {
          imgMap.set(syntheticName, {
            id: `img-${d.id}`,
            name: syntheticName,
            tag: 'latest',
            os: 'linux',
            status: 'Active',
            created: d.created,
            deploymentCount: 0,
            vulnerabilities: { critical: 0, important: 0, moderate: 0, low: 0 },
          });
        }
        const entry = imgMap.get(syntheticName);
        entry.deploymentCount += 1;
        addSevToEntry(entry);
      }
    });
    return Array.from(imgMap.values());
  }, [filteredDeployments]);

  const cveRows = useMemo(() => {
    const all = CVES;
    if (vulnState === "OBSERVED") return all;
    if (vulnState === "DEFERRED") return all.filter((_, i) => i % 3 === 0);
    return all.filter((_, i) => i % 5 === 0);
  }, [vulnState]);

  const totalCVEs = cveRows.length;

  const totalFiltersCount = Object.values(activeFilters).reduce((a, v) => a + v.length, 0);

  function addFilter(key, value) {
    setActiveFilters((prev) => {
      if (prev[key]?.includes(value)) return prev;
      return { ...prev, [key]: [...(prev[key] || []), value] };
    });
    setPage(1);
  }
  function removeFilter(key, val) {
    setActiveFilters((prev) => ({ ...prev, [key]: prev[key].filter((v) => v !== val) }));
    setPage(1);
  }
  function clearAllFilters() {
    setActiveFilters({ ...emptyFilters });
    setSelectedSavedFilterName(null);
    setBaselineFilters(null);
    setPage(1);
  }
  function toggleFilter(key, value) {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((x) => x !== value) : [...prev[key], value],
    }));
    setPage(1);
  }

  function applyPresetByMenuName(name) {
    const presets = {
      "Front End minimum": {
        clusterName: ["staging-secured-cluster"],
        namespaceName: ["frontend"],
        deploymentName: ["asset-cache"],
        cveSeverity: ["Critical"],
        cveStatus: ["Fixable"],
      },
      "Static text": {
        clusterName: ["staging-secured-cluster"],
        namespaceName: ["frontend"],
        deploymentName: ["wordpress"],
        cveSeverity: ["Important", "Moderate"],
        cveStatus: ["Fixable", "Not fixable"],
      },
      "Infra main": {
        clusterName: ["staging-secured-cluster"],
        namespaceName: ["frontend"],
        deploymentName: ["tls-proxy", "asset-cache"],
        cveSeverity: ["Critical", "Important", "Moderate", "Low"],
        cveStatus: ["Fixable"],
      },
      "etcd critical": {
        clusterName: ["staging-secured-cluster"],
        namespaceName: ["frontend"],
        deploymentName: ["asset-cache", "tls-proxy", "wordpress"],
        cveSeverity: ["Critical"],
        cveStatus: ["Fixable", "Not fixable"],
      },
      "Cluster warnings": {
        clusterName: ["staging-secured-cluster"],
        namespaceName: ["frontend"],
        deploymentName: ["wordpress", "tls-proxy"],
        cveSeverity: ["Important"],
        cveStatus: ["Fixable"],
      },
      "Silenced alerts": {
        clusterName: ["staging-secured-cluster"],
        namespaceName: ["frontend"],
        deploymentName: ["wordpress"],
        cveSeverity: ["Low", "Moderate"],
        cveStatus: ["Not fixable"],
      },
      "Disabled warnings": {
        clusterName: ["staging-secured-cluster"],
        namespaceName: ["frontend"],
        deploymentName: ["asset-cache", "wordpress"],
        cveSeverity: ["Unknown"],
        cveStatus: ["Not fixable"],
      },
    };
    const next = { ...emptyFilters, ...(presets[name] || presets["Front End minimum"]) };
    setSelectedSavedFilterName(name === "Front End minimum" ? "Front End only" : name);
    setActiveFilters(next);
    setBaselineFilters(next);
    setPage(1);
    setSavedFiltersOpen(false);
  }

  function handleDefaultFiltersApply(sevs, fixable) {
    setActiveFilters((prev) => {
      const prevStatus = prev.cveStatus || [];
      const cveStatus = fixable
        ? [...new Set([...prevStatus, "Fixable"])]
        : prevStatus.filter((s) => s !== "Fixable");
      return { ...prev, cveSeverity: sevs, cveStatus };
    });
    setPage(1);
  }

  const [moreViewsOpen, setMoreViewsOpen] = useState(false);


  const handleVulnStateChange = useCallback((state) => {
    setVulnState(state);
    setPage(1);
  }, []);

  async function handleSaveFilters() {
    if (newFilterName.trim()) {
      await createFilter({ name: newFilterName, description: "", filters: activeFilters, createdBy: "user@example.com" });
      setSaveFilterModalOpen(false);
      setSelectedSavedFilterName(newFilterName);
      setBaselineFilters({ ...activeFilters });
      setNewFilterName("Front End only");
    }
  }

  async function handleUpdateSavedFilter() {
    const match = [...SAVED_FILTERS, ...savedFilters].find((f) => f.name === selectedSavedFilterName);
    if (match) {
      await updateFilter(match.id, { filters: activeFilters });
    }
    setBaselineFilters({ ...activeFilters });
    setUpdateFilterModalOpen(false);
  }

  return (
    <>
      <PageSection padding={{ default: "noPadding" }} style={{ background: "var(--pf-t--global--background--color--secondary--default)", paddingInline: "16px" }}>
        <Flex alignItems={{ default: "alignItemsCenter" }} gap={{ default: "gapMd" }}>
          <FlexItem>
            <Nav variant="horizontal-subnav" aria-label="Vulnerability management views">
              <NavList>
                <NavItem isActive itemId="user-workloads" onClick={(e) => e.preventDefault()}>User Workloads</NavItem>
                <NavItem itemId="platform" onClick={(e) => { e.preventDefault(); navigate(v2Routes.vulnerabilitiesPlatformPath); }}>Platform</NavItem>
                <NavItem itemId="nodes" onClick={(e) => { e.preventDefault(); navigate(v2Routes.vulnerabilitiesNodePath); }}>Nodes</NavItem>
              </NavList>
            </Nav>
          </FlexItem>
          <FlexItem>
            <Dropdown
              isOpen={moreViewsOpen}
              onSelect={() => setMoreViewsOpen(false)}
              onOpenChange={setMoreViewsOpen}
              toggle={(toggleRef) => (
                <MenuToggle ref={toggleRef} onClick={() => setMoreViewsOpen(!moreViewsOpen)} isExpanded={moreViewsOpen} variant="plain" style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '20px', paddingInline: '16px', paddingBlock: '4px' }}>
                  More Views
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem key="all-vulnerable" onClick={() => navigate(v2Routes.vulnerabilitiesAllPath)} description="Findings for user, platform, and inactive images simultaneously">All vulnerable images</DropdownItem>
                <DropdownItem key="inactive" onClick={() => navigate(v2Routes.vulnerabilitiesAllPath)} description="Findings for watched images and images not currently deployed as workloads based on your image retention settings">Inactive images</DropdownItem>
                <DropdownItem key="no-cves" onClick={() => navigate(v2Routes.vulnerabilitiesUserWorkloadsPath)} description="Images and workloads without observed CVEs (results may include false negatives due to scanner limitations, such as unsupported operating systems)">Images without CVEs</DropdownItem>
                <DropdownItem key="k8s" onClick={() => navigate(v2Routes.vulnerabilitiesPlatformPath)} description="Vulnerabilities affecting the underlying Kubernetes infrastructure">Kubernetes components</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection style={{ paddingBottom: 0 }}>
        <Title headingLevel="h1" size="xl" style={{ marginBottom: 8 }}>User Workload Vulnerabilities</Title>
        <Content component="p" style={{ marginBottom: 16 }}>Vulnerabilities affecting user-managed workloads and images</Content>
      </PageSection>

      <PageSection padding={{ default: "noPadding" }}>
        <Tabs activeKey={vulnState} onSelect={(_e, k) => handleVulnStateChange(k)} usePageInsets isBox>
          {VULN_STATES.map((s) => (
            <Tab key={s} eventKey={s} title={<TabTitleText>{VULN_STATE_LABELS[s]}</TabTitleText>} />
          ))}
        </Tabs>
      </PageSection>
      <Divider />

      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Select
                isOpen={savedFiltersOpen}
                onOpenChange={setSavedFiltersOpen}
                toggle={(ref) => (
                  <MenuToggle
                    ref={ref}
                    onClick={() => setSavedFiltersOpen(!savedFiltersOpen)}
                    isExpanded={savedFiltersOpen}
                    icon={selectedSavedFilterName ? <FilterIcon /> : undefined}
                  >
                    {selectedSavedFilterName ? selectedSavedFilterName : "Saved filters"}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {SAVED_FILTER_DROPDOWN_OPTIONS.map((opt) => (
                    <SelectOption key={opt} onClick={() => applyPresetByMenuName(opt)}>
                      {opt}
                    </SelectOption>
                  ))}
                </SelectList>
                <Divider />
                <SelectList>
                  <SelectOption onClick={() => { setSavedFiltersOpen(false); setManageSavedFiltersOpen(true); }}>
                    Manage saved filters
                  </SelectOption>
                </SelectList>
              </Select>
            </ToolbarItem>
            <ToolbarItem><Divider orientation={{ default: "vertical" }} /></ToolbarItem>
            <CompoundSearchFilter onAddFilter={addFilter} />
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <Select
                  isOpen={severityOpen}
                  onOpenChange={setSeverityOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} onClick={() => setSeverityOpen(!severityOpen)} isExpanded={severityOpen}>
                      CVE severity
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {SEVERITIES.map((s) => (
                      <SelectOption key={s} hasCheckbox isSelected={activeFilters.cveSeverity.includes(s)} onClick={() => toggleFilter("cveSeverity", s)}>
                        {s}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </ToolbarItem>
              <ToolbarItem>
                <Select
                  isOpen={cveStatusOpen}
                  onOpenChange={setCveStatusOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} onClick={() => setCveStatusOpen(!cveStatusOpen)} isExpanded={cveStatusOpen}>
                      CVE status
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {CVE_STATUSES.map((s) => (
                      <SelectOption key={s} hasCheckbox isSelected={activeFilters.cveStatus.includes(s)} onClick={() => toggleFilter("cveStatus", s)}>
                        {s}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </ToolbarItem>
            </ToolbarGroup>

            <ToolbarGroup variant="action-group-plain" align={{ default: "alignEnd" }}>
              <ToolbarItem>
                <DefaultFilterModal
                  defaultSeverities={activeFilters.cveSeverity}
                  defaultFixable={activeFilters.cveStatus.includes("Fixable")}
                  onApply={handleDefaultFiltersApply}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  isOpen={createReportOpen}
                  onOpenChange={setCreateReportOpen}
                  popperProps={{ position: 'end' }}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} onClick={() => setCreateReportOpen(!createReportOpen)} isExpanded={createReportOpen} variant="primary">
                      Create report
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="csv" onClick={() => { setCreateReportOpen(false); setCreateReportModalOpen(true); }} description="Export a view-based CSV report using the filters you've applied.">
                      Export report as CSV
                    </DropdownItem>
                    <DropdownItem key="schedule" onClick={() => { setCreateReportOpen(false); navigate(v2Routes.vulnerabilityReportsCreatePath, { state: { filters: activeFilters, savedFilterName: filtersModified ? null : selectedSavedFilterName, filtersModified } }); }} description="Schedule a recurring report based on current filters.">
                      Create scheduled report
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </ToolbarGroup>

            {totalFiltersCount > 0 && (
              <ToolbarGroup aria-label="Applied search filters" className="pf-v6-u-w-100">
                <ToolbarItem className="pf-v6-u-w-100">
                  <Flex gap={{ default: "gapMd" }} flexWrap={{ default: "wrap" }} alignItems={{ default: "alignItemsCenter" }}>
                    <FlexItem>
                      <Content component="p" style={{ margin: 0 }}>{totalFiltersCount} filters applied</Content>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="link" isInline onClick={clearAllFilters}>Clear filters</Button>
                    </FlexItem>
                    {selectedSavedFilterName && filtersModified && (
                      <FlexItem>
                        <Button variant="link" isInline onClick={() => setUpdateFilterModalOpen(true)}>Update saved filter</Button>
                      </FlexItem>
                    )}
                    <FlexItem>
                      <Button variant="link" isInline onClick={() => setSaveFilterModalOpen(true)}>Save as new saved filter</Button>
                    </FlexItem>
                    <FlexItem grow={{ default: "grow" }}>
                      <Flex gap={{ default: "gapSm" }} flexWrap={{ default: "wrap" }}>
                        {Object.entries(activeFilters).map(([key, values]) =>
                          values.length > 0 ? (
                            <LabelGroup key={key} categoryName={formatCategoryName(key)} isClosable onClose={() => { setActiveFilters((p) => ({ ...p, [key]: [] })); setPage(1); }}>
                              {values.map((v) => (
                                <Label key={v} onClose={() => removeFilter(key, v)}>{v}</Label>
                              ))}
                            </LabelGroup>
                          ) : null
                        )}
                      </Flex>
                    </FlexItem>
                  </Flex>
                </ToolbarItem>
              </ToolbarGroup>
            )}
          </ToolbarContent>
        </Toolbar>

        <Flex justifyContent={{ default: "justifyContentSpaceBetween" }} alignItems={{ default: "alignItemsCenter" }} style={{ marginTop: 16, marginBottom: 8 }}>
          <FlexItem>
            <Flex gap={{ default: "gapMd" }} alignItems={{ default: "alignItemsCenter" }}>
              <FlexItem>
                <ToggleGroup aria-label="Entity type toggle">
                  {[
                    { label: `${totalCVEs} CVEs`, key: "CVEs" },
                    { label: `${totalImages} Images`, key: "Images" },
                    { label: `${filteredDeployments.length} Deployments`, key: "Deployments" },
                  ].map(({ label, key }) => (
                    <ToggleGroupItem key={key} text={label} isSelected={activeView === key} onChange={() => setActiveView(key)} />
                  ))}
                </ToggleGroup>
              </FlexItem>
              {totalFiltersCount > 0 && (
                <FlexItem><Label color="blue" icon={<FilterIcon />}>filtered view</Label></FlexItem>
              )}
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex gap={{ default: "gapMd" }} alignItems={{ default: "alignItemsCenter" }}>
              <FlexItem>
                <Select
                  isOpen={columnsOpen}
                  onOpenChange={setColumnsOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} onClick={() => setColumnsOpen(!columnsOpen)} isExpanded={columnsOpen} icon={<CogIcon />}>
                      Columns <Label isCompact color="blue" style={{ marginLeft: 4 }}>{Object.values(visibleColumns).filter(Boolean).length}</Label>
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {[
                      { key: "deployment", label: "Deployment" },
                      { key: "cvesBySeverity", label: "CVEs by severity" },
                      { key: "cluster", label: "Cluster" },
                      { key: "namespace", label: "Namespace" },
                      { key: "images", label: "Images" },
                      { key: "firstDiscovered", label: "First discovered" },
                    ].map(({ key, label }) => (
                      <SelectOption key={key} hasCheckbox isSelected={visibleColumns[key]} onClick={() => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))}>
                        {label}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </FlexItem>
              <FlexItem>
                <Pagination
                  itemCount={activeView === "CVEs" ? cveRows.length : activeView === "Images" ? imageRows.length : filteredDeployments.length}
                  page={page}
                  perPage={perPage}
                  onSetPage={(_, p) => setPage(p)}
                  onPerPageSelect={(_, pp) => { setPerPage(pp); setPage(1); }}
                  variant="top"
                  isCompact
                />
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>

        {workloadLoading ? (
          <div style={{ padding: 24 }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} width="100%" height="40px" style={{ marginBottom: 8 }} />
            ))}
          </div>
        ) : activeView === "CVEs" ? (
          cveRows.length === 0 ? (
            <EmptyState icon={SearchIcon} titleText="No CVEs found" headingLevel="h2">
              <EmptyStateBody>No CVEs match the current filters.</EmptyStateBody>
            </EmptyState>
          ) : (
            <Table aria-label="CVEs table" variant="compact" gridBreakPoint="" isStickyHeader>
              <Thead>
                <Tr>
                  <Th>CVE</Th>
                  <Th>Fixable</Th>
                  <Th>Severity</Th>
                  <Th>CVSS score</Th>
                  <Th>Affected components</Th>
                  <Th>Affected images</Th>
                  <Th>First discovered</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cveRows.slice((page - 1) * perPage, page * perPage).map((cve) => {
                  const sevRaw = deriveCveSeverity(cve);
                  const sevLabel = sevRaw.charAt(0) + sevRaw.slice(1).toLowerCase();
                  const sevColor = { CRITICAL: "red", IMPORTANT: "orange", MODERATE: "gold", LOW: "blue" }[sevRaw] || "grey";
                  const summaryLine = cve.distroTuples?.[0]?.summary || "";
                  const componentHint = summaryLine.trim() ? summaryLine.trim().split(/\s+/)[0] : "—";
                  const scoreVer = cve.distroTuples?.[0]?.scoreVersion || "";
                  return (
                    <Tr key={cve.cve}>
                      <Td>
                        <Flex direction={{ default: "column" }} gap={{ default: "gapNone" }}>
                          <FlexItem><Button variant="link" isInline onClick={() => navigate(`${v2Routes.cveDetailPath}/${cve.cve}`)}>{cve.cve}</Button></FlexItem>
                          <FlexItem><span style={{ fontSize: 12, color: "var(--pf-t--global--text--color--subtle)" }}>{summaryLine}</span></FlexItem>
                        </Flex>
                      </Td>
                      <Td><Label isCompact color="grey">No</Label></Td>
                      <Td><Label isCompact color={sevColor}>{sevLabel}</Label></Td>
                      <Td>{cve.topCVSS}{scoreVer ? ` (${scoreVer})` : ""}</Td>
                      <Td>{componentHint}</Td>
                      <Td>{cve.affectedImageCount} {cve.affectedImageCount === 1 ? "image" : "images"}</Td>
                      <Td style={{ whiteSpace: "nowrap" }}>{formatTimeAgo(cve.firstDiscoveredInSystem || cve.publishedOn)}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )
        ) : activeView === "Images" ? (
          imageRows.length === 0 ? (
            <EmptyState icon={SearchIcon} titleText="No images found" headingLevel="h2">
              <EmptyStateBody>No images match the current filters.</EmptyStateBody>
            </EmptyState>
          ) : (
            <Table aria-label="Images table" variant="compact" gridBreakPoint="" isStickyHeader>
              <Thead>
                <Tr>
                  <Th>Image</Th>
                  <Th>CVEs by severity</Th>
                  <Th>Image status</Th>
                  <Th>Image OS</Th>
                  <Th>Deployments</Th>
                  <Th>First discovered</Th>
                </Tr>
              </Thead>
              <Tbody>
                {imageRows.slice((page - 1) * perPage, page * perPage).map((img) => (
                  <Tr key={img.id}>
                    <Td>
                      <Flex direction={{ default: "column" }} gap={{ default: "gapNone" }}>
                        <FlexItem><Button variant="link" isInline onClick={() => {
                          const baseName = img.name.split(':')[0];
                          const dep = DEPLOYMENTS.find((d) => d.name === baseName || img.name === `${d.name}:latest`);
                          if (dep) navigate(`${v2Routes.deploymentDetailPath}/${dep.id}`);
                        }}>{img.name}</Button></FlexItem>
                        <FlexItem><span style={{ fontSize: 12, color: "var(--pf-t--global--text--color--subtle)" }}>{img.tag}</span></FlexItem>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex gap={{ default: "gapSm" }} alignItems={{ default: "alignItemsCenter" }}>
                        <FlexItem><SeverityBadge count={img.vulnerabilities.critical} severity="critical" /></FlexItem>
                        <FlexItem><SeverityBadge count={img.vulnerabilities.important} severity="important" /></FlexItem>
                        <FlexItem><SeverityBadge count={img.vulnerabilities.moderate} severity="moderate" /></FlexItem>
                        <FlexItem><SeverityBadge count={img.vulnerabilities.low} severity="low" /></FlexItem>
                      </Flex>
                    </Td>
                    <Td><Label isCompact color="green">{img.status}</Label></Td>
                    <Td>{img.os}</Td>
                    <Td>{img.deploymentCount}</Td>
                    <Td style={{ whiteSpace: "nowrap" }}>{formatTimeAgo(img.created)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )
        ) : filteredDeployments.length === 0 ? (
          <EmptyState icon={SearchIcon} titleText="No results found" headingLevel="h2">
            <EmptyStateBody>No deployments match the current filters{vulnState !== "OBSERVED" ? ` in the "${VULN_STATE_LABELS[vulnState]}" view` : ""}.</EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="link" onClick={clearAllFilters}>Clear all filters</Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        ) : (
          <Table aria-label="Vulnerabilities table" variant="compact" gridBreakPoint="" isStickyHeader>
            <Thead>
              <Tr>
                {visibleColumns.deployment && <Th sort={{ sortBy: { index: sortIndex, direction: sortDir }, onSort: (_, i, d) => { setSortIndex(i); setSortDir(d); }, columnIndex: 0 }}>Deployment</Th>}
                {visibleColumns.cvesBySeverity && <Th sort={{ sortBy: { index: sortIndex, direction: sortDir }, onSort: (_, i, d) => { setSortIndex(i); setSortDir(d); }, columnIndex: 1 }}>CVEs by severity</Th>}
                {visibleColumns.cluster && <Th sort={{ sortBy: { index: sortIndex, direction: sortDir }, onSort: (_, i, d) => { setSortIndex(i); setSortDir(d); }, columnIndex: 2 }}>Cluster</Th>}
                {visibleColumns.namespace && <Th sort={{ sortBy: { index: sortIndex, direction: sortDir }, onSort: (_, i, d) => { setSortIndex(i); setSortDir(d); }, columnIndex: 3 }}>Namespace</Th>}
                {visibleColumns.images && <Th sort={{ sortBy: { index: sortIndex, direction: sortDir }, onSort: (_, i, d) => { setSortIndex(i); setSortDir(d); }, columnIndex: 4 }}>Images</Th>}
                {visibleColumns.firstDiscovered && <Th sort={{ sortBy: { index: sortIndex, direction: sortDir }, onSort: (_, i, d) => { setSortIndex(i); setSortDir(d); }, columnIndex: 5 }}>First discovered</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {sortedDeployments.slice((page - 1) * perPage, page * perPage).map((row) => (
                <Tr key={row.id}>
                  {visibleColumns.deployment && (
                    <Td>
                      <Button variant="link" isInline onClick={() => navigate(`${v2Routes.deploymentDetailPath}/${row.id}`)}>{row.name}</Button>
                    </Td>
                  )}
                  {visibleColumns.cvesBySeverity && (
                    <Td>
                      <Flex gap={{ default: "gapSm" }} alignItems={{ default: "alignItemsCenter" }}>
                        <FlexItem><SeverityBadge count={row.imageCVECountBySeverity?.critical?.total || 0} severity="critical" /></FlexItem>
                        <FlexItem><SeverityBadge count={row.imageCVECountBySeverity?.important?.total || 0} severity="important" /></FlexItem>
                        <FlexItem><SeverityBadge count={row.imageCVECountBySeverity?.moderate?.total || 0} severity="moderate" /></FlexItem>
                        <FlexItem><SeverityBadge count={row.imageCVECountBySeverity?.low?.total || 0} severity="low" /></FlexItem>
                      </Flex>
                    </Td>
                  )}
                  {visibleColumns.cluster && (
                    <Td>
                      <Button variant="link" isInline onClick={() => navigate(v2Routes.clustersPath)}>{row.clusterName}</Button>
                    </Td>
                  )}
                  {visibleColumns.namespace && <Td>{row.namespace}</Td>}
                  {visibleColumns.images && <Td>{row.imageCount} {row.imageCount === 1 ? "image" : "images"}</Td>}
                  {visibleColumns.firstDiscovered && <Td>{formatTimeAgo(row.created)}</Td>}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </PageSection>

      <ManageSavedFiltersModalV2
        isOpen={manageSavedFiltersOpen}
        onClose={() => setManageSavedFiltersOpen(false)}
        items={manageFilterItems}
        onReorder={(next) => setManageFilterItems(next)}
        onToggleHidden={() => {}}
        onRename={() => {}}
        onDelete={() => {}}
        onSave={(next) => setManageFilterItems(next)}
      />

      <Modal variant="medium" isOpen={updateFilterModalOpen} onClose={() => setUpdateFilterModalOpen(false)}>
        <ModalHeader
          title={
            selectedSavedFilterName
              ? `Update saved filter – "${selectedSavedFilterName}"?`
              : "Update saved filter?"
          }
        />
        <ModalBody>
          <Content>
            <Content component="p">{updateFilterDiffDescription}</Content>
          </Content>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleUpdateSavedFilter}>Update saved filter</Button>
          <Button variant="link" onClick={() => setUpdateFilterModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal variant="medium" isOpen={createReportModalOpen} onClose={() => { setCreateReportModalOpen(false); setReportSuccess(false); }}>
        <ModalHeader title="Export report as CSV" />
        <ModalBody>
          <Flex direction={{ default: "column" }} gap={{ default: "gapMd" }}>
            <FlexItem>
              <Content><p>Generate a CSV report based on this view and the filters you&apos;ve applied.</p></Content>
            </FlexItem>
            <FlexItem>
              <Card isCompact>
                <CardBody>
                  <Flex direction={{ default: "column" }} gap={{ default: "gapSm" }}>
                    <FlexItem><strong>Report Summary</strong></FlexItem>
                    <FlexItem>
                      <Flex gap={{ default: "gapLg" }}>
                        <FlexItem>Deployments: {filteredDeployments.length}</FlexItem>
                        <FlexItem>CVEs: {totalCVEs}</FlexItem>
                        <FlexItem>Filters: {totalFiltersCount}</FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </FlexItem>
            {reportSuccess && (
              <FlexItem>
                <Alert variant="success" isInline title="Report generation started successfully">
                  <Flex direction={{ default: "column" }} gap={{ default: "gapSm" }}>
                    <FlexItem><strong>Report Name:</strong> workload-vulnerabilities-{new Date().toISOString().slice(0, 10)}</FlexItem>
                    <FlexItem>Report generation may take a few minutes.</FlexItem>
                    <FlexItem>
                      <Button variant="link" isInline icon={<ArrowRightIcon />} onClick={() => navigate(v2Routes.vulnerabilityReportsPath)}>View status in reports table</Button>
                    </FlexItem>
                  </Flex>
                </Alert>
              </FlexItem>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          {!reportSuccess ? (
            <>
              <Button variant="primary" onClick={async () => { await createReport({ filters: activeFilters }); setReportSuccess(true); }} isLoading={reportGenerating} isDisabled={reportGenerating}>
                {reportGenerating ? "Generating..." : "Generate report"}
              </Button>
              <Button variant="link" onClick={() => { setCreateReportModalOpen(false); setReportSuccess(false); }}>Cancel</Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => { setCreateReportModalOpen(false); setReportSuccess(false); }}>Done</Button>
          )}
        </ModalFooter>
      </Modal>

      <Modal variant="small" isOpen={saveFilterModalOpen} onClose={() => setSaveFilterModalOpen(false)}>
        <ModalHeader
          title="Save filters"
          description="All selected filters including scope (if applicable) and parameters will be saved."
        />
        <ModalBody>
          <Form>
            <FormGroup label="Filter name" isRequired fieldId="filter-name-v2">
              <TextInput id="filter-name-v2" value={newFilterName} onChange={(_e, v) => setNewFilterName(v)} placeholder="Front End only" />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleSaveFilters} isDisabled={!newFilterName.trim()}>Save filters</Button>
          <Button variant="link" onClick={() => setSaveFilterModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
