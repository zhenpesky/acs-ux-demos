import { useState, useCallback } from 'react';
import {
  Button,
  Flex,
  FlexItem,
  Label,
  Popover,
  Spinner,
  Stack,
  StackItem,
  Content,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  SyncAltIcon,
  InfoCircleIcon,
  OutlinedClockIcon,
} from '@patternfly/react-icons';
import { useLiveSync } from '../api/hooks';
import { triggerSync } from '../api/liveSync';

function formatTimestamp(isoString) {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getHealthColor(status, errorCount) {
  if (status === 'connected') return 'green';
  if (status === 'syncing') return 'blue';
  if (status === 'error' && errorCount >= 3) return 'red';
  if (status === 'error') return 'gold';
  if (status === 'mock') return 'orange';
  return 'grey';
}

function getHealthIcon(status, errorCount) {
  if (status === 'connected') return <CheckCircleIcon />;
  if (status === 'syncing') return <SyncAltIcon className="pf-v6-u-spin" />;
  if (status === 'error' && errorCount >= 3) return <ExclamationCircleIcon />;
  if (status === 'error') return <ExclamationTriangleIcon />;
  if (status === 'mock') return <InfoCircleIcon />;
  return <InfoCircleIcon />;
}

export default function LocalSyncBanner() {
  const { status, message, lastSyncTimestamp, syncErrorCount } = useLiveSync();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncNow = useCallback(async () => {
    setIsSyncing(true);
    try {
      await triggerSync();
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const healthColor = getHealthColor(status, syncErrorCount);
  const healthIcon = getHealthIcon(status, syncErrorCount);
  const timeLabel = formatTimestamp(lastSyncTimestamp);

  const popoverBody = (
    <Stack hasGutter>
      <StackItem>
        <Content component="p">
          <strong>Sync Status:</strong> {message || 'Initializing…'}
        </Content>
      </StackItem>
      {lastSyncTimestamp && (
        <StackItem>
          <Content component="p">
            <OutlinedClockIcon /> Last synced: {new Date(lastSyncTimestamp).toLocaleString()}
          </Content>
        </StackItem>
      )}
      {syncErrorCount > 0 && (
        <StackItem>
          <Content component="p" style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>
            Consecutive errors: {syncErrorCount}
          </Content>
        </StackItem>
      )}
      <StackItem>
        <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
          Auto-sync interval: 30 seconds
        </Content>
      </StackItem>
      <StackItem>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSyncNow}
          isLoading={isSyncing}
          isDisabled={isSyncing || status === 'mock'}
          icon={isSyncing ? <Spinner size="sm" /> : <SyncAltIcon />}
        >
          {isSyncing ? 'Syncing…' : 'Sync now'}
        </Button>
      </StackItem>
    </Stack>
  );

  return (
    <Popover
      aria-label="Sync status details"
      headerContent="Sync status"
      bodyContent={popoverBody}
      position="bottom"
    >
      <Button variant="plain" aria-label="Sync status" style={{ padding: 0 }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
          <FlexItem>
            <Label color={healthColor} icon={healthIcon} isCompact>
              {status === 'mock' ? 'Mock' : timeLabel}
            </Label>
          </FlexItem>
        </Flex>
      </Button>
    </Popover>
  );
}
