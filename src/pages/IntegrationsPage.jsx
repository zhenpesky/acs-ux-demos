import {
  Card,
  CardBody,
  CardTitle,
  Content,
  Divider,
  Flex,
  FlexItem,
  Label,
  PageSection,
  Tab,
  Tabs,
  Title,
} from '@patternfly/react-core';
import { useState } from 'react';
import { INTEGRATIONS } from '../mockData';
import { useLiveSync } from '../api/hooks';

const integrationCategories = {
  0: {
    title: 'Image Integrations',
    items: INTEGRATIONS.imageIntegrations.map((i) => ({ name: i.name, type: i.name.toLowerCase().replace(/\s+/g, '-'), count: i.count, enabled: i.count > 0 })),
  },
  1: {
    title: 'Notifiers',
    items: INTEGRATIONS.notifiers.map((i) => ({ name: i.name, type: i.name.toLowerCase().replace(/\s+/g, '-'), count: i.count, enabled: i.count > 0 })),
  },
  2: {
    title: 'Backup Integrations',
    items: INTEGRATIONS.backupIntegrations.map((i) => ({ name: i.name, type: i.name.toLowerCase().replace(/\s+/g, '-'), count: i.count, enabled: i.count > 0 })),
  },
};

export default function IntegrationsPage() {
  useLiveSync();
  const [activeTab, setActiveTab] = useState(0);
  const category = integrationCategories[activeTab];

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Integrations</Title>
        <Content component="p">Configure external integrations and notifiers</Content>
      </PageSection>
      <PageSection padding={{ default: 'noPadding' }}>
        <Tabs activeKey={activeTab} onSelect={(_e, k) => setActiveTab(k)} style={{ paddingInline: '24px' }}>
          <Tab eventKey={0} title="Image Integrations" />
          <Tab eventKey={1} title="Notifiers" />
          <Tab eventKey={2} title="Backup Integrations" />
        </Tabs>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {category.items.map((item) => (
            <Card key={item.type} isSelectable isCompact>
              <CardTitle>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <span>{item.name}</span>
                  {item.count > 0 && <Label isCompact color="blue">{item.count} configured</Label>}
                </Flex>
              </CardTitle>
              <CardBody>
                <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  {item.count > 0 ? `${item.count} integration${item.count > 1 ? 's' : ''} configured` : 'No integrations configured'}
                </span>
              </CardBody>
            </Card>
          ))}
        </div>
      </PageSection>
    </>
  );
}
