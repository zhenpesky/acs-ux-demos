import { Label, Tooltip } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  SyncAltIcon,
} from "@patternfly/react-icons";
import { useLiveSync } from "../api/hooks";

export default function ApiStatusBadge() {
  const { status, message } = useLiveSync();

  const iconMap = {
    connected: <CheckCircleIcon />,
    syncing: <SyncAltIcon className="pf-v6-u-spin" />,
    mock: <InfoCircleIcon />,
    error: <ExclamationCircleIcon />,
    idle: <InfoCircleIcon />,
  };

  const colorMap = {
    connected: "green",
    syncing: "blue",
    mock: "orange",
    error: "red",
    idle: "grey",
  };

  const labelMap = {
    connected: "Live Data",
    syncing: "Syncing…",
    mock: "Mock Data",
    error: "Disconnected",
    idle: "Initializing",
  };

  return (
    <Tooltip content={message || labelMap[status] || "Unknown"}>
      <Label color={colorMap[status] || "grey"} icon={iconMap[status] || <InfoCircleIcon />} isCompact>
        {labelMap[status] || "Unknown"}
      </Label>
    </Tooltip>
  );
}
