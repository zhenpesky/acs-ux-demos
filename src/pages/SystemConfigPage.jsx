import { useState } from 'react';
import {
  Alert,
  AlertActionCloseButton,
  Button,
  Card,
  CardBody,
  CardTitle,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Flex,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { SYSTEM_CONFIG } from '../mockData';
import { useLiveSync } from '../api/hooks';

export default function SystemConfigPage() {
  useLiveSync();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [maxImageRetention, setMaxImageRetention] = useState(String(SYSTEM_CONFIG.retention.maxImageRetention));
  const [deployRetention, setDeployRetention] = useState(SYSTEM_CONFIG.retention.resolvedDeployRetention);
  const [successAlert, setSuccessAlert] = useState(false);

  const handleSave = () => {
    setEditModalOpen(false);
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 4000);
  };

  return (
    <>
      <PageSection>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <Title headingLevel="h1">System Configuration</Title>
          <Button variant="primary" onClick={() => setEditModalOpen(true)}>Edit</Button>
        </Flex>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        {successAlert && (
          <Alert variant="success" isInline title="System configuration saved successfully" style={{ marginBottom: 16 }}
            actionClose={<AlertActionCloseButton onClose={() => setSuccessAlert(false)} />}
          />
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <Card>
            <CardTitle>Platform components configuration</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Max image retention</DescriptionListTerm>
                  <DescriptionListDescription>{SYSTEM_CONFIG.retention.maxImageRetention}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Deployment retention</DescriptionListTerm>
                  <DescriptionListDescription>{SYSTEM_CONFIG.retention.resolvedDeployRetention} after deletion</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Private data retention configuration</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>All runtime violations</DescriptionListTerm>
                  <DescriptionListDescription>90 days</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Resolved deploy-phase violations</DescriptionListTerm>
                  <DescriptionListDescription>90 days</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Images no longer deployed</DescriptionListTerm>
                  <DescriptionListDescription>7 days</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Expired vulnerability requests</DescriptionListTerm>
                  <DescriptionListDescription>90 days</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Public configuration</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Login notice</DescriptionListTerm>
                  <DescriptionListDescription>None configured</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Header</DescriptionListTerm>
                  <DescriptionListDescription>None configured</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Footer</DescriptionListTerm>
                  <DescriptionListDescription>None configured</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Telemetry configuration</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Online telemetry data collection</DescriptionListTerm>
                  <DescriptionListDescription>{SYSTEM_CONFIG.telemetry.enabled ? 'Enabled' : 'Disabled'}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </div>
      </PageSection>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} variant="medium">
        <ModalHeader title="Edit system configuration" />
        <ModalBody>
          <Form>
            <FormGroup label="Max image retention" fieldId="max-image-retention">
              <TextInput id="max-image-retention" type="number" value={maxImageRetention} onChange={(_e, v) => setMaxImageRetention(v)} />
            </FormGroup>
            <FormGroup label="Deployment retention (after deletion)" fieldId="deploy-retention">
              <TextInput id="deploy-retention" value={deployRetention} onChange={(_e, v) => setDeployRetention(v)} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleSave}>Save</Button>
          <Button variant="link" onClick={() => setEditModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
