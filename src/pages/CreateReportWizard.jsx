import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  ToolbarGroup,
  ToolbarItem,
  Toolbar,
  ToolbarContent,
  Radio,
  ExpandableSection,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import {
  TimesIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  ExternalLinkAltIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';
import { vulnerabilityReportsPath, vulnerabilitiesBasePath, prefixRoutes } from '../routes';
import { addReport, updateReport } from '../api/reportStore';
import { CLUSTERS, NAMESPACES, DEPLOYMENTS, CVES } from '../mockData';
import { useLiveSync } from '../api/hooks';

const COLLECTIONS = [
  {
    id: 'col-1', name: 'All production workloads',
    description: 'All workloads deployed to production clusters',
    rules: [
      { entity: 'Cluster', field: 'Name', values: ['production-east', 'production-west'] },
    ],
  },
  {
    id: 'col-2', name: 'Staging and dev workloads',
    description: 'All workloads in non-production clusters',
    rules: [
      { entity: 'Cluster', field: 'Name', values: ['staging-cluster', 'development'] },
    ],
  },
  {
    id: 'col-3', name: 'Frontend services',
    description: 'Frontend deployments across all clusters',
    rules: [
      { entity: 'Namespace', field: 'Name', values: ['app-frontend'] },
      { entity: 'Deployment', field: 'Name', values: ['nginx-ingress', 'web-ui', 'api-gateway'] },
    ],
  },
  {
    id: 'col-4', name: 'Backend services',
    description: 'Backend and database deployments',
    rules: [
      { entity: 'Namespace', field: 'Name', values: ['app-backend', 'database'] },
    ],
  },
  {
    id: 'col-5', name: 'Critical infrastructure',
    description: 'Infrastructure-level services including monitoring and logging',
    rules: [
      { entity: 'Namespace', field: 'Name', values: ['kube-system', 'monitoring', 'logging'] },
    ],
  },
  {
    id: 'col-6', name: 'All namespaces in production-east',
    description: 'Every namespace in the production-east cluster',
    rules: [
      { entity: 'Cluster', field: 'Name', values: ['production-east'] },
    ],
  },
];

const SAVED_FILTER_OPTIONS = [
  {
    id: 'sf-1',
    name: 'Front End only',
    filters: {
      clusterName: ['staging-secured-cluster'],
      namespaceName: ['frontend'],
      deploymentName: ['api-gateway', 'redis-server', 'postgres-db'],
    },
  },
  {
    id: 'sf-2',
    name: 'Critical CVEs in production',
    filters: {
      clusterName: ['prod-cluster-east'],
      namespaceName: [],
      deploymentName: [],
    },
  },
  {
    id: 'sf-3',
    name: 'Fixable CVEs - all clusters',
    filters: {
      clusterName: ['staging-secured-cluster', 'prod-cluster-east'],
      namespaceName: [],
      deploymentName: [],
    },
  },
  { id: 'sf-4', name: 'Backend namespace vulnerabilities' },
];

const IMAGE_TYPE_OPTIONS = [
  { value: 'deployed', label: 'Deployed images' },
  { value: 'watched', label: 'Watched images' },
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

const CVE_DISCOVERED_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: 'last-scheduled', label: 'Last scheduled report that was successfully sent' },
  { value: 'custom', label: 'Custom date' },
];

const SEVERITY_OPTIONS = [
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

const REPORT_FILTER_ENTITIES = [
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
  {
    key: "Deployment", label: "Deployment",
    attributes: [
      { key: "annotation", label: "Annotation", inputType: "autocomplete" },
      { key: "id", label: "ID", inputType: "autocomplete" },
      { key: "label", label: "Label", inputType: "autocomplete" },
      { key: "name", label: "Name", inputType: "autocomplete" },
    ],
  },
  {
    key: "Namespace", label: "Namespace",
    attributes: [
      { key: "annotation", label: "Annotation", inputType: "autocomplete" },
      { key: "id", label: "ID", inputType: "autocomplete" },
      { key: "label", label: "Label", inputType: "autocomplete" },
      { key: "name", label: "Name", inputType: "autocomplete" },
    ],
  },
  {
    key: "Cluster", label: "Cluster",
    attributes: [
      { key: "id", label: "ID", inputType: "autocomplete" },
      { key: "label", label: "Label", inputType: "autocomplete" },
      { key: "name", label: "Name", inputType: "autocomplete" },
      { key: "platformType", label: "Platform type", inputType: "autocomplete" },
      { key: "type", label: "Type", inputType: "autocomplete" },
    ],
  },
];

const EMAIL_NOTIFIERS = [
  { id: 'email-1', name: 'Security Team Email' },
  { id: 'email-2', name: 'DevOps Alerts' },
];

const SCHEDULE_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const SCOPE_ENTITIES = [
  { key: 'Cluster', label: 'Cluster', attributes: ['ID', 'Label', 'Name', 'Platform type', 'Type'] },
  { key: 'Deployment', label: 'Deployment', attributes: ['Annotation', 'ID', 'Label', 'Name'] },
  { key: 'Namespace', label: 'Namespace', attributes: ['Annotation', 'ID', 'Label', 'Name'] },
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

function ResourcesStep({ formValues, updateFormValue, toggleSelection, resultsPath }) {
  const [collectionSearch, setCollectionSearch] = useState('');
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [savedFilterOpen, setSavedFilterOpen] = useState(false);
  const [alertExpanded, setAlertExpanded] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filteredCollections = useMemo(() => {
    const q = collectionSearch.toLowerCase();
    return COLLECTIONS.filter((c) => c.name.toLowerCase().includes(q));
  }, [collectionSearch]);

  const collectionDisplayValue = formValues.selectedCollection
    ? COLLECTIONS.find((c) => c.id === formValues.selectedCollection)?.name || ''
    : '';

  return (
    <>
      <div style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
        <Flex direction={{ default: 'column' }} style={{ padding: '16px 24px' }}>
          <FlexItem>
            <Title headingLevel="h2">Configure resources</Title>
          </FlexItem>
          <FlexItem>
            <Content component={ContentVariants.p} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              Select a method to define the scope of the report
            </Content>
          </FlexItem>
        </Flex>
      </div>
      <Divider />
      <Form style={{ padding: '24px' }}>
        <FormGroup label="Scope method" isRequired fieldId="scope-method">
          <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
            <FlexItem>
              <Radio
                id="scope-custom"
                name="scope-method"
                label="Custom filters"
                description="define scope using your own filters"
                isChecked={formValues.scopeMethod === 'custom-filters'}
                onChange={() => updateFormValue('scopeMethod', 'custom-filters')}
              />
            </FlexItem>
            <FlexItem>
              <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                <FlexItem>
                  <Radio
                    id="scope-saved"
                    name="scope-method"
                    label={
                      <span>
                        Use saved filters{' '}
                        <Label isCompact color="blue" icon={<InfoCircleIcon />}>New</Label>
                      </span>
                    }
                    description="Define scope using existing saved filters"
                    isChecked={formValues.scopeMethod === 'saved-filters'}
                    onChange={() => updateFormValue('scopeMethod', 'saved-filters')}
                  />
                </FlexItem>
                {formValues.scopeMethod === 'saved-filters' && (
                  <FlexItem style={{ paddingLeft: 24 }}>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Select
                          isOpen={savedFilterOpen}
                          onOpenChange={setSavedFilterOpen}
                          selected={formValues.selectedSavedFilter}
                          onSelect={(_e, val) => {
                            updateFormValue('selectedSavedFilter', val);
                            updateFormValue('removedBaseChipIds', []);
                            setSavedFilterOpen(false);
                          }}
                          toggle={(ref) => (
                            <MenuToggle ref={ref} onClick={() => setSavedFilterOpen(!savedFilterOpen)} isExpanded={savedFilterOpen} style={{ minWidth: 152 }}>
                              {SAVED_FILTER_OPTIONS.find((f) => f.id === formValues.selectedSavedFilter)?.name || 'Select a saved filter'}
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            {SAVED_FILTER_OPTIONS.map((f) => (
                              <SelectOption key={f.id} value={f.id}>{f.name}</SelectOption>
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
              <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                <FlexItem>
                  <Radio
                    id="scope-collection"
                    name="scope-method"
                    label="Collection"
                    isChecked={formValues.scopeMethod === 'collection'}
                    onChange={() => updateFormValue('scopeMethod', 'collection')}
                  />
                </FlexItem>
                {formValues.scopeMethod === 'collection' && (
                  <FlexItem style={{ paddingLeft: 24 }}>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Select
                          id="collection-scope-select"
                          isOpen={collectionOpen}
                          selected={formValues.selectedCollection}
                          onSelect={(_e, val) => {
                            updateFormValue('selectedCollection', val);
                            setCollectionOpen(false);
                            setCollectionSearch('');
                          }}
                          onOpenChange={(open) => {
                            setCollectionOpen(open);
                            if (!open) setCollectionSearch('');
                          }}
                          toggle={(ref) => (
                            <MenuToggle ref={ref} variant="typeahead" onClick={() => setCollectionOpen(!collectionOpen)} isExpanded={collectionOpen} style={{ minWidth: 152 }}>
                              <TextInputGroup isPlain>
                                <TextInputGroupMain
                                  value={collectionOpen ? collectionSearch : collectionDisplayValue}
                                  placeholder="Select a collection"
                                  onChange={(_e, v) => { setCollectionSearch(v); if (!collectionOpen) setCollectionOpen(true); }}
                                  onFocus={() => { if (!collectionOpen) setCollectionOpen(true); }}
                                  autoComplete="off"
                                />
                              </TextInputGroup>
                            </MenuToggle>
                          )}
                        >
                          <SelectList style={{ maxHeight: 275, overflowY: 'auto' }}>
                            {filteredCollections.length === 0 ? (
                              <SelectOption isDisabled>No results found</SelectOption>
                            ) : (
                              filteredCollections.map((col) => (
                                <SelectOption key={col.id} value={col.id} description={col.description}>{col.name}</SelectOption>
                              ))
                            )}
                          </SelectList>
                        </Select>
                      </FlexItem>
                      <FlexItem>
                        <Button variant="secondary" isDisabled={!formValues.selectedCollection} onClick={() => setViewModalOpen(true)}>View</Button>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                )}
                <FlexItem style={{ paddingLeft: 24 }}>
                  <ExpandableSection
                    toggleContent={
                      <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem><InfoCircleIcon color="var(--pf-t--global--icon--color--status--info--default)" /></FlexItem>
                        <FlexItem><strong>Collection is deprecating soon</strong></FlexItem>
                      </Flex>
                    }
                    isExpanded={alertExpanded}
                    onToggle={(_e, expanded) => setAlertExpanded(expanded)}
                    style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: 8, padding: '8px 16px' }}
                  >
                    <Content component={ContentVariants.p} style={{ marginTop: 8 }}>
                      Vulnerability reports using collections are being deprecated. The reporting will be updated in an upcoming release to be scoped with a different mechanism.
                    </Content>
                    <Button
                      variant="link"
                      isInline
                      icon={<ExternalLinkAltIcon />}
                      iconPosition="end"
                      style={{ marginTop: 8 }}
                      onClick={() =>
                        window.open(
                          'https://www.stackrox.io/docs/',
                          '_blank',
                          'noopener,noreferrer',
                        )
                      }
                    >
                      Documentation
                    </Button>
                  </ExpandableSection>
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        </FormGroup>

        {(formValues.scopeMethod === 'custom-filters' || (formValues.scopeMethod === 'saved-filters' && formValues.selectedSavedFilter)) && (() => {
          const savedChips = formValues.scopeMethod === 'saved-filters'
            ? savedFilterToChips(formValues.selectedSavedFilter).filter((c) => !formValues.removedBaseChipIds.includes(c.id))
            : [];
          const extraChips = formValues.scopeMethod === 'custom-filters'
            ? (formValues.scopeChips || [])
            : (formValues.scopeExtraChips || []);
          const totalCount = savedChips.length + extraChips.length;
          const addChip = (chip) => {
            if (formValues.scopeMethod === 'saved-filters') {
              const remainingBaseTexts = savedFilterToChips(formValues.selectedSavedFilter)
                .filter((c) => !formValues.removedBaseChipIds.includes(c.id))
                .map((c) => c.text);
              const extraTexts = formValues.scopeExtraChips || [];
              updateFormValue({
                scopeMethod: 'custom-filters',
                scopeChips: [...remainingBaseTexts, ...extraTexts, chip],
                selectedSavedFilter: null,
                scopeExtraChips: [],
                removedBaseChipIds: [],
              });
            } else {
              updateFormValue('scopeChips', [...(formValues.scopeChips || []), chip]);
            }
          };
          const clearAll = () => {
            if (formValues.scopeMethod === 'saved-filters') {
              updateFormValue({
                scopeMethod: 'custom-filters',
                scopeChips: [],
                selectedSavedFilter: null,
                scopeExtraChips: [],
                removedBaseChipIds: [],
              });
            } else {
              updateFormValue('scopeChips', []);
            }
          };
          const allChipTexts = [...savedChips.map((c) => c.text), ...extraChips];
          const isScopeModified = formValues.scopeMethod === 'saved-filters'
            && (formValues.removedBaseChipIds.length > 0 || (formValues.scopeExtraChips || []).length > 0);
          const liveResultSavedName = (formValues.scopeMethod === 'saved-filters' && !isScopeModified)
            ? SAVED_FILTER_OPTIONS.find((f) => f.id === formValues.selectedSavedFilter)?.name || null
            : null;
          const liveResultUrl = buildLiveResultUrl(resultsPath, allChipTexts, liveResultSavedName);

          return (
            <FormGroup fieldId="define-scope" style={{ marginTop: 16 }}>
              <ScopeDefineToolbar onAddChip={addChip} liveResultUrl={liveResultUrl} />
              {totalCount > 0 && (() => {
                const allItems = [
                  ...savedChips.map((c) => ({ key: c.id, text: c.text, source: 'saved', id: c.id })),
                  ...extraChips.map((chip, idx) => ({ key: formValues.scopeMethod === 'custom-filters' ? `c-${idx}` : `e-${idx}`, text: chip, source: formValues.scopeMethod === 'custom-filters' ? 'custom' : 'extra', idx })),
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
                      scopeChips: [...remainingBaseTexts, ...extraTexts],
                      selectedSavedFilter: null,
                      scopeExtraChips: [],
                      removedBaseChipIds: [],
                    });
                  } else if (item.source === 'custom') {
                    updateFormValue('scopeChips', formValues.scopeChips.filter((_, i) => i !== item.idx));
                  } else {
                    updateFormValue('scopeExtraChips', formValues.scopeExtraChips.filter((_, i) => i !== item.idx));
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
                      scopeChips: [...remainingBaseTexts, ...remainingExtra],
                      selectedSavedFilter: null,
                      scopeExtraChips: [],
                      removedBaseChipIds: [],
                    });
                  } else {
                    const removedIdxs = new Set(items.map((i) => i.idx));
                    updateFormValue('scopeChips', (formValues.scopeChips || []).filter((_, i) => !removedIdxs.has(i)));
                  }
                };
                return (
                  <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginTop: 12 }}>
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
                      <Content component={ContentVariants.small}>{totalCount} filters applied</Content>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="link" isInline onClick={clearAll}>
                        Clear filters
                      </Button>
                    </FlexItem>
                  </Flex>
                );
              })()}
            </FormGroup>
          );
        })()}

        <Divider style={{ marginTop: 8, marginBottom: 16 }} />
      </Form>

      <Modal
        variant={ModalVariant.medium}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        aria-label="View collection"
      >
        <ModalHeader title={`Collection: ${COLLECTIONS.find((c) => c.id === formValues.selectedCollection)?.name || ''}`} />
        <ModalBody>
          {formValues.selectedCollection && (() => {
            const col = COLLECTIONS.find((c) => c.id === formValues.selectedCollection);
            if (!col) return null;
            return (
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>{col.name}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
                  <DescriptionListDescription>{col.description}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Rules</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Table variant="compact" borders={false}>
                      <Thead><Tr><Th>Entity</Th><Th>Field</Th><Th>Values</Th></Tr></Thead>
                      <Tbody>
                        {col.rules.map((rule, i) => (
                          <Tr key={i}><Td>{rule.entity}</Td><Td>{rule.field}</Td><Td>{rule.values.join(', ')}</Td></Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            );
          })()}
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setViewModalOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

function ReportCompoundFilter({ selectedSeverities, selectedCveStatus, onToggleSeverity, onToggleStatus, generalChips, onAddGeneralChip, onRemoveGeneralChip, onClearGeneralChips }) {
  const [entityOpen, setEntityOpen] = useState(false);
  const [attrOpen, setAttrOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(REPORT_FILTER_ENTITIES[0]);
  const [selectedAttribute, setSelectedAttribute] = useState(REPORT_FILTER_ENTITIES[0].attributes[0]);
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
      if (!selectedCveStatus.includes(st)) onToggleStatus(st);
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
                {`Filter by ${selectedEntity.label} ${attr.label.toLowerCase()}`}
              </MenuToggle>
            )}
          >
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
                {ops.map((o) => <SelectOption key={o.value} value={o.value}>{o.label}</SelectOption>)}
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
                  <Button variant="plain" onClick={() => setInputValue("")} aria-label="Clear"><TimesIcon /></Button>
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
          <div ref={acWrapperRef} style={{ position: 'relative' }}>
            <TextInputGroup>
              <TextInputGroupMain
                value={inputValue}
                onChange={(_e, v) => { setInputValue(v); setAcOpen(true); }}
                onFocus={() => setAcOpen(true)}
                onKeyDown={(e) => { if (e.key === "Enter" && inputValue.trim()) { handleApply(inputValue.trim()); setAcOpen(false); } }}
                placeholder={`Find results by ${attr.label.toLowerCase()}`}
                autoComplete="off"
                aria-label="Filter input"
              />
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
        <ToolbarItem>
          <Button variant="plain" aria-label="Apply" onClick={() => { if (inputValue.trim()) { handleApply(inputValue.trim()); setAcOpen(false); } }} icon={<ArrowRightIcon />} />
        </ToolbarItem>
      </>
    );
  }

  return (
    <div>
      <Toolbar style={{ padding: 0 }}>
        <ToolbarContent>
          <ToolbarGroup variant="filter-group" className="pf-v6-u-flex-grow-1">
            <ToolbarItem>
              <Select
                isOpen={entityOpen}
                onOpenChange={setEntityOpen}
                selected={selectedEntity.key}
                onSelect={(_e, val) => {
                  const ent = REPORT_FILTER_ENTITIES.find((e) => e.key === val);
                  setSelectedEntity(ent);
                  setSelectedAttribute(ent.attributes[0]);
                  setEntityOpen(false);
                  setInputValue("");
                  setAcOpen(false);
                }}
                toggle={(ref) => (
                  <MenuToggle ref={ref} onClick={() => setEntityOpen(!entityOpen)} isExpanded={entityOpen} className="pf-v6-u-flex-shrink-0">
                    {selectedEntity.label}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {REPORT_FILTER_ENTITIES.map((e) => (
                    <SelectOption key={e.key} value={e.key}>{e.label}</SelectOption>
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
                  setAcOpen(false);
                }}
                toggle={(ref) => (
                  <MenuToggle ref={ref} onClick={() => setAttrOpen(!attrOpen)} isExpanded={attrOpen} className="pf-v6-u-flex-shrink-0">
                    {attr.label}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {selectedEntity.attributes.map((a) => (
                    <SelectOption key={a.key} value={a.key} isSelected={a.key === attr.key}>{a.label}</SelectOption>
                  ))}
                </SelectList>
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
      {(selectedSeverities.length > 0 || selectedCveStatus.length > 0 || generalChips.length > 0) && (
        <Flex gap={{ default: 'gapSm' }} style={{ marginTop: 12 }} wrap={{ default: 'wrap' }} alignItems={{ default: 'alignItemsCenter' }}>
          {selectedSeverities.length > 0 && (
            <FlexItem>
              <LabelGroup categoryName="CVE severity" isClosable onClose={() => { selectedSeverities.forEach((s) => onToggleSeverity(s)); }}>
                {selectedSeverities.map((sev) => {
                  const opt = SEVERITY_OPTIONS.find((o) => o.value === sev);
                  return <Label key={sev} onClose={() => onToggleSeverity(sev)}>{opt?.label}</Label>;
                })}
              </LabelGroup>
            </FlexItem>
          )}
          {selectedCveStatus.length > 0 && (
            <FlexItem>
              <LabelGroup categoryName="CVE status" isClosable onClose={() => { selectedCveStatus.forEach((s) => onToggleStatus(s)); }}>
                {selectedCveStatus.map((status) => {
                  const opt = CVE_STATUS_OPTIONS.find((o) => o.value === status);
                  return <Label key={status} onClose={() => onToggleStatus(status)}>{opt?.label}</Label>;
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
            <Button variant="link" isInline onClick={() => { selectedSeverities.forEach((s) => onToggleSeverity(s)); selectedCveStatus.forEach((s) => onToggleStatus(s)); onClearGeneralChips(); }}>
              Clear filters
            </Button>
          </FlexItem>
        </Flex>
      )}
    </div>
  );
}

export default function CreateReportWizard({ routePrefix = '/v1' }) {
  useLiveSync();
  const navigate = useNavigate();
  const location = useLocation();
  const r = prefixRoutes(routePrefix);
  const incomingFilters = location.state?.filters;
  const incomingSavedFilterName = location.state?.savedFilterName;
  const incomingFiltersModified = location.state?.filtersModified;
  const editReport = location.state?.editReport;
  const isEditMode = Boolean(editReport);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [formValues, setFormValues] = useState(() => {
    const defaults = {
      name: '',
      description: '',
      scopeMethod: 'saved-filters',
      selectedCollection: null,
      selectedSavedFilter: 'sf-1',
      selectedImageTypes: ['deployed', 'watched'],
      areaOfConcern: 'user-workloads',
      vulnerabilityState: 'observed',
      selectedSeverities: ['critical', 'important'],
      selectedCveStatus: ['fixable'],
      cveDiscoveredSince: 'all',
      filterSearchValue: '',
      scopeChips: [],
      scopeExtraChips: [],
      removedBaseChipIds: [],
      generalFilterChips: [],
      selectedNotifiers: [],
      scheduleType: 'weekly',
      scheduleDay: 'monday',
      scheduleTime: '08:00',
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
        defaults.selectedSeverities = editReport.cveSeverities.map((s) => s.toLowerCase());
      }
      if (editReport.cveStatus) {
        if (editReport.cveStatus.toLowerCase().includes('not fixable')) {
          defaults.selectedCveStatus = ['fixable', 'not-fixable'];
        } else if (editReport.cveStatus.toLowerCase().includes('fixable')) {
          defaults.selectedCveStatus = ['fixable'];
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
      defaults.selectedCollection = null;
      defaults.selectedSavedFilter = null;
      const chips = [];
      (incomingFilters.clusterName || []).forEach((v) => chips.push(`Cluster name: ${v}`));
      (incomingFilters.namespaceName || []).forEach((v) => chips.push(`Namespace name: ${v}`));
      (incomingFilters.deploymentName || []).forEach((v) => chips.push(`Deployment name: ${v}`));
      defaults.scopeChips = chips;
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
        defaults.selectedCollection = null;
      } else {
        defaults.scopeMethod = 'custom-filters';
        defaults.selectedCollection = null;
        defaults.selectedSavedFilter = null;
        const chips = [];
        (incomingFilters.clusterName || []).forEach((v) => chips.push(`Cluster name: ${v}`));
        (incomingFilters.namespaceName || []).forEach((v) => chips.push(`Namespace name: ${v}`));
        (incomingFilters.deploymentName || []).forEach((v) => chips.push(`Deployment name: ${v}`));
        defaults.scopeChips = chips;
      }
    }

    if (incomingFilters.cveSeverity?.length) {
      defaults.selectedSeverities = incomingFilters.cveSeverity.map((s) => s.toLowerCase());
    }
    if (incomingFilters.cveStatus?.length) {
      defaults.selectedCveStatus = incomingFilters.cveStatus.map((s) =>
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
    area: false,
    vulnState: false,
    cveDiscovered: false,
    severity: false,
    cveStatus: false,
    cveSeverityMenu: false,
    cveStatusMenu: false,
    imageTypeParam: false,
    schedule: false,
  });

  const toggleDropdown = (key) => {
    setDropdownStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFormValue = (keyOrUpdates, value) => {
    if (typeof keyOrUpdates === 'object' && value === undefined) {
      setFormValues(prev => ({ ...prev, ...keyOrUpdates }));
    } else {
      setFormValues(prev => ({ ...prev, [keyOrUpdates]: value }));
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    navigate(r.vulnerabilityReportsPath);
  };

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
    };
    if (isEditMode && editReport.id) {
      updateReport(editReport.id, reportData);
      navigate(`${r.vulnerabilityReportDetailPath}/${editReport.id}`);
    } else {
      const newReport = addReport(reportData);
      navigate(`${r.vulnerabilityReportDetailPath}/${newReport.id}`);
    }
  };

  const toggleSelection = (key, value) => {
    setFormValues(prev => {
      const current = prev[key];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...current, value] };
      }
    });
  };

  const isStep1Valid = formValues.name.trim() !== '';
  const isStep2Valid = (
    formValues.scopeMethod === 'collection' ? formValues.selectedCollection !== null :
    formValues.scopeMethod === 'saved-filters' ? formValues.selectedSavedFilter !== null :
    true
  );
  const isStep3Valid = formValues.selectedImageTypes.length > 0 && formValues.selectedSeverities.length > 0;
  const isStep4Valid = true;

  return (
    <>
      <PageSection  padding={{ default: 'noPadding' }}>
        <div style={{ padding: '24px 24px 0 24px' }}>
          <Breadcrumb>
            <BreadcrumbItem to={r.vulnerabilitiesBasePath}>Vulnerability Management</BreadcrumbItem>
            <BreadcrumbItem to={r.vulnerabilityReportsPath}>Vulnerability Reporting</BreadcrumbItem>
            <BreadcrumbItem isActive>{isEditMode ? 'Edit report' : 'Create report'}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Divider style={{ marginTop: '16px' }} />
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
            <div style={{ padding: '24px', maxWidth: '650px' }}>
              <Title headingLevel="h2" style={{ marginBottom: '24px' }}>Details</Title>
              <Form>
                <FormGroup label="Name" isRequired fieldId="report-name">
                  <TextInput
                    isRequired
                    id="report-name"
                    value={formValues.name}
                    onChange={(_, value) => updateFormValue('name', value)}
                    placeholder="Enter report name"
                  />
                </FormGroup>
                <FormGroup label="Description" fieldId="report-description">
                  <TextArea
                    id="report-description"
                    value={formValues.description}
                    onChange={(_, value) => updateFormValue('description', value)}
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
            <ResourcesStep
              formValues={formValues}
              updateFormValue={updateFormValue}
              toggleSelection={toggleSelection}
              resultsPath={r.vulnerabilitiesUserWorkloadsPath}
            />
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
            <div style={{ padding: '24px' }}>
              <Title headingLevel="h2" style={{ marginBottom: '8px' }}>Configure parameters</Title>
              <Content component={ContentVariants.p} style={{ marginBottom: '24px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                Select data to include in this report
              </Content>

              <Form>
                <FormGroup label="Image type" isRequired fieldId="image-type-param">
                  <Select
                    isOpen={dropdownStates.imageTypeParam}
                    onOpenChange={(open) => setDropdownStates((s) => ({ ...s, imageTypeParam: open }))}
                    toggle={(ref) => (
                      <MenuToggle ref={ref} onClick={() => setDropdownStates((s) => ({ ...s, imageTypeParam: !s.imageTypeParam }))} isExpanded={dropdownStates.imageTypeParam} style={{ minWidth: 200 }}>
                        Image type{formValues.selectedImageTypes.length > 0 && <Label isCompact color="blue" style={{ marginLeft: 4 }}>{formValues.selectedImageTypes.length} selected</Label>}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {IMAGE_TYPE_OPTIONS.map((o) => (
                        <SelectOption key={o.value} hasCheckbox isSelected={formValues.selectedImageTypes.includes(o.value)} onClick={() => toggleSelection('selectedImageTypes', o.value)}>{o.label}</SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                </FormGroup>

                {formValues.scopeMethod === 'collection' ? (
                  <>
                    <FormGroup label="CVE severity" isRequired fieldId="cve-severity">
                      <Select
                        isOpen={dropdownStates.cveSeverityMenu}
                        onOpenChange={(open) => setDropdownStates((s) => ({ ...s, cveSeverityMenu: open }))}
                        toggle={(ref) => (
                          <MenuToggle ref={ref} isFullWidth onClick={() => setDropdownStates((s) => ({ ...s, cveSeverityMenu: !s.cveSeverityMenu }))} isExpanded={dropdownStates.cveSeverityMenu}>
                            CVE severity{formValues.selectedSeverities.length > 0 && <Label isCompact color="blue" style={{ marginLeft: 4 }}>{formValues.selectedSeverities.length}</Label>}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          {SEVERITY_OPTIONS.map((o) => (
                            <SelectOption key={o.value} hasCheckbox isSelected={formValues.selectedSeverities.includes(o.value)} onClick={() => toggleSelection('selectedSeverities', o.value)}>{o.label}</SelectOption>
                          ))}
                        </SelectList>
                      </Select>
                    </FormGroup>
                    <FormGroup label="CVE status" isRequired fieldId="cve-status">
                      <Select
                        isOpen={dropdownStates.cveStatusMenu}
                        onOpenChange={(open) => setDropdownStates((s) => ({ ...s, cveStatusMenu: open }))}
                        toggle={(ref) => (
                          <MenuToggle ref={ref} isFullWidth onClick={() => setDropdownStates((s) => ({ ...s, cveStatusMenu: !s.cveStatusMenu }))} isExpanded={dropdownStates.cveStatusMenu}>
                            CVE status{formValues.selectedCveStatus.length > 0 && <Label isCompact color="blue" style={{ marginLeft: 4 }}>{formValues.selectedCveStatus.length}</Label>}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          {CVE_STATUS_OPTIONS.map((o) => (
                            <SelectOption key={o.value} hasCheckbox isSelected={formValues.selectedCveStatus.includes(o.value)} onClick={() => toggleSelection('selectedCveStatus', o.value)}>{o.label}</SelectOption>
                          ))}
                        </SelectList>
                      </Select>
                    </FormGroup>
                  </>
                ) : (
                  <>
                    <FormGroup label="Area of concern" isRequired fieldId="area-of-concern">
                      <Select
                        id="area-of-concern"
                        isOpen={dropdownStates.area}
                        selected={formValues.areaOfConcern}
                        onSelect={(_, value) => {
                          updateFormValue('areaOfConcern', value);
                          toggleDropdown('area');
                        }}
                        onOpenChange={() => toggleDropdown('area')}
                        toggle={(toggleRef) => (
                          <MenuToggle ref={toggleRef} onClick={() => toggleDropdown('area')} isExpanded={dropdownStates.area} style={{ minWidth: '200px' }}>
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
                        onSelect={(_, value) => {
                          updateFormValue('vulnerabilityState', value);
                          toggleDropdown('vulnState');
                        }}
                        onOpenChange={() => toggleDropdown('vulnState')}
                        toggle={(toggleRef) => (
                          <MenuToggle ref={toggleRef} onClick={() => toggleDropdown('vulnState')} isExpanded={dropdownStates.vulnState} style={{ minWidth: '150px' }}>
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

                    <FormGroup label="Select filters" isRequired fieldId="filters">
                      <ReportCompoundFilter
                        selectedSeverities={formValues.selectedSeverities}
                        selectedCveStatus={formValues.selectedCveStatus}
                        onToggleSeverity={(sev) => toggleSelection('selectedSeverities', sev)}
                        onToggleStatus={(status) => toggleSelection('selectedCveStatus', status)}
                        generalChips={formValues.generalFilterChips}
                        onAddGeneralChip={(chip) => updateFormValue('generalFilterChips', [...formValues.generalFilterChips, chip])}
                        onRemoveGeneralChip={(idx) => updateFormValue('generalFilterChips', formValues.generalFilterChips.filter((_, i) => i !== idx))}
                        onClearGeneralChips={() => updateFormValue('generalFilterChips', [])}
                      />
                    </FormGroup>
                  </>
                )}

                <FormGroup label="CVE discovered since" isRequired fieldId="cve-discovered">
                  <Select
                    id="cve-discovered"
                    isOpen={dropdownStates.cveDiscovered}
                    selected={formValues.cveDiscoveredSince}
                    onSelect={(_, value) => {
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
                        {CVE_DISCOVERED_OPTIONS.find(o => o.value === formValues.cveDiscoveredSince)?.label}
                      </MenuToggle>
                    )}
                  >
                    {CVE_DISCOVERED_OPTIONS.map(opt => (
                      <SelectOption key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectOption>
                    ))}
                  </Select>
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>
                        {formValues.cveDiscoveredSince === 'all' && 'Show all detected CVEs from the beginning of cluster setup'}
                        {formValues.cveDiscoveredSince === 'last-scheduled' && 'At least one delivery destination and schedule will be required in the next step'}
                        {formValues.cveDiscoveredSince === 'custom' && 'Custom start date for the discovered CVE that were run on-demand or downloaded'}
                      </HelperTextItem>
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
            <div style={{ padding: '24px' }}>
              <Title headingLevel="h2" style={{ marginBottom: '8px' }}>Configure delivery destinations</Title>
              <Content component={ContentVariants.p} style={{ marginBottom: '24px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                Select how and when to deliver this report
              </Content>

              <Form>
                <FormGroup label="Email notifiers" fieldId="notifiers">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                    {EMAIL_NOTIFIERS.map(notifier => (
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
                        id="delivery-email"
                        placeholder="Enter email addresses (comma-separated)"
                        value={formValues.deliveryEmails || ''}
                        onChange={(_e, v) => updateFormValue('deliveryEmails', v)}
                      />
                    </div>
                  )}
                </FormGroup>

                <FormGroup label="Schedule" isRequired fieldId="schedule">
                  <Select
                    id="schedule"
                    isOpen={dropdownStates.schedule}
                    selected={formValues.scheduleType}
                    onSelect={(_, value) => {
                      updateFormValue('scheduleType', value);
                      toggleDropdown('schedule');
                    }}
                    onOpenChange={() => toggleDropdown('schedule')}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => toggleDropdown('schedule')}
                        isExpanded={dropdownStates.schedule}
                        style={{ minWidth: '150px' }}
                      >
                        {SCHEDULE_OPTIONS.find(o => o.value === formValues.scheduleType)?.label}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {SCHEDULE_OPTIONS.map(opt => (
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
            <div style={{ padding: '24px' }}>
              <Title headingLevel="h2" style={{ marginBottom: '24px' }}>Review and save</Title>
              
              <Alert
                variant="info"
                isInline
                title="Review your report configuration before saving"
                style={{ marginBottom: '24px' }}
              />

              <Card>
                <CardTitle>Report Details</CardTitle>
                <CardBody>
                  <DescriptionList isHorizontal>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
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
                            Saved filter: {SAVED_FILTER_OPTIONS.find(f => f.id === formValues.selectedSavedFilter)?.name || '—'}
                            {formValues.selectedSavedFilter && (() => {
                              const chips = savedFilterToChips(formValues.selectedSavedFilter).filter((c) => !formValues.removedBaseChipIds.includes(c.id));
                              if (chips.length === 0) return null;
                              return (
                                <LabelGroup style={{ marginTop: 8 }}>
                                  {chips.map((c) => (
                                    <Label key={c.id}>{c.text}</Label>
                                  ))}
                                </LabelGroup>
                              );
                            })()}
                          </>
                        )}
                        {formValues.scopeMethod === 'collection' && (
                          <>Collection: {COLLECTIONS.find(c => c.id === formValues.selectedCollection)?.name || '—'}</>
                        )}
                        {formValues.scopeMethod === 'custom-filters' && (
                          <>
                            Custom filters
                            {formValues.scopeChips?.length > 0 && (
                              <LabelGroup style={{ marginTop: 8 }}>
                                {formValues.scopeChips.map((chip, idx) => (
                                  <Label key={idx}>{chip}</Label>
                                ))}
                              </LabelGroup>
                            )}
                          </>
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Image type</DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {formValues.selectedImageTypes.map(t => {
                            const opt = IMAGE_TYPE_OPTIONS.find(o => o.value === t);
                            return <Label key={t}>{opt?.label}</Label>;
                          })}
                        </LabelGroup>
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
                      <DescriptionListTerm>CVE severities</DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {formValues.selectedSeverities.map(sev => {
                            const opt = SEVERITY_OPTIONS.find(o => o.value === sev);
                            return <Label key={sev} color={opt?.color}>{opt?.label}</Label>;
                          })}
                        </LabelGroup>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Schedule</DescriptionListTerm>
                      <DescriptionListDescription>
                        {SCHEDULE_OPTIONS.find(o => o.value === formValues.scheduleType)?.label}
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
