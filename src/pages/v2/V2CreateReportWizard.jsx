import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  ContentVariants,
  Wizard,
  WizardStep,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Checkbox,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  Breadcrumb,
  BreadcrumbItem,
  Divider,
  Button,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Alert,
  Radio,
  Badge,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';
import {
  TimesIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  ExternalLinkAltIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';
import { v2Routes } from '../../routes';
import { addReport, updateReport } from '../../api/reportStore';
import { CLUSTERS, NAMESPACES, DEPLOYMENTS, CVES } from '../../mockData';
import { useLiveSync } from '../../api/hooks';

const SAVED_FILTER_OPTIONS = [
  {
    id: 'sf-1',
    name: 'Front End only',
    filters: {
      clusterName: ['staging-secured-cluster'],
      namespaceName: ['frontend'],
      deploymentName: ['asset-cache', 'tls-proxy', 'wordpress'],
    },
  },
  {
    id: 'sf-2',
    name: 'Infra main',
    filters: {
      clusterName: ['staging-secured-cluster'],
      namespaceName: ['frontend'],
      deploymentName: ['tls-proxy', 'asset-cache'],
    },
  },
  {
    id: 'sf-3',
    name: 'etcd critical',
    filters: {
      clusterName: ['staging-secured-cluster'],
      namespaceName: ['frontend'],
      deploymentName: ['asset-cache', 'tls-proxy', 'wordpress'],
    },
  },
  {
    id: 'sf-4',
    name: 'Cluster warnings',
    filters: {
      clusterName: ['staging-secured-cluster'],
      namespaceName: ['frontend'],
      deploymentName: ['wordpress', 'tls-proxy'],
    },
  },
  {
    id: 'sf-5',
    name: 'Silenced alerts',
    filters: {
      clusterName: ['staging-secured-cluster'],
      namespaceName: ['frontend'],
      deploymentName: ['wordpress'],
    },
  },
  {
    id: 'sf-6',
    name: 'Disabled warnings',
    filters: {
      clusterName: ['staging-secured-cluster'],
      namespaceName: ['frontend'],
      deploymentName: ['asset-cache', 'wordpress'],
    },
  },
];

const SCOPE_ENTITIES = [
  { key: 'Cluster', label: 'Cluster', attributes: ['ID', 'Label', 'Name', 'Platform type', 'Type'] },
  { key: 'Deployment', label: 'Deployment', attributes: ['Annotation', 'ID', 'Label', 'Name'] },
  { key: 'Namespace', label: 'Namespace', attributes: ['Annotation', 'ID', 'Label', 'Name'] },
];

const IMAGE_TYPE_OPTIONS = [
  { value: 'watched', label: 'Watched Images' },
  { value: 'deployed', label: 'Deployed images' },
];

const AREA_OPTIONS = [
  { value: 'user-workloads', label: 'User workloads' },
  { value: 'platform', label: 'Platform' },
  { value: 'all-images', label: 'All vulnerable images' },
];

const VULN_STATE_OPTIONS = [
  { value: 'observed', label: 'Observed' },
  { value: 'deferred', label: 'Deferred' },
  { value: 'false-positives', label: 'False positives' },
];

const CVE_DISCOVERED_OPTIONS = [{ value: 'all', label: 'All time' }];

const CVE_SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical', color: 'red' },
  { value: 'important', label: 'Important', color: 'orange' },
  { value: 'moderate', label: 'Moderate', color: 'gold' },
  { value: 'low', label: 'Low', color: 'blue' },
  { value: 'unknown', label: 'Unknown', color: 'grey' },
];

const CVE_STATUS_OPTIONS = [
  { value: 'fixable', label: 'Fixable' },
  { value: 'not-fixable', label: 'Not fixable' },
];

const IMAGE_COMPONENT_SOURCE_OPTIONS = [
  { value: 'OS', label: 'OS' },
  { value: 'PYTHON', label: 'Python' },
  { value: 'JAVA', label: 'Java' },
  { value: 'RUBY', label: 'Ruby' },
  { value: 'NODEJS', label: 'Node js' },
  { value: 'GO', label: 'Go' },
  { value: 'DOTNETCORERUNTIME', label: 'Dotnet Core Runtime' },
  { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
];

const CVE_FILTER_ENTITIES = [
  {
    key: "CVE", label: "CVE",
    attributes: [
      { key: "cvss", label: "CVSS", inputType: "condition-number" },
      { key: "discoveredTime", label: "Discovered time", inputType: "date-picker" },
      { key: "epss", label: "EPSS probability", inputType: "condition-text" },
      { key: "name", label: "Name", inputType: "autocomplete" },
      { key: "severity", label: "Severity", inputType: "select", options: ["Critical", "Important", "Moderate", "Low", "Unknown"] },
      { key: "status", label: "Status", inputType: "select", options: ["Fixable", "Not fixable"] },
    ],
  },
  {
    key: "Image", label: "Image",
    attributes: [
      { key: "label", label: "Label", inputType: "autocomplete" },
      { key: "name", label: "Name", inputType: "autocomplete" },
      { key: "os", label: "Operating system", inputType: "autocomplete" },
      { key: "registry", label: "Registry", inputType: "autocomplete" },
      { key: "tag", label: "Tag", inputType: "autocomplete" },
    ],
  },
  {
    key: "ImageComponent", label: "Image component",
    attributes: [
      { key: "layerType", label: "Layer type", inputType: "select", options: ["Application", "Base image"] },
      { key: "name", label: "Name", inputType: "autocomplete" },
      { key: "source", label: "Source", inputType: "select", options: ["OS", "Python", "Java", "Ruby", "Node js", "Go", "Dotnet Core Runtime", "Infrastructure"] },
      { key: "version", label: "Version", inputType: "autocomplete" },
    ],
  },
];

function CveCompoundFilter({ selectedSeverities, selectedStatuses, selectedImageComponentSources, onToggleSeverity, onToggleStatus, onToggleImageComponentSource, generalChips, onAddGeneralChip, onRemoveGeneralChip, onClearAll }) {
  const [entityOpen, setEntityOpen] = useState(false);
  const [attrOpen, setAttrOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(CVE_FILTER_ENTITIES[0]);
  const [selectedAttribute, setSelectedAttribute] = useState(CVE_FILTER_ENTITIES[0].attributes[0]);
  const [inputValue, setInputValue] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [conditionOp, setConditionOp] = useState(">");
  const [conditionOpen, setConditionOpen] = useState(false);
  const [acOpen, setAcOpen] = useState(false);
  const acWrapperRef = useRef(null);
  const [acStyle, setAcStyle] = useState({});

  const attr = selectedAttribute;

  const acSuggestions = useMemo(
    () => attr.inputType === 'autocomplete' ? getReportFilterSuggestions(selectedEntity.key, attr.key, inputValue).slice(0, 15) : [],
    [selectedEntity.key, attr.key, attr.inputType, inputValue],
  );

  const updateAcPosition = useCallback(() => {
    if (acWrapperRef.current) {
      const rect = acWrapperRef.current.getBoundingClientRect();
      setAcStyle({
        position: 'fixed',
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        background: 'var(--pf-t--global--background--color--primary--default, #fff)',
        border: '1px solid var(--pf-t--global--border--color--default)',
        borderRadius: 4,
        boxShadow: '0 4px 8px rgba(0,0,0,.12)',
        maxHeight: 250,
        overflowY: 'auto',
      });
    }
  }, []);

  useEffect(() => {
    if (acOpen) updateAcPosition();
  }, [acOpen, inputValue, updateAcPosition]);

  function handleApply(value) {
    if (!value) return;
    if (selectedEntity.key === "CVE" && attr.key === "severity") {
      const sev = value.toLowerCase();
      if (!selectedSeverities.includes(sev)) onToggleSeverity(sev);
    } else if (selectedEntity.key === "CVE" && attr.key === "status") {
      const st = value === "Fixable" ? "fixable" : "not-fixable";
      if (!selectedStatuses.includes(st)) onToggleStatus(st);
    } else if (selectedEntity.key === "ImageComponent" && attr.key === "source") {
      const src = IMAGE_COMPONENT_SOURCE_OPTIONS.find((o) => o.label === value)?.value;
      if (src && !selectedImageComponentSources.includes(src)) onToggleImageComponentSource(src);
    } else {
      const chipText = attr.inputType === "condition-number" || attr.inputType === "condition-text"
        ? `${selectedEntity.label} ${attr.label} ${value}`
        : `${selectedEntity.label} ${attr.label}: ${value}`;
      onAddGeneralChip(chipText);
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
              <TextInputGroupMain value={inputValue} onChange={(_e, v) => setInputValue(v)}
                onKeyDown={(e) => { if (e.key === "Enter" && inputValue.trim()) handleApply(inputValue.trim()); }}
                placeholder="MM/DD/YYYY" type="date" aria-label={`${attr.label} value`} />
              {inputValue && (<TextInputGroupUtilities><Button variant="plain" onClick={() => setInputValue("")} aria-label="Clear"><TimesIcon /></Button></TextInputGroupUtilities>)}
            </TextInputGroup>
          </ToolbarItem>
          <ToolbarItem><Button variant="plain" aria-label="Apply" onClick={() => { if (inputValue.trim()) handleApply(inputValue.trim()); }} icon={<ArrowRightIcon />} /></ToolbarItem>
        </>
      );
    }
    if (attr.inputType === "select" && attr.options) {
      return (
        <ToolbarItem className="pf-v6-u-flex-grow-1">
          <Select isOpen={suggestionsOpen} onOpenChange={setSuggestionsOpen}
            onSelect={(_e, val) => { handleApply(val); setSuggestionsOpen(false); }}
            toggle={(ref) => (<MenuToggle ref={ref} onClick={() => setSuggestionsOpen(!suggestionsOpen)} isExpanded={suggestionsOpen} className="pf-v6-u-w-100">{`Filter by ${selectedEntity.label} ${attr.label.toLowerCase()}`}</MenuToggle>)}>
            <SelectList>
              {attr.options.map((o) => <SelectOption key={o} value={o}>{o}</SelectOption>)}
            </SelectList>
          </Select>
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
            <Select isOpen={conditionOpen} onOpenChange={setConditionOpen} selected={conditionOp}
              onSelect={(_e, val) => { setConditionOp(val); setConditionOpen(false); }}
              toggle={(ref) => (<MenuToggle ref={ref} onClick={() => setConditionOpen(!conditionOpen)} isExpanded={conditionOpen} className="pf-v6-u-flex-shrink-0">{ops.find((o) => o.value === conditionOp)?.label}</MenuToggle>)}>
              <SelectList>{ops.map((o) => <SelectOption key={o.value} value={o.value}>{o.label}</SelectOption>)}</SelectList>
            </Select>
          </ToolbarItem>
          <ToolbarItem className="pf-v6-u-flex-grow-1">
            <TextInputGroup>
              <TextInputGroupMain value={inputValue} onChange={(_e, v) => setInputValue(v)}
                onKeyDown={(e) => { if (e.key === "Enter" && inputValue.trim()) handleApply(`${conditionOp}${inputValue.trim()}`); }}
                placeholder={attr.inputType === "condition-text" ? "0%" : "0"} type="text" aria-label={`${attr.label} value`} />
              {inputValue && (<TextInputGroupUtilities><Button variant="plain" onClick={() => setInputValue("")} aria-label="Clear"><TimesIcon /></Button></TextInputGroupUtilities>)}
            </TextInputGroup>
          </ToolbarItem>
          <ToolbarItem><Button variant="plain" aria-label="Apply" onClick={() => { if (inputValue.trim()) handleApply(`${conditionOp}${inputValue.trim()}`); }} icon={<ArrowRightIcon />} /></ToolbarItem>
        </>
      );
    }
    return (
      <>
        <ToolbarItem className="pf-v6-u-flex-grow-1">
          <div ref={acWrapperRef} style={{ position: 'relative' }}>
            <TextInputGroup>
              <TextInputGroupMain value={inputValue}
                onChange={(_e, v) => { setInputValue(v); setAcOpen(true); }}
                onFocus={() => setAcOpen(true)}
                onKeyDown={(e) => { if (e.key === "Enter" && inputValue.trim()) { handleApply(inputValue.trim()); setAcOpen(false); } }}
                placeholder={`Find results by ${attr.label.toLowerCase()}`} autoComplete="off" aria-label="Filter input" />
              <TextInputGroupUtilities>
                {inputValue && (
                  <Button variant="plain" onClick={() => { setInputValue(""); setAcOpen(false); }} aria-label="Clear"><TimesIcon /></Button>
                )}
                <Button variant="plain" onClick={() => setAcOpen(!acOpen)} aria-label="Toggle suggestions">
                  <ArrowRightIcon style={{ transform: acOpen ? 'rotate(90deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
                </Button>
              </TextInputGroupUtilities>
            </TextInputGroup>
          </div>
        </ToolbarItem>
        <ToolbarItem><Button variant="plain" aria-label="Apply" onClick={() => { if (inputValue.trim()) { handleApply(inputValue.trim()); setAcOpen(false); } }} icon={<ArrowRightIcon />} /></ToolbarItem>
      </>
    );
  }

  const hasChips = selectedSeverities.length > 0 || selectedStatuses.length > 0 || selectedImageComponentSources.length > 0 || generalChips.length > 0;

  return (
    <div>
      <Toolbar style={{ padding: 0 }}>
        <ToolbarContent>
          <ToolbarGroup variant="filter-group" className="pf-v6-u-flex-grow-1">
            <ToolbarItem>
              <Select isOpen={entityOpen} onOpenChange={setEntityOpen} selected={selectedEntity.key}
                onSelect={(_e, val) => { const ent = CVE_FILTER_ENTITIES.find((e) => e.key === val); setSelectedEntity(ent); setSelectedAttribute(ent.attributes[0]); setEntityOpen(false); setInputValue(""); setAcOpen(false); }}
                toggle={(ref) => (<MenuToggle ref={ref} onClick={() => setEntityOpen(!entityOpen)} isExpanded={entityOpen} className="pf-v6-u-flex-shrink-0">{selectedEntity.label}</MenuToggle>)}>
                <SelectList>{CVE_FILTER_ENTITIES.map((e) => <SelectOption key={e.key} value={e.key}>{e.label}</SelectOption>)}</SelectList>
              </Select>
            </ToolbarItem>
            <ToolbarItem>
              <Select isOpen={attrOpen} onOpenChange={setAttrOpen} selected={attr.key}
                onSelect={(_e, val) => { setSelectedAttribute(selectedEntity.attributes.find((a) => a.key === val)); setAttrOpen(false); setInputValue(""); setAcOpen(false); }}
                toggle={(ref) => (<MenuToggle ref={ref} onClick={() => setAttrOpen(!attrOpen)} isExpanded={attrOpen} className="pf-v6-u-flex-shrink-0">{attr.label}</MenuToggle>)}>
                <SelectList>{selectedEntity.attributes.map((a) => <SelectOption key={a.key} value={a.key} isSelected={a.key === attr.key}>{a.label}</SelectOption>)}</SelectList>
              </Select>
            </ToolbarItem>
            {renderValueInput()}
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      {acOpen && acSuggestions.length > 0 && (
        <div style={acStyle}>
          {acSuggestions.map((s, i) => (
            <div key={i} role="option" tabIndex={0}
              style={{ padding: '8px 12px', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--pf-t--global--background--color--primary--hover, #f0f0f0)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              onClick={() => { handleApply(s); setAcOpen(false); }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
      {hasChips && (
        <Flex gap={{ default: 'gapSm' }} style={{ marginTop: 12 }} wrap={{ default: 'wrap' }} alignItems={{ default: 'alignItemsCenter' }}>
          {selectedSeverities.length > 0 && (
            <FlexItem>
              <LabelGroup categoryName="CVE severity" isClosable onClose={() => onClearAll('severity')}>
                {selectedSeverities.map((sev) => {
                  const opt = CVE_SEVERITY_OPTIONS.find((o) => o.value === sev);
                  return <Label key={sev} onClose={() => onToggleSeverity(sev)}>{opt?.label}</Label>;
                })}
              </LabelGroup>
            </FlexItem>
          )}
          {selectedStatuses.length > 0 && (
            <FlexItem>
              <LabelGroup categoryName="CVE status" isClosable onClose={() => onClearAll('status')}>
                {selectedStatuses.map((status) => {
                  const opt = CVE_STATUS_OPTIONS.find((o) => o.value === status);
                  return <Label key={status} onClose={() => onToggleStatus(status)}>{opt?.label}</Label>;
                })}
              </LabelGroup>
            </FlexItem>
          )}
          {selectedImageComponentSources.length > 0 && (
            <FlexItem>
              <LabelGroup categoryName="Image component source" isClosable onClose={() => onClearAll('imageComponentSource')}>
                {selectedImageComponentSources.map((src) => {
                  const opt = IMAGE_COMPONENT_SOURCE_OPTIONS.find((o) => o.value === src);
                  return <Label key={src} onClose={() => onToggleImageComponentSource(src)}>{opt?.label}</Label>;
                })}
              </LabelGroup>
            </FlexItem>
          )}
          {generalChips.map((chip, idx) => (
            <FlexItem key={idx}>
              <Label onClose={() => onRemoveGeneralChip(idx)}>{chip}</Label>
            </FlexItem>
          ))}
          <FlexItem>
            <Button variant="link" isInline onClick={() => { onClearAll('all'); }}>Clear filters</Button>
          </FlexItem>
        </Flex>
      )}
    </div>
  );
}

const EMAIL_NOTIFIERS = [
  { id: 'email-1', name: 'Security Team Email' },
  { id: 'email-2', name: 'DevOps Alerts' },
];

const SCHEDULE_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function savedFilterToChips(savedFilterId) {
  const opt = SAVED_FILTER_OPTIONS.find((o) => o.id === savedFilterId);
  if (!opt?.filters) return [];
  const { clusterName = [], namespaceName = [], deploymentName = [] } = opt.filters;
  const chips = [];
  clusterName.forEach((v) => chips.push({ id: `c-${v}`, text: `Cluster name: ${v}` }));
  namespaceName.forEach((v) => chips.push({ id: `n-${v}`, text: `Namespace name: ${v}` }));
  deploymentName.forEach((v) => chips.push({ id: `d-${v}`, text: `Deployment name: ${v}` }));
  return chips;
}

function chipTextsToFilterParams(chipTexts) {
  const filters = {};
  chipTexts.forEach((text) => {
    const match = text.match(/^(.+?):\s*(.+)$/);
    if (!match) return;
    const [, label, value] = match;
    const key = label.trim().toLowerCase();
    const LABEL_TO_KEY = {
      'cluster name': 'clusterName', 'cluster id': 'clusterId', 'cluster label': 'clusterLabel',
      'cluster platform type': 'clusterPlatformType', 'cluster type': 'clusterType',
      'deployment name': 'deploymentName', 'deployment annotation': 'deploymentAnnotation',
      'deployment id': 'deploymentId', 'deployment label': 'deploymentLabel',
      'namespace name': 'namespaceName', 'namespace annotation': 'namespaceAnnotation',
      'namespace id': 'namespaceId', 'namespace label': 'namespaceLabel',
    };
    const filterKey = LABEL_TO_KEY[key];
    if (filterKey) {
      if (!filters[filterKey]) filters[filterKey] = [];
      filters[filterKey].push(value.trim());
    }
  });
  return filters;
}

function buildLiveResultUrl(basePath, chipTexts, savedFilterName) {
  const filters = chipTextsToFilterParams(chipTexts);
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, values]) => {
    values.forEach((v) => params.append(key, v));
  });
  if (savedFilterName) params.set('savedFilter', savedFilterName);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function groupChipsByCategory(chips) {
  const groups = {};
  chips.forEach((chip) => {
    const match = (typeof chip === 'string' ? chip : chip.text).match(/^(.+?):\s*(.+)$/);
    if (match) {
      const category = match[1].trim();
      if (!groups[category]) groups[category] = [];
      groups[category].push(chip);
    } else {
      const cat = 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(chip);
    }
  });
  return groups;
}

function collectUnique(arr) { return [...new Set(arr)].sort(); }

function getScopeSuggestions(entityKey, attribute, inputValue) {
  const q = (inputValue || '').toLowerCase();
  const filter = (items) => items.filter((i) => i.toLowerCase().includes(q));
  if (entityKey === 'Cluster') {
    if (attribute === 'Name') return filter(CLUSTERS.map((c) => c.name));
    if (attribute === 'ID') return filter(CLUSTERS.map((c) => c.id));
    if (attribute === 'Label') return filter(collectUnique(CLUSTERS.flatMap((c) => Object.entries(c.labels || {}).map(([k, v]) => `${k}=${v}`))));
    if (attribute === 'Platform type') return filter(collectUnique(CLUSTERS.map((c) => c.provider || 'Kubernetes')));
    if (attribute === 'Type') return filter(collectUnique(CLUSTERS.map((c) => c.type || 'KUBERNETES_CLUSTER')));
  }
  if (entityKey === 'Namespace') {
    if (attribute === 'Name') return filter([...new Set(NAMESPACES.map((n) => n.metadata?.name || n.name))]);
    if (attribute === 'ID') return filter(NAMESPACES.map((n) => n.metadata?.id || n.id));
    if (attribute === 'Annotation') return filter(['kubernetes.io/metadata.name', 'openshift.io/sa.scc.uid-range', 'openshift.io/node-selector']);
    if (attribute === 'Label') return filter(['kubernetes.io/metadata.name', 'pod-security.kubernetes.io/enforce=privileged', 'security.openshift.io/scc.podSecurityLabelSync=true']);
  }
  if (entityKey === 'Deployment') {
    if (attribute === 'Name') return filter([...new Set(DEPLOYMENTS.map((d) => d.name))]);
    if (attribute === 'ID') return filter(DEPLOYMENTS.map((d) => d.id));
    if (attribute === 'Annotation') return filter(collectUnique(DEPLOYMENTS.flatMap((d) => Object.entries(d.annotations || {}).map(([k, v]) => `${k}=${v}`))).concat(['deployment.kubernetes.io/revision=1']));
    if (attribute === 'Label') return filter(collectUnique(DEPLOYMENTS.flatMap((d) => Object.entries(d.labels || {}).map(([k, v]) => `${k}=${v}`))));
  }
  return [];
}

function getReportFilterSuggestions(entityKey, attributeKey, inputValue) {
  const q = (inputValue || '').toLowerCase();
  const filter = (items) => items.filter((i) => i.toLowerCase().includes(q));
  if (entityKey === 'CVE') {
    if (attributeKey === 'name') return filter(CVES.map((c) => c.cve).slice(0, 50));
  }
  if (entityKey === 'Image') {
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
    if (attributeKey === 'name') return filter(imageFullNames);
    if (attributeKey === 'tag') return filter(["latest", "v4.16", "v4.7.0", "2.6.3", "1.25-alpine", "7.2-bookworm", "16.2-bullseye", "v2.3.1", "v1.8.0", "20-slim", "9.4", "v0.27.0", "10.4.1", "v0.14.0", "v1.0.0"]);
    if (attributeKey === 'registry') return filter(["registry.redhat.io", "docker.io", "quay.io", "gcr.io", "ghcr.io"]);
    if (attributeKey === 'os') return filter(['linux', 'rhel', 'centos', 'ubuntu', 'alpine', 'debian']);
    if (attributeKey === 'label') return filter(["io.buildah.version=1.29.0", "architecture=x86_64", "vendor=Red Hat, Inc.", "com.redhat.component=ose-machine-config-operator-container", "maintainer=Red Hat"]);
  }
  if (entityKey === 'ImageComponent') {
    if (attributeKey === 'name') {
      return filter(collectUnique(CVES.flatMap((c) => {
        const s = c.distroTuples?.[0]?.summary?.trim();
        return s ? [s.split(/\s+/)[0]] : [];
      })));
    }
    if (attributeKey === 'version') return filter(['1.0', '2.0', '3.0', 'latest']);
  }
  if (entityKey === 'Deployment') {
    if (attributeKey === 'name') return filter(collectUnique(DEPLOYMENTS.map((d) => d.name)));
    if (attributeKey === 'id') return filter(DEPLOYMENTS.map((d) => d.id));
    if (attributeKey === 'annotation') return filter(collectUnique(DEPLOYMENTS.flatMap((d) => Object.entries(d.annotations || {}).map(([k, v]) => `${k}=${v}`))).concat(['deployment.kubernetes.io/revision=1']));
    if (attributeKey === 'label') return filter(collectUnique(DEPLOYMENTS.flatMap((d) => Object.entries(d.labels || {}).map(([k, v]) => `${k}=${v}`))));
  }
  if (entityKey === 'Namespace') {
    if (attributeKey === 'name') return filter(collectUnique(NAMESPACES.map((n) => n.metadata?.name || n.name)));
    if (attributeKey === 'id') return filter(NAMESPACES.map((n) => n.metadata?.id || n.id));
    if (attributeKey === 'annotation') return filter(['kubernetes.io/metadata.name', 'openshift.io/sa.scc.uid-range']);
    if (attributeKey === 'label') return filter(['kubernetes.io/metadata.name', 'pod-security.kubernetes.io/enforce=privileged']);
  }
  if (entityKey === 'Cluster') {
    if (attributeKey === 'name') return filter(CLUSTERS.map((c) => c.name));
    if (attributeKey === 'id') return filter(CLUSTERS.map((c) => c.id));
    if (attributeKey === 'label') return filter(collectUnique(CLUSTERS.flatMap((c) => Object.entries(c.labels || {}).map(([k, v]) => `${k}=${v}`))));
    if (attributeKey === 'platformType') return filter(collectUnique(CLUSTERS.map((c) => c.provider || 'Kubernetes')));
    if (attributeKey === 'type') return filter(collectUnique(CLUSTERS.map((c) => c.type || 'KUBERNETES_CLUSTER')));
  }
  return [];
}

function ScopeDefineToolbar({ onAddChip, showHeading = true, liveResultUrl }) {
  const [entityOpen, setEntityOpen] = useState(false);
  const [attrOpen, setAttrOpen] = useState(false);
  const [entityKey, setEntityKey] = useState('Deployment');
  const [attribute, setAttribute] = useState('Name');
  const [search, setSearch] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const inputWrapperRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const entity = SCOPE_ENTITIES.find((e) => e.key === entityKey) || SCOPE_ENTITIES[0];

  const suggestions = useMemo(
    () => getScopeSuggestions(entityKey, attribute, search).slice(0, 15),
    [entityKey, attribute, search],
  );

  const updateDropdownPosition = useCallback(() => {
    if (inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        background: 'var(--pf-t--global--background--color--primary--default, #fff)',
        border: '1px solid var(--pf-t--global--border--color--default)',
        borderRadius: 4,
        boxShadow: '0 4px 8px rgba(0,0,0,.12)',
        maxHeight: 250,
        overflowY: 'auto',
      });
    }
  }, []);

  useEffect(() => {
    if (suggestionsOpen) updateDropdownPosition();
  }, [suggestionsOpen, search, updateDropdownPosition]);

  const applyValue = (val) => {
    if (!val) return;
    onAddChip(`${entity.label} ${attribute.toLowerCase()}: ${val}`);
    setSearch('');
    setSuggestionsOpen(false);
  };

  const applySearch = () => {
    const q = search.trim();
    if (q) applyValue(q);
  };

  return (
    <div>
      {showHeading && (
        <Content component={ContentVariants.p} style={{ marginBottom: 8, fontWeight: 600 }}>
          Define scope
        </Content>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <Select
          isOpen={entityOpen}
          onOpenChange={setEntityOpen}
          selected={entity.key}
          onSelect={(_e, val) => {
            const next = SCOPE_ENTITIES.find((e) => e.key === val);
            if (next) {
              setEntityKey(next.key);
              if (!next.attributes.includes(attribute)) setAttribute(next.attributes[0]);
            }
            setEntityOpen(false);
            setSearch('');
            setSuggestionsOpen(false);
          }}
          toggle={(ref) => (
            <MenuToggle ref={ref} onClick={() => setEntityOpen(!entityOpen)} isExpanded={entityOpen} style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
              {entity.label}
            </MenuToggle>
          )}
        >
          <SelectList>
            {SCOPE_ENTITIES.map((e) => (
              <SelectOption key={e.key} value={e.key}>{e.label}</SelectOption>
            ))}
          </SelectList>
        </Select>
        <Select
          isOpen={attrOpen}
          onOpenChange={setAttrOpen}
          selected={attribute}
          onSelect={(_e, val) => {
            setAttribute(val);
            setAttrOpen(false);
            setSearch('');
            setSuggestionsOpen(false);
          }}
          toggle={(ref) => (
            <MenuToggle ref={ref} onClick={() => setAttrOpen(!attrOpen)} isExpanded={attrOpen} style={{ borderRadius: 0 }}>
              {attribute}
            </MenuToggle>
          )}
        >
          <SelectList>
            {entity.attributes.map((a) => (
              <SelectOption key={a} value={a}>{a}</SelectOption>
            ))}
          </SelectList>
        </Select>
        <div ref={inputWrapperRef} style={{ flex: 1 }}>
          <TextInputGroup style={{ borderRadius: 0 }}>
            <TextInputGroupMain
              value={search}
              onChange={(_e, v) => { setSearch(v); setSuggestionsOpen(true); }}
              onFocus={() => setSuggestionsOpen(true)}
              onKeyDown={(e) => { if (e.key === 'Enter') applySearch(); }}
              placeholder="Filter by value"
              aria-label="Scope search"
              autoComplete="off"
            />
            <TextInputGroupUtilities>
              {search && (
                <Button variant="plain" onClick={() => { setSearch(''); setSuggestionsOpen(false); }} aria-label="Clear">
                  <TimesIcon />
                </Button>
              )}
              <Button variant="plain" onClick={() => setSuggestionsOpen(!suggestionsOpen)} aria-label="Toggle suggestions">
                <ArrowRightIcon style={{ transform: suggestionsOpen ? 'rotate(90deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
              </Button>
            </TextInputGroupUtilities>
          </TextInputGroup>
        </div>
        <Button variant="plain" aria-label="Apply" onClick={applySearch} icon={<ArrowRightIcon />} />
        {liveResultUrl && (
          <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end"
            onClick={() => window.open(liveResultUrl, '_blank')}
            style={{ marginLeft: 8, whiteSpace: 'nowrap' }}
          >
            View live result
          </Button>
        )}
      </div>
      {suggestionsOpen && suggestions.length > 0 && (
        <div style={dropdownStyle}>
          {suggestions.map((s, i) => (
            <div key={i} role="option" tabIndex={0}
              style={{ padding: '8px 12px', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--pf-t--global--background--color--primary--hover, #f0f0f0)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              onClick={() => applyValue(s)}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function V2CreateReportWizard() {
  useLiveSync();
  const navigate = useNavigate();
  const location = useLocation();
  const incomingFilters = location.state?.filters;
  const incomingSavedFilterName = location.state?.savedFilterName;
  const incomingFiltersModified = location.state?.filtersModified;
  const editReport = location.state?.editReport;
  const isEditMode = Boolean(editReport);
  const reportsPath = v2Routes.vulnerabilityReportsPath;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [savedFilterOpen, setSavedFilterOpen] = useState(false);

  const [formValues, setFormValues] = useState(() => {
    const defaults = {
      name: '',
      description: '',
      scopeMethod: 'saved-filters',
      selectedSavedFilter: null,
      scopeExtraChips: [],
      removedBaseChipIds: [],
      imageNameChips: [],
      selectedImageComponentSources: [],
      generalFilterChips: [],
      areaOfConcern: 'user-workloads',
      vulnerabilityState: 'observed',
      selectedImageTypes: ['watched', 'deployed'],
      selectedCveSeverities: ['critical', 'important'],
      selectedCveStatuses: ['fixable'],
      cveDiscoveredSince: 'all',
      selectedNotifiers: [],
      distributionList: '',
      scheduleType: 'weekly',
    };

    if (editReport) {
      defaults.name = editReport.name || '';
      defaults.description = editReport.description || '';
      if (editReport.scopeMethod) defaults.scopeMethod = editReport.scopeMethod;
      if (editReport.savedFilter) {
        const matched = SAVED_FILTER_OPTIONS.find((f) => f.name === editReport.savedFilter);
        if (matched) defaults.selectedSavedFilter = matched.id;
      }
      if (editReport.cveSeverities?.length) {
        defaults.selectedCveSeverities = editReport.cveSeverities.map((s) => s.toLowerCase());
      }
      if (editReport.cveStatus) {
        if (editReport.cveStatus.toLowerCase().includes('not fixable')) {
          defaults.selectedCveStatuses = ['fixable', 'not-fixable'];
        } else if (editReport.cveStatus.toLowerCase().includes('fixable')) {
          defaults.selectedCveStatuses = ['fixable'];
        }
      }
      if (editReport.imageType?.length) {
        defaults.selectedImageTypes = editReport.imageType.map((t) =>
          t.toLowerCase().includes('watched') ? 'watched' : 'deployed'
        );
      }
      if (editReport.schedule) {
        const sched = editReport.schedule.toLowerCase();
        if (sched.includes('daily')) defaults.scheduleType = 'daily';
        else if (sched.includes('monthly')) defaults.scheduleType = 'monthly';
        else defaults.scheduleType = 'weekly';
      }
      if (editReport.deliveryEmail) {
        defaults.selectedNotifiers = ['email-1'];
        defaults.distributionList = editReport.deliveryEmail;
      }
      return defaults;
    }

    if (!incomingFilters) return defaults;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    defaults.name = `Vulnerability Report - ${dateStr} ${timeStr}`;

    const inCluster = [...(incomingFilters.clusterName || [])].sort();
    const inNamespace = [...(incomingFilters.namespaceName || [])].sort();
    const inDeployment = [...(incomingFilters.deploymentName || [])].sort();
    const hasResourceFilters = inCluster.length || inNamespace.length || inDeployment.length;

    if (incomingFiltersModified) {
      defaults.scopeMethod = 'custom-filters';
      defaults.selectedSavedFilter = null;
      const chips = [];
      (incomingFilters.clusterName || []).forEach((v) => chips.push(`Cluster name: ${v}`));
      (incomingFilters.namespaceName || []).forEach((v) => chips.push(`Namespace name: ${v}`));
      (incomingFilters.deploymentName || []).forEach((v) => chips.push(`Deployment name: ${v}`));
      defaults.scopeExtraChips = chips;
    } else if (hasResourceFilters) {
      const arrEq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
      let matchedSavedFilter = null;

      if (incomingSavedFilterName) {
        const byName = SAVED_FILTER_OPTIONS.find((f) => f.name === incomingSavedFilterName);
        if (byName?.filters) {
          const sc = [...(byName.filters.clusterName || [])].sort();
          const sn = [...(byName.filters.namespaceName || [])].sort();
          const sd = [...(byName.filters.deploymentName || [])].sort();
          if (arrEq(inCluster, sc) && arrEq(inNamespace, sn) && arrEq(inDeployment, sd)) {
            matchedSavedFilter = byName;
          }
        }
      }

      if (!matchedSavedFilter) {
        for (const sf of SAVED_FILTER_OPTIONS) {
          if (!sf.filters) continue;
          const sc = [...(sf.filters.clusterName || [])].sort();
          const sn = [...(sf.filters.namespaceName || [])].sort();
          const sd = [...(sf.filters.deploymentName || [])].sort();
          if (arrEq(inCluster, sc) && arrEq(inNamespace, sn) && arrEq(inDeployment, sd)) {
            matchedSavedFilter = sf;
            break;
          }
        }
      }

      if (matchedSavedFilter) {
        defaults.scopeMethod = 'saved-filters';
        defaults.selectedSavedFilter = matchedSavedFilter.id;
      } else {
        defaults.scopeMethod = 'custom-filters';
        defaults.selectedSavedFilter = null;
        const chips = [];
        (incomingFilters.clusterName || []).forEach((v) => chips.push(`Cluster name: ${v}`));
        (incomingFilters.namespaceName || []).forEach((v) => chips.push(`Namespace name: ${v}`));
        (incomingFilters.deploymentName || []).forEach((v) => chips.push(`Deployment name: ${v}`));
        defaults.scopeExtraChips = chips;
      }
    } else if (incomingSavedFilterName) {
      const match = SAVED_FILTER_OPTIONS.find((f) => f.name === incomingSavedFilterName);
      if (match) {
        defaults.scopeMethod = 'saved-filters';
        defaults.selectedSavedFilter = match.id;
      }
    }

    if (incomingFilters.cveSeverity?.length) {
      defaults.selectedCveSeverities = incomingFilters.cveSeverity.map((s) => s.toLowerCase());
    }
    if (incomingFilters.cveStatus?.length) {
      defaults.selectedCveStatuses = incomingFilters.cveStatus.map((s) =>
        s.toLowerCase().replace(/\s+/g, '-')
      );
    }

    const filterKeyToChipLabel = {
      imageName: 'Image Name',
      imageLabel: 'Image Label',
      imageOs: 'Image Operating system',
      imageRegistry: 'Image Registry',
      imageTag: 'Image Tag',
      imageComponentName: 'Image component Name',
      imageComponentLayerType: 'Image component Layer type',
      imageComponentSource: 'Image component Source',
      imageComponentVersion: 'Image component Version',
      cveName: 'CVE Name',
      cveCvss: 'CVE CVSS',
      cveEpss: 'CVE EPSS probability',
      cveDiscoveredTime: 'CVE Discovered time',
    };
    const chips = [];
    Object.entries(filterKeyToChipLabel).forEach(([key, label]) => {
      (incomingFilters[key] || []).forEach((val) => chips.push(`${label}: ${val}`));
    });
    if (chips.length > 0) {
      defaults.generalFilterChips = chips;
    }

    return defaults;
  });

  const [dropdownStates, setDropdownStates] = useState({
    areaOfConcern: false,
    vulnState: false,
    imageType: false,
    cveDiscovered: false,
    schedule: false,
  });

  const toggleDropdown = (key) => {
    setDropdownStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFormValue = (keyOrUpdates, value) => {
    if (typeof keyOrUpdates === 'object' && value === undefined) {
      setFormValues((prev) => ({ ...prev, ...keyOrUpdates }));
    } else {
      setFormValues((prev) => ({ ...prev, [keyOrUpdates]: value }));
    }
  };

  const toggleSelection = (key, value) => {
    setFormValues((prev) => {
      const current = prev[key];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((v) => v !== value) };
      }
      return { ...prev, [key]: [...current, value] };
    });
  };

  const handleCancel = () => setShowCancelModal(true);
  const handleConfirmCancel = () => navigate(reportsPath);
  const handleSave = () => {
    const reportData = {
      name: formValues.name,
      description: formValues.description,
      savedFilter: formValues.selectedSavedFilter?.name || "",
      scopeMethod: formValues.scopeMethod,
      schedule: formValues.scheduleFrequency || "Weekly on Monday",
      deliveryEmail: formValues.deliveryEmail || "admin@example.com",
      deliveryEmails: formValues.deliveryEmails || "",
      imageType: formValues.imageType || ["Deployed images", "Watched images"],
      cveSeverities: formValues.cveSeverity || [],
      cveStatus: formValues.cveStatus || "",
      scopeFilters: formValues.scopeExtraChips || [],
      cveFilters: {},
    };
    if (isEditMode && editReport.id) {
      updateReport(editReport.id, reportData);
      navigate(`${v2Routes.vulnerabilityReportDetailPath}/${editReport.id}`);
    } else {
      const newReport = addReport(reportData);
      navigate(`${v2Routes.vulnerabilityReportDetailPath}/${newReport.id}`);
    }
  };

  const baseScopeChips = useMemo(
    () => {
      if (formValues.scopeMethod !== 'saved-filters' || !formValues.selectedSavedFilter) return [];
      const all = savedFilterToChips(formValues.selectedSavedFilter);
      return all.filter((c) => !formValues.removedBaseChipIds.includes(c.id));
    },
    [formValues.scopeMethod, formValues.selectedSavedFilter, formValues.removedBaseChipIds],
  );

  const scopeDisplayChips = useMemo(() => {
    const extra = formValues.scopeExtraChips.map((c, i) => ({ id: `extra-${i}-${c}`, text: c }));
    return [...baseScopeChips, ...extra];
  }, [baseScopeChips, formValues.scopeExtraChips]);

  const scopeFilterCount = scopeDisplayChips.length;

  const addScopeExtra = useCallback(
    (text) => {
      setFormValues((prev) => {
        if (prev.scopeMethod === 'saved-filters') {
          const remainingBaseTexts = savedFilterToChips(prev.selectedSavedFilter)
            .filter((c) => !prev.removedBaseChipIds.includes(c.id))
            .map((c) => c.text);
          return {
            ...prev,
            scopeMethod: 'custom-filters',
            scopeExtraChips: [...remainingBaseTexts, ...prev.scopeExtraChips, text],
            selectedSavedFilter: null,
            removedBaseChipIds: [],
          };
        }
        return { ...prev, scopeExtraChips: [...prev.scopeExtraChips, text] };
      });
    },
    [],
  );

  const removeScopeExtraAt = useCallback((idx) => {
    setFormValues((prev) => ({
      ...prev,
      scopeExtraChips: prev.scopeExtraChips.filter((_, i) => i !== idx),
    }));
  }, []);

  const isStep1Valid = formValues.name.trim() !== '';
  const isStep2Valid =
    formValues.scopeMethod === 'saved-filters'
      ? formValues.selectedSavedFilter != null
      : true;
  const isStep3Valid =
    formValues.selectedImageTypes.length > 0
    && formValues.selectedCveSeverities.length > 0
    && Boolean(formValues.cveDiscoveredSince);

  return (
    <>
      <PageSection  padding={{ default: 'noPadding' }}>
        <div style={{ padding: '24px 24px 0 24px' }}>
          <Breadcrumb>
            <BreadcrumbItem to={reportsPath}>Reports</BreadcrumbItem>
            <BreadcrumbItem isActive>{isEditMode ? 'Edit report' : 'Create report'}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Divider style={{ marginTop: 16 }} />
      </PageSection>

      <PageSection >
        <Content>
          <Title headingLevel="h1">{isEditMode ? 'Edit report' : 'Create report'}</Title>
          <Content component={ContentVariants.p}>
            Configure reports, define scope, and assign delivery destinations to report on vulnerabilities across the organization.
          </Content>
        </Content>
      </PageSection>

      <PageSection padding={{ default: 'noPadding' }}>
        <Wizard onSave={handleSave} onClose={handleCancel}>
          <WizardStep
            name="Details"
            id="step-details"
            footer={{
              isNextDisabled: !isStep1Valid,
              onClose: handleCancel,
            }}
          >
            <div style={{ padding: 24, maxWidth: 650 }}>
              <Title headingLevel="h2" style={{ marginBottom: 24 }}>
                Details
              </Title>
              <Form>
                <FormGroup label="Report name" isRequired fieldId="report-name">
                  <TextInput
                    isRequired
                    id="report-name"
                    value={formValues.name}
                    onChange={(_e, value) => updateFormValue('name', value)}
                    placeholder="Enter report name"
                  />
                </FormGroup>
                <FormGroup label="Description" fieldId="report-description">
                  <TextArea
                    id="report-description"
                    value={formValues.description}
                    onChange={(_e, value) => updateFormValue('description', value)}
                    placeholder="Enter a description for this report"
                    rows={3}
                  />
                </FormGroup>
              </Form>
            </div>
          </WizardStep>

          <WizardStep
            name="Resources"
            id="step-resources"
            isDisabled={!isStep1Valid}
            footer={{
              isNextDisabled: !isStep2Valid,
              onClose: handleCancel,
            }}
          >
            <>
              <div style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                <Flex direction={{ default: 'column' }} style={{ padding: '16px 24px' }}>
                  <FlexItem>
                    <Title headingLevel="h2">Configure scope</Title>
                  </FlexItem>
                  <FlexItem>
                    <Content component={ContentVariants.p} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Select a method to define the scope of the report
                    </Content>
                  </FlexItem>
                </Flex>
              </div>
              <Divider />
              <Form style={{ padding: 24 }}>
                <FormGroup label="Scope method" isRequired fieldId="scope-method">
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                    <FlexItem>
                      <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>
                          <Radio
                            id="scope-saved"
                            name="scope-method"
                            label={
                              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <span>Use saved filters</span>
                                <InfoCircleIcon color="var(--pf-t--global--icon--color--status--info--default)" />
                                <Badge isRead>New</Badge>
                              </Flex>
                            }
                            description="Define scope using existing saved filters"
                            isChecked={formValues.scopeMethod === 'saved-filters'}
                            onChange={() => updateFormValue('scopeMethod', 'saved-filters')}
                          />
                        </FlexItem>
                        {formValues.scopeMethod === 'saved-filters' && (
                          <FlexItem style={{ paddingLeft: 24 }}>
                            <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }} wrap={{ default: 'wrap' }}>
                              <FlexItem>
                                <Select
                                  isOpen={savedFilterOpen}
                                  onOpenChange={setSavedFilterOpen}
                                  selected={formValues.selectedSavedFilter}
                                  onSelect={(_e, val) => {
                                    updateFormValue('selectedSavedFilter', val);
                                    updateFormValue('scopeExtraChips', []);
                                    updateFormValue('removedBaseChipIds', []);
                                    setSavedFilterOpen(false);
                                  }}
                                  toggle={(ref) => (
                                    <MenuToggle
                                      ref={ref}
                                      onClick={() => setSavedFilterOpen(!savedFilterOpen)}
                                      isExpanded={savedFilterOpen}
                                      style={{ minWidth: 200 }}
                                    >
                                      {SAVED_FILTER_OPTIONS.find((f) => f.id === formValues.selectedSavedFilter)?.name
                                        || 'Select a saved filter'}
                                    </MenuToggle>
                                  )}
                                >
                                  <SelectList>
                                    {SAVED_FILTER_OPTIONS.map((f) => (
                                      <SelectOption key={f.id} value={f.id}>
                                        {f.name}
                                      </SelectOption>
                                    ))}
                                  </SelectList>
                                </Select>
                              </FlexItem>
                            </Flex>
                          </FlexItem>
                        )}
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Radio
                        id="scope-custom"
                        name="scope-method"
                        label="Custom filters"
                        description="define scope using your own filters"
                        isChecked={formValues.scopeMethod === 'custom-filters'}
                        onChange={() => {
                          if (formValues.scopeMethod !== 'custom-filters') {
                            updateFormValue('scopeExtraChips', []);
                          }
                          updateFormValue('scopeMethod', 'custom-filters');
                        }}
                      />
                    </FlexItem>
                  </Flex>
                </FormGroup>

                {(formValues.scopeMethod === 'saved-filters' && formValues.selectedSavedFilter) || formValues.scopeMethod === 'custom-filters' ? (() => {
                  const allChipTexts = [...baseScopeChips.map((c) => c.text), ...formValues.scopeExtraChips];
                  const isScopeModified = formValues.scopeMethod === 'saved-filters'
                    && (formValues.removedBaseChipIds.length > 0 || formValues.scopeExtraChips.length > 0);
                  const liveResultSavedName = (formValues.scopeMethod === 'saved-filters' && !isScopeModified)
                    ? SAVED_FILTER_OPTIONS.find((f) => f.id === formValues.selectedSavedFilter)?.name || null
                    : null;
                  const liveResultUrl = buildLiveResultUrl(v2Routes.vulnerabilitiesUserWorkloadsPath, allChipTexts, liveResultSavedName);

                  return (
                  <FormGroup fieldId="define-scope" style={{ marginTop: 16 }}>
                    <ScopeDefineToolbar onAddChip={addScopeExtra} liveResultUrl={liveResultUrl} />
                    {scopeFilterCount > 0 && (() => {
                      const allItems = [
                        ...(formValues.scopeMethod === 'saved-filters' ? baseScopeChips.map((c) => ({ key: c.id, text: c.text, source: 'saved', id: c.id })) : []),
                        ...formValues.scopeExtraChips.map((c, idx) => ({ key: `ex-${idx}`, text: c, source: 'extra', idx })),
                      ];
                      const grouped = groupChipsByCategory(allItems);
                      const removeItem = (item) => {
                        if (item.source === 'saved') {
                          const remainingBaseTexts = savedFilterToChips(formValues.selectedSavedFilter)
                            .filter((c) => !formValues.removedBaseChipIds.includes(c.id) && c.id !== item.id)
                            .map((c) => c.text);
                          const extraTexts = formValues.scopeExtraChips || [];
                          updateFormValue({
                            scopeMethod: 'custom-filters',
                            scopeExtraChips: [...remainingBaseTexts, ...extraTexts],
                            selectedSavedFilter: null,
                            removedBaseChipIds: [],
                          });
                        } else {
                          removeScopeExtraAt(item.idx);
                        }
                      };
                      const removeCategory = (category) => {
                        const items = grouped[category];
                        const hasSavedItems = items.some((i) => i.source === 'saved');
                        if (hasSavedItems && formValues.scopeMethod === 'saved-filters') {
                          const removedSavedIds = new Set(items.filter((i) => i.source === 'saved').map((i) => i.id));
                          const removedExtraIdxs = new Set(items.filter((i) => i.source === 'extra').map((i) => i.idx));
                          const remainingBaseTexts = savedFilterToChips(formValues.selectedSavedFilter)
                            .filter((c) => !formValues.removedBaseChipIds.includes(c.id) && !removedSavedIds.has(c.id))
                            .map((c) => c.text);
                          const remainingExtra = (formValues.scopeExtraChips || []).filter((_, i) => !removedExtraIdxs.has(i));
                          updateFormValue({
                            scopeMethod: 'custom-filters',
                            scopeExtraChips: [...remainingBaseTexts, ...remainingExtra],
                            selectedSavedFilter: null,
                            removedBaseChipIds: [],
                          });
                        } else {
                          items.forEach((item) => removeScopeExtraAt(item.idx));
                        }
                      };
                      return (
                        <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginTop: 16 }} flexWrap={{ default: 'wrap' }}>
                          <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
                            {Object.entries(grouped).map(([category, items]) => (
                              <LabelGroup key={category} categoryName={category} isClosable onClose={() => removeCategory(category)} numLabels={10}>
                                {items.map((item) => (
                                  <Label key={item.key} onClose={() => removeItem(item)}>
                                    {item.text.replace(/^.+?:\s*/, '')}
                                  </Label>
                                ))}
                              </LabelGroup>
                            ))}
                          </Flex>
                          <FlexItem>
                            <Content component={ContentVariants.small}>{scopeFilterCount} filters applied</Content>
                          </FlexItem>
                          <FlexItem>
                            <Button variant="link" isInline onClick={() => {
                              if (formValues.scopeMethod === 'saved-filters') {
                                updateFormValue({
                                  scopeMethod: 'custom-filters',
                                  scopeExtraChips: [],
                                  selectedSavedFilter: null,
                                  removedBaseChipIds: [],
                                });
                              } else {
                                updateFormValue('scopeExtraChips', []);
                              }
                            }}>
                              Clear filters
                            </Button>
                          </FlexItem>
                        </Flex>
                      );
                    })()}
                  </FormGroup>
                  );
                })() : null}
              </Form>
            </>
          </WizardStep>

          <WizardStep
            name="Parameters"
            id="step-parameters"
            isDisabled={!isStep1Valid || !isStep2Valid}
            footer={{
              isNextDisabled: !isStep3Valid,
              onClose: handleCancel,
            }}
          >
            <div style={{ padding: 24 }}>
              <Title headingLevel="h2" style={{ marginBottom: 8 }}>
                Configure parameters
              </Title>
              <Content component={ContentVariants.p} style={{ marginBottom: 24, color: 'var(--pf-t--global--text--color--subtle)' }}>
                Select data to include in this report
              </Content>

              <Form>
                <FormGroup label="Image type" isRequired fieldId="image-type">
                  <Select
                    isOpen={dropdownStates.imageType}
                    onOpenChange={(open) => setDropdownStates((s) => ({ ...s, imageType: open }))}
                    toggle={(ref) => (
                      <MenuToggle ref={ref} onClick={() => toggleDropdown('imageType')} isExpanded={dropdownStates.imageType} style={{ minWidth: 200 }}>
                        Image type{formValues.selectedImageTypes.length > 0 && <Label isCompact color="blue" style={{ marginLeft: 4 }}>{formValues.selectedImageTypes.length} selected</Label>}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {IMAGE_TYPE_OPTIONS.map((opt) => (
                        <SelectOption key={opt.value} hasCheckbox isSelected={formValues.selectedImageTypes.includes(opt.value)} onClick={() => toggleSelection('selectedImageTypes', opt.value)}>
                          {opt.label}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                </FormGroup>

                <FormGroup label="Area of concern" isRequired fieldId="area-of-concern">
                  <Select
                    id="area-of-concern"
                    isOpen={dropdownStates.areaOfConcern}
                    selected={formValues.areaOfConcern}
                    onSelect={(_e, value) => { updateFormValue('areaOfConcern', value); toggleDropdown('areaOfConcern'); }}
                    onOpenChange={() => toggleDropdown('areaOfConcern')}
                    toggle={(ref) => (
                      <MenuToggle ref={ref} onClick={() => toggleDropdown('areaOfConcern')} isExpanded={dropdownStates.areaOfConcern} style={{ minWidth: '200px' }}>
                        {AREA_OPTIONS.find(o => o.value === formValues.areaOfConcern)?.label}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {AREA_OPTIONS.map(opt => (
                        <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                </FormGroup>

                <FormGroup label="Vulnerability state" isRequired fieldId="vuln-state">
                  <Select
                    id="vuln-state"
                    isOpen={dropdownStates.vulnState}
                    selected={formValues.vulnerabilityState}
                    onSelect={(_e, value) => { updateFormValue('vulnerabilityState', value); toggleDropdown('vulnState'); }}
                    onOpenChange={() => toggleDropdown('vulnState')}
                    toggle={(ref) => (
                      <MenuToggle ref={ref} onClick={() => toggleDropdown('vulnState')} isExpanded={dropdownStates.vulnState} style={{ minWidth: '150px' }}>
                        {VULN_STATE_OPTIONS.find(o => o.value === formValues.vulnerabilityState)?.label}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {VULN_STATE_OPTIONS.map(opt => (
                        <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                </FormGroup>

                <FormGroup label="Select filters" isRequired fieldId="cve-filters">
                  <CveCompoundFilter
                    selectedSeverities={formValues.selectedCveSeverities}
                    selectedStatuses={formValues.selectedCveStatuses}
                    selectedImageComponentSources={formValues.selectedImageComponentSources}
                    onToggleSeverity={(sev) => toggleSelection('selectedCveSeverities', sev)}
                    onToggleStatus={(st) => toggleSelection('selectedCveStatuses', st)}
                    onToggleImageComponentSource={(src) => toggleSelection('selectedImageComponentSources', src)}
                    generalChips={formValues.generalFilterChips}
                    onAddGeneralChip={(chip) => updateFormValue('generalFilterChips', [...formValues.generalFilterChips, chip])}
                    onRemoveGeneralChip={(idx) => updateFormValue('generalFilterChips', formValues.generalFilterChips.filter((_, i) => i !== idx))}
                    onClearAll={(type) => {
                      if (type === 'severity') updateFormValue('selectedCveSeverities', []);
                      else if (type === 'status') updateFormValue('selectedCveStatuses', []);
                      else if (type === 'imageComponentSource') updateFormValue('selectedImageComponentSources', []);
                      else {
                        updateFormValue('selectedCveSeverities', []);
                        updateFormValue('selectedCveStatuses', []);
                        updateFormValue('selectedImageComponentSources', []);
                        updateFormValue('generalFilterChips', []);
                      }
                    }}
                  />
                </FormGroup>

                <FormGroup label="CVE discovered since" isRequired fieldId="cve-discovered">
                  <Select
                    isOpen={dropdownStates.cveDiscovered}
                    selected={formValues.cveDiscoveredSince}
                    onSelect={(_e, value) => {
                      updateFormValue('cveDiscoveredSince', value);
                      toggleDropdown('cveDiscovered');
                    }}
                    onOpenChange={() => toggleDropdown('cveDiscovered')}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => toggleDropdown('cveDiscovered')}
                        isExpanded={dropdownStates.cveDiscovered}
                        isFullWidth
                      >
                        {CVE_DISCOVERED_OPTIONS.find((o) => o.value === formValues.cveDiscoveredSince)?.label}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {CVE_DISCOVERED_OPTIONS.map((opt) => (
                        <SelectOption key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>Show all detected CVEs from the beginning of cluster setup</HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
              </Form>
            </div>
          </WizardStep>

          <WizardStep
            name="Destinations"
            id="step-destinations"
            isDisabled={!isStep1Valid || !isStep2Valid || !isStep3Valid}
            footer={{
              onClose: handleCancel,
            }}
          >
            <div style={{ padding: 24 }}>
              <Title headingLevel="h2" style={{ marginBottom: 8 }}>
                Configure delivery destinations
              </Title>
              <Content component={ContentVariants.p} style={{ marginBottom: 24, color: 'var(--pf-t--global--text--color--subtle)' }}>
                Select how and when to deliver this report
              </Content>

              <Form>
                <FormGroup label="Email notifiers" fieldId="notifiers">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                    {EMAIL_NOTIFIERS.map((notifier) => (
                      <Checkbox
                        key={notifier.id}
                        id={`notifier-${notifier.id}`}
                        label={notifier.name}
                        isChecked={formValues.selectedNotifiers.includes(notifier.id)}
                        onChange={() => toggleSelection('selectedNotifiers', notifier.id)}
                      />
                    ))}
                  </div>
                  {!formValues.showDeliveryInput ? (
                    <Button
                      variant="link"
                      icon={<PlusCircleIcon />}
                      onClick={() => updateFormValue('showDeliveryInput', true)}
                    >
                      Add delivery destination
                    </Button>
                  ) : (
                    <div style={{ marginTop: 8 }}>
                      <TextInput
                        id="delivery-email-extra"
                        placeholder="Enter additional email addresses"
                        value={formValues.deliveryEmails || ''}
                        onChange={(_e, v) => updateFormValue('deliveryEmails', v)}
                      />
                    </div>
                  )}
                </FormGroup>

                <FormGroup label="Distribution list" fieldId="distribution-list">
                  <TextArea
                    id="distribution-list"
                    value={formValues.distributionList}
                    onChange={(_e, v) => updateFormValue('distributionList', v)}
                    placeholder="Enter email addresses (comma-separated)"
                    rows={4}
                  />
                </FormGroup>

                <FormGroup label="Schedule frequency" isRequired fieldId="schedule">
                  <Select
                    isOpen={dropdownStates.schedule}
                    selected={formValues.scheduleType}
                    onSelect={(_e, value) => {
                      updateFormValue('scheduleType', value);
                      toggleDropdown('schedule');
                    }}
                    onOpenChange={() => toggleDropdown('schedule')}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => toggleDropdown('schedule')}
                        isExpanded={dropdownStates.schedule}
                        style={{ minWidth: 150 }}
                      >
                        {SCHEDULE_OPTIONS.find((o) => o.value === formValues.scheduleType)?.label}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {SCHEDULE_OPTIONS.map((opt) => (
                        <SelectOption key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                </FormGroup>
              </Form>
            </div>
          </WizardStep>

          <WizardStep
            name="Review"
            id="step-review"
            isDisabled={!isStep1Valid || !isStep2Valid || !isStep3Valid}
            footer={{
              nextButtonText: 'Save',
              onClose: handleCancel,
            }}
          >
            <div style={{ padding: 24 }}>
              <Title headingLevel="h2" style={{ marginBottom: 24 }}>
                Review and save
              </Title>

              <Alert variant="info" isInline title="Review your report configuration before saving" style={{ marginBottom: 24 }} />

              <Card>
                <CardTitle>Report summary</CardTitle>
                <CardBody>
                  <DescriptionList isHorizontal>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Report name</DescriptionListTerm>
                      <DescriptionListDescription>{formValues.name || '—'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Description</DescriptionListTerm>
                      <DescriptionListDescription>{formValues.description || '—'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Scope method</DescriptionListTerm>
                      <DescriptionListDescription>
                        {formValues.scopeMethod === 'saved-filters' && (
                          <>
                            Saved filter:{' '}
                            {SAVED_FILTER_OPTIONS.find((f) => f.id === formValues.selectedSavedFilter)?.name || '—'}
                          </>
                        )}
                        {formValues.scopeMethod === 'custom-filters' && 'Custom filters'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Scope filters</DescriptionListTerm>
                      <DescriptionListDescription>
                        {scopeFilterCount > 0 ? (
                          <LabelGroup>
                            {scopeDisplayChips.map((c) => (
                              <Label key={c.id}>
                                {c.text}
                              </Label>
                            ))}
                          </LabelGroup>
                        ) : (
                          '—'
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Image filters</DescriptionListTerm>
                      <DescriptionListDescription>
                        {formValues.imageNameChips.length ? formValues.imageNameChips.map((c) => c.text).join('; ') : '—'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Area of concern</DescriptionListTerm>
                      <DescriptionListDescription>
                        {AREA_OPTIONS.find(o => o.value === formValues.areaOfConcern)?.label}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Vulnerability state</DescriptionListTerm>
                      <DescriptionListDescription>
                        {VULN_STATE_OPTIONS.find(o => o.value === formValues.vulnerabilityState)?.label}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Image type</DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {formValues.selectedImageTypes.map((t) => {
                            const opt = IMAGE_TYPE_OPTIONS.find((o) => o.value === t);
                            return <Label key={t}>{opt?.label}</Label>;
                          })}
                        </LabelGroup>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>CVE severities</DescriptionListTerm>
                      <DescriptionListDescription>
                        {formValues.selectedCveSeverities.length > 0 ? (
                          <LabelGroup>
                            {formValues.selectedCveSeverities.map((sev) => {
                              const opt = CVE_SEVERITY_OPTIONS.find((o) => o.value === sev);
                              return (
                                <Label key={sev} color={opt?.color}>
                                  {opt?.label}
                                </Label>
                              );
                            })}
                          </LabelGroup>
                        ) : '—'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>CVE status</DescriptionListTerm>
                      <DescriptionListDescription>
                        {formValues.selectedCveStatuses.length > 0 ? (
                          <LabelGroup>
                            {formValues.selectedCveStatuses.map((status) => {
                              const opt = CVE_STATUS_OPTIONS.find((o) => o.value === status);
                              return <Label key={status} color="blue">{opt?.label}</Label>;
                            })}
                          </LabelGroup>
                        ) : '—'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Image component source</DescriptionListTerm>
                      <DescriptionListDescription>
                        {formValues.selectedImageComponentSources.length > 0 ? (
                          <LabelGroup>
                            {formValues.selectedImageComponentSources.map((src) => {
                              const opt = IMAGE_COMPONENT_SOURCE_OPTIONS.find((o) => o.value === src);
                              return <Label key={src} color="blue">{opt?.label}</Label>;
                            })}
                          </LabelGroup>
                        ) : '—'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    {formValues.generalFilterChips.length > 0 && (
                      <DescriptionListGroup>
                        <DescriptionListTerm>Other filters</DescriptionListTerm>
                        <DescriptionListDescription>
                          <LabelGroup>
                            {formValues.generalFilterChips.map((chip, idx) => (
                              <Label key={idx}>{chip}</Label>
                            ))}
                          </LabelGroup>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    )}
                    <DescriptionListGroup>
                      <DescriptionListTerm>CVE discovered since</DescriptionListTerm>
                      <DescriptionListDescription>
                        {CVE_DISCOVERED_OPTIONS.find((o) => o.value === formValues.cveDiscoveredSince)?.label}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Email notifiers</DescriptionListTerm>
                      <DescriptionListDescription>
                        {formValues.selectedNotifiers.length
                          ? formValues.selectedNotifiers
                            .map((id) => EMAIL_NOTIFIERS.find((n) => n.id === id)?.name)
                            .filter(Boolean)
                            .join(', ')
                          : '—'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Distribution list</DescriptionListTerm>
                      <DescriptionListDescription>{formValues.distributionList || '—'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Schedule</DescriptionListTerm>
                      <DescriptionListDescription>
                        {SCHEDULE_OPTIONS.find((o) => o.value === formValues.scheduleType)?.label}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>
            </div>
          </WizardStep>
        </Wizard>
      </PageSection>

      <Modal
        variant={ModalVariant.small}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        aria-label="Confirm cancel"
      >
        <ModalHeader title="Confirm cancel" />
        <ModalBody>
          Are you sure you want to cancel? Any unsaved changes will be lost. You will be taken back to the list of reports.
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleConfirmCancel}>
            Confirm
          </Button>
          <Button variant="link" onClick={() => setShowCancelModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
