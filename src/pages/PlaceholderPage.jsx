import {
  PageSection,
  Title,
  EmptyState,
  EmptyStateBody,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

export default function PlaceholderPage({ title, description }) {
  return (
    <>
      <PageSection>
        <Content>
          <Title headingLevel="h1">{title}</Title>
          {description && <Content component={ContentVariants.p}>{description}</Content>}
        </Content>
      </PageSection>
      <PageSection isFilled>
        <EmptyState 
          variant="full" 
          icon={CubesIcon} 
          titleText="Page Under Development"
          headingLevel="h2"
        >
          <EmptyStateBody>
            This page will display the full {title} interface from StackRox.
            Connect to a real StackRox Central to see live data.
          </EmptyStateBody>
        </EmptyState>
      </PageSection>
    </>
  );
}
