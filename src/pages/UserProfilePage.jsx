import {
  PageSection,
  Title,
  Card,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  LabelGroup,
  Divider,
  Stack,
  StackItem,
  Content,
} from '@patternfly/react-core';

export default function UserProfilePage() {
  return (
    <PageSection hasBodyWrapper={false}>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h1">User profile</Title>
        </StackItem>
        <StackItem>
          <Card>
            <CardBody>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>User ID</DescriptionListTerm>
                  <DescriptionListDescription>sso:admin</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>Admin Reviewer</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Email</DescriptionListTerm>
                  <DescriptionListDescription>admin@example.com</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Roles</DescriptionListTerm>
                  <DescriptionListDescription>
                    <LabelGroup>
                      <Label color="blue">Admin</Label>
                    </LabelGroup>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </StackItem>
        <StackItem>
          <Title headingLevel="h2" size="lg">Permissions</Title>
        </StackItem>
        <StackItem>
          <Card>
            <CardBody>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Access</DescriptionListTerm>
                  <DescriptionListDescription><Label color="green" isCompact>Read/Write</Label></DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Administration</DescriptionListTerm>
                  <DescriptionListDescription><Label color="green" isCompact>Read/Write</Label></DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Alert</DescriptionListTerm>
                  <DescriptionListDescription><Label color="green" isCompact>Read/Write</Label></DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Cluster</DescriptionListTerm>
                  <DescriptionListDescription><Label color="green" isCompact>Read/Write</Label></DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Compliance</DescriptionListTerm>
                  <DescriptionListDescription><Label color="green" isCompact>Read/Write</Label></DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Deployment</DescriptionListTerm>
                  <DescriptionListDescription><Label color="green" isCompact>Read/Write</Label></DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Image</DescriptionListTerm>
                  <DescriptionListDescription><Label color="green" isCompact>Read/Write</Label></DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Integration</DescriptionListTerm>
                  <DescriptionListDescription><Label color="green" isCompact>Read/Write</Label></DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Network Graph</DescriptionListTerm>
                  <DescriptionListDescription><Label color="green" isCompact>Read/Write</Label></DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </PageSection>
  );
}
