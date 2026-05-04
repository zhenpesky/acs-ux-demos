import { useParams, useLocation } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Label,
  Divider,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const V1_ENDPOINTS = [
  { method: 'GET', path: '/v1/alerts', description: 'List alerts matching a query' },
  { method: 'GET', path: '/v1/clusters', description: 'List secured clusters' },
  { method: 'GET', path: '/v1/deployments', description: 'List deployments by query' },
  { method: 'GET', path: '/v1/images', description: 'List images' },
  { method: 'GET', path: '/v1/namespaces', description: 'List namespaces' },
  { method: 'GET', path: '/v1/policies', description: 'List policies' },
  { method: 'POST', path: '/v1/policies', description: 'Create a new policy' },
  { method: 'GET', path: '/v1/search', description: 'Search resources' },
  { method: 'GET', path: '/v1/metadata', description: 'Get metadata including version' },
];

const V2_ENDPOINTS = [
  { method: 'GET', path: '/v2/compliance/scan/configurations', description: 'List compliance scan configurations' },
  { method: 'GET', path: '/v2/compliance/scan/results', description: 'Get scan results' },
  { method: 'GET', path: '/v2/image/vulnerabilities', description: 'List image vulnerabilities' },
  { method: 'GET', path: '/v2/report/configurations', description: 'List report configurations' },
  { method: 'POST', path: '/v2/report/configurations', description: 'Create a new report configuration' },
  { method: 'GET', path: '/v2/search/autocomplete', description: 'Get autocomplete suggestions' },
  { method: 'POST', path: '/v2/administration/events/count', description: 'Count administration events' },
];

function MethodLabel({ method }) {
  const colorMap = { GET: 'blue', POST: 'green', PUT: 'orange', DELETE: 'red', PATCH: 'cyan' };
  return <Label color={colorMap[method] || 'grey'} isCompact>{method}</Label>;
}

export default function ApiDocsPage() {
  const location = useLocation();
  const isV2 = location.pathname.includes('apidocs-v2');
  const endpoints = isV2 ? V2_ENDPOINTS : V1_ENDPOINTS;

  return (
    <PageSection hasBodyWrapper={false}>
      <Stack hasGutter>
        <StackItem>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
            <FlexItem>
              <Title headingLevel="h1">API Reference {isV2 ? '(v2)' : '(v1)'}</Title>
            </FlexItem>
            <FlexItem>
              <Label color="blue" isCompact>OpenAPI 3.0</Label>
            </FlexItem>
          </Flex>
          <Content component="p" className="pf-v6-u-mt-sm" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
            Red Hat Advanced Cluster Security for Kubernetes API — Version 4.7.0
          </Content>
        </StackItem>
        <Divider />
        <StackItem>
          {endpoints.map((ep, i) => (
            <Card key={i} isCompact className="pf-v6-u-mb-xs">
              <CardBody>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem style={{ minWidth: 60 }}><MethodLabel method={ep.method} /></FlexItem>
                  <FlexItem><code style={{ fontFamily: 'var(--pf-t--global--font--family--mono)', fontSize: '14px' }}>{ep.path}</code></FlexItem>
                  <FlexItem grow={{ default: 'grow' }} style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{ep.description}</FlexItem>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </StackItem>
      </Stack>
    </PageSection>
  );
}
