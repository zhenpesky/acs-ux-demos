import { useMemo, useState } from 'react';
import {
  Alert,
  AlertActionCloseButton,
  Button,
  Card,
  CardBody,
  Content,
  Divider,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Pagination,
  SearchInput,
  TextArea,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { COLLECTIONS } from '../mockData';
import { useLiveSync } from '../api/hooks';

export default function CollectionsPage({ routePrefix }) {
  useLiveSync();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [collName, setCollName] = useState('');
  const [collDesc, setCollDesc] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const filteredCollections = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return COLLECTIONS;
    return COLLECTIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [searchValue]);

  const paginatedCollections = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredCollections.slice(start, start + perPage);
  }, [filteredCollections, page, perPage]);

  const handleCreate = () => {
    setCreateModalOpen(false);
    setSuccessAlert(true);
    setCollName('');
    setCollDesc('');
    setTimeout(() => setSuccessAlert(false), 4000);
  };

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Collections</Title>
        <Content component="p">Configure deployment collections to associate with other workflows</Content>
      </PageSection>
      <Divider component="div" />
      <PageSection>
        {successAlert && (
          <Alert variant="success" isInline title="Collection created successfully" style={{ marginBottom: 16 }}
            actionClose={<AlertActionCloseButton onClose={() => setSuccessAlert(false)} />}
          />
        )}
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="search-filter" style={{ flex: 1 }}>
              <SearchInput
                placeholder="Filter by collection name"
                value={searchValue}
                onChange={(_e, v) => { setSearchValue(v); setPage(1); }}
                onClear={() => { setSearchValue(''); setPage(1); }}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary" onClick={() => setCreateModalOpen(true)}>Create collection</Button>
            </ToolbarItem>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={filteredCollections.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, pp) => { setPerPage(pp); setPage(1); }}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Collections table" variant="compact">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>In use by</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedCollections.map((c, i) => (
              <Tr key={i} isClickable onClick={() => setSelectedCollection(c)}>
                <Td>
                  <Button variant="link" isInline onClick={(e) => { e.stopPropagation(); setSelectedCollection(c); }}>
                    {c.name}
                  </Button>
                </Td>
                <Td>{c.description}</Td>
                <Td><Label isCompact color="blue">{c.usedBy || 0} report{(c.usedBy || 0) !== 1 ? 's' : ''}</Label></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} variant="medium">
        <ModalHeader title="Create collection" />
        <ModalBody>
          <Content component="p" style={{ marginBottom: 16 }}>
            Collections define a set of deployments based on naming conventions to be used in reporting and other workflows.
          </Content>
          <Form>
            <FormGroup label="Collection name" isRequired fieldId="coll-name">
              <TextInput id="coll-name" value={collName} onChange={(_e, v) => setCollName(v)} placeholder="Enter collection name" />
            </FormGroup>
            <FormGroup label="Description" fieldId="coll-desc">
              <TextArea id="coll-desc" value={collDesc} onChange={(_e, v) => setCollDesc(v)} placeholder="Describe this collection" rows={3} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleCreate} isDisabled={!collName.trim()}>Save</Button>
          <Button variant="link" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {selectedCollection && (
        <Modal isOpen onClose={() => setSelectedCollection(null)} variant="medium">
          <ModalHeader title={`Collection: ${selectedCollection.name}`} />
          <ModalBody>
            <Card isFlat>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 16px' }}>
                  <span style={{ fontWeight: 600 }}>Name:</span><span>{selectedCollection.name}</span>
                  <span style={{ fontWeight: 600 }}>Description:</span><span>{selectedCollection.description || '—'}</span>
                  <span style={{ fontWeight: 600 }}>Used by:</span><span>{selectedCollection.usedBy || 0} report(s)</span>
                  <span style={{ fontWeight: 600 }}>Rules:</span>
                  <span>
                    {selectedCollection.rules
                      ? selectedCollection.rules.map((r, i) => <Label key={i} isCompact style={{ marginRight: 4, marginBottom: 4 }}>{r}</Label>)
                      : <Label isCompact>All deployments</Label>
                    }
                  </span>
                </div>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setSelectedCollection(null)}>Edit collection</Button>
            <Button variant="link" onClick={() => setSelectedCollection(null)}>Close</Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
