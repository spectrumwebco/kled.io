
export interface DevPodWorkspaceInstance {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    name: string;
    namespace?: string;
    [key: string]: any;
  };
  spec?: DevPodWorkspaceInstanceSpec;
  status?: DevPodWorkspaceInstanceStatus;
}

export interface DevPodWorkspaceInstanceSpec {
  displayName?: string;

  description?: string;

  owner?: UserOrTeam;

  presetRef?: PresetRef;

  templateRef?: TemplateRef;

  environmentRef?: EnvironmentRef;

  template?: DevPodWorkspaceTemplateDefinition;

  runnerRef?: RunnerRef;

  parameters?: string;

  access?: Access[];

  preventWakeUpOnConnection?: boolean;
}

export interface PresetRef {
  name: string;

  version?: string;
}

export interface RunnerRef {
  runner?: string;
}

export interface EnvironmentRef {
  name: string;

  version?: string;
}

export interface TemplateRef {
  name: string;

  version?: string;
}

export interface DevPodWorkspaceInstanceStatus {
  lastWorkspaceStatus?: WorkspaceStatus;

  phase?: InstancePhase;

  reason?: string;

  message?: string;

  conditions?: Condition[];

  instance?: DevPodWorkspaceTemplateDefinition;

  ignoreReconciliation?: boolean;

  clusterRef?: ClusterRef;
}

export interface WorkspaceStatusResult {
  id?: string;
  context?: string;
  provider?: string;
  state?: string;
}

export type WorkspaceStatus = "NotFound" | "Stopped" | "Busy" | "Running";

export type InstancePhase = "Pending" | "Running" | "Failed" | "Succeeded" | "Unknown";

export interface DevPodCommandStopOptions {}

export interface DevPodCommandDeleteOptions {
  ignoreNotFound?: boolean;
  force?: boolean;
  gracePeriod?: string;
}

export interface DevPodCommandStatusOptions {
  containerStatus?: boolean;
}

export interface DevPodCommandUpOptions {
  id?: string;
  source?: string;
  ide?: string;
  ideOptions?: string[];
  prebuildRepositories?: string[];
  devContainerPath?: string;
  workspaceEnv?: string[];
  recreate?: boolean;
  proxy?: boolean;
  disableDaemon?: boolean;
  daemonInterval?: string;

  repository?: string;
  skipPush?: boolean;
  platform?: string[];

  forceBuild?: boolean;
  forceInternalBuildKit?: boolean;
}

export interface DevPodWorkspaceInstanceList {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    resourceVersion?: string;
    continue?: string;
  };
  items: DevPodWorkspaceInstance[];
}

export interface UserOrTeam {
  user?: string;
  team?: string;
}

export interface Access {
  name: string;
  verbs: string[];
}

export interface DevPodWorkspaceTemplateDefinition {
  [key: string]: any;
}

export interface ClusterRef {
  cluster?: string;
  namespace?: string;
}

export interface Condition {
  type: string;
  status: string;
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
}

export const DevPodWorkspaceIDLabel = "loft.sh/workspace-id";
export const DevPodWorkspaceUIDLabel = "loft.sh/workspace-uid";
export const DevPodKubernetesProviderWorkspaceUIDLabel = "devpod.sh/workspace-uid";
export const DevPodWorkspacePictureAnnotation = "loft.sh/workspace-picture";
export const DevPodWorkspaceSourceAnnotation = "loft.sh/workspace-source";
export const DevPodWorkspaceRunnerEndpointAnnotation = "loft.sh/runner-endpoint";

export const DevPodFlagsUp = "DEVPOD_FLAGS_UP";
export const DevPodFlagsDelete = "DEVPOD_FLAGS_DELETE";
export const DevPodFlagsStatus = "DEVPOD_FLAGS_STATUS";
export const DevPodFlagsSsh = "DEVPOD_FLAGS_SSH";
export const DevPodFlagsStop = "DEVPOD_FLAGS_STOP";
