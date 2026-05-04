import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  PageSection,
  Title,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  Card,
  CardBody,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { SearchIcon, TimesIcon } from '@patternfly/react-icons';
import { DEPLOYMENTS, CVES, CLUSTERS, NAMESPACES } from '../mockData';

const SEARCH_CATEGORIES = [
  { key: 'ALERTS', label: 'Alerts' },
  { key: 'CLUSTERS', label: 'Clusters' },
  { key: 'DEPLOYMENTS', label: 'Deployments' },
  { key: 'IMAGES', label: 'Images' },
  { key: 'NAMESPACES', label: 'Namespaces' },
  { key: 'NODES', label: 'Nodes' },
  { key: 'POLICIES', label: 'Policies' },
  { key: 'ROLES', label: 'Roles' },
  { key: 'SECRETS', label: 'Secrets' },
  { key: 'SERVICE_ACCOUNTS', label: 'Service accounts' },
  { key: 'SUBJECTS', label: 'Subjects' },
];

function getSearchResults(query) {
  if (!query.trim()) return {};
  const q = query.toLowerCase();
  const deployments = DEPLOYMENTS.filter((d) => d.name.toLowerCase().includes(q)).map((d) => ({
    id: d.id, name: d.name, category: 'Deployments', detail: `Cluster: ${d.clusterName}, Namespace: ${d.namespace}`,
  }));
  const clusters = CLUSTERS.filter((c) => c.name.toLowerCase().includes(q)).map((c) => ({
    id: c.id, name: c.name, category: 'Clusters', detail: `Status: ${c.healthStatus?.overallHealthStatus || 'HEALTHY'}`,
  }));
  const namespaces = NAMESPACES.filter((n) => (n.metadata?.name || n.name || '').toLowerCase().includes(q)).map((n) => ({
    id: n.metadata?.id || n.id, name: n.metadata?.name || n.name, category: 'Namespaces', detail: `Cluster: ${n.metadata?.clusterName || ''}`,
  }));
  const cves = CVES.filter((c) => c.cve.toLowerCase().includes(q)).map((c) => ({
    id: c.cve, name: c.cve, category: 'Images', detail: c.distroTuples?.[0]?.summary || '',
  }));
  return { Deployments: deployments, Clusters: clusters, Namespaces: namespaces, Images: cves };
}

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const results = useMemo(() => (hasSearched ? getSearchResults(searchValue) : {}), [searchValue, hasSearched]);
  const totalCount = Object.values(results).reduce((a, arr) => a + arr.length, 0);

  const handleSearch = useCallback(() => {
    if (searchValue.trim()) setHasSearched(true);
  }, [searchValue]);

  return (
    <PageSection hasBodyWrapper={false}>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h1" className="pf-v6-u-mb-md">Search</Title>
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              <TextInputGroup>
                <TextInputGroupMain
                  icon={<SearchIcon />}
                  value={searchValue}
                  onChange={(_e, v) => { setSearchValue(v); if (!v) setHasSearched(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="Filter resources"
                  aria-label="Search input"
                />
                <TextInputGroupUtilities>
                  {searchValue && (
                    <Button variant="plain" onClick={() => { setSearchValue(''); setHasSearched(false); }} aria-label="Clear">
                      <TimesIcon />
                    </Button>
                  )}
                </TextInputGroupUtilities>
              </TextInputGroup>
            </FlexItem>
          </Flex>
        </StackItem>
        <StackItem>
          {!hasSearched && (
            <Alert variant="info" isInline title="Enter a search filter" component="p">
              <p>Type a keyword and press Enter to search across all resource categories.</p>
            </Alert>
          )}
          {hasSearched && totalCount === 0 && (
            <Alert variant="info" isInline title="No results match the search filter" component="p" />
          )}
          {hasSearched && totalCount > 0 && (
            <Stack hasGutter>
              <StackItem>
                <LabelGroup categoryName="Categories">
                  {Object.entries(results).filter(([, arr]) => arr.length > 0).map(([cat, arr]) => (
                    <Label key={cat}>{cat} ({arr.length})</Label>
                  ))}
                </LabelGroup>
              </StackItem>
              {Object.entries(results).filter(([, arr]) => arr.length > 0).map(([cat, arr]) => (
                <StackItem key={cat}>
                  <Title headingLevel="h3" size="md" className="pf-v6-u-mb-sm">{cat} ({arr.length})</Title>
                  {arr.slice(0, 10).map((item) => (
                    <Card key={item.id} isCompact className="pf-v6-u-mb-xs">
                      <CardBody>
                        <Flex>
                          <FlexItem><strong>{item.name}</strong></FlexItem>
                          <FlexItem style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{item.detail}</FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </StackItem>
              ))}
            </Stack>
          )}
        </StackItem>
      </Stack>
    </PageSection>
  );
}
