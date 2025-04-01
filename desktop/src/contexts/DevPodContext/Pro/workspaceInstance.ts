import { TIDE, TIdentifiable, TWorkspaceSource } from "@/types";
import { 
  DevPodWorkspaceInstance, 
  DevPodWorkspaceInstanceStatus, 
  WorkspaceStatus,
  InstancePhase,
  Condition,
  DevPodWorkspaceTemplateDefinition,
  ClusterRef
} from "../../../api/v1/devpodworkspaceinstance_types";
import { Labels, deepCopy } from "@/lib";
import { Resources } from "../../../platform/src";

export class ProWorkspaceInstance implements DevPodWorkspaceInstance, TIdentifiable {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    name: string;
    namespace?: string;
    [key: string]: any;
  };
  spec?: any;
  status?: ProWorkspaceInstanceStatus;

  public get id(): string {
    const maybeID = this.metadata?.labels?.[Labels.WorkspaceID];
    if (!maybeID) {
      // If we don't have an ID we should ignore the instance.
      // Throwing an error for now to see how often this happens
      throw new Error(`No Workspace ID label present on instance ${this.metadata?.name}`);
    }

    return maybeID;
  }

  constructor(instance: DevPodWorkspaceInstance) {
    this.apiVersion = instance.apiVersion;
    this.kind = instance.kind;
    this.metadata = deepCopy(instance.metadata);
    this.spec = deepCopy(instance.spec);
    this.status = deepCopy(instance.status) as ProWorkspaceInstanceStatus;
  }
}

class ProWorkspaceInstanceStatus implements DevPodWorkspaceInstanceStatus {
  lastWorkspaceStatus?: WorkspaceStatus;
  phase?: InstancePhase;
  reason?: string;
  message?: string;
  conditions?: Condition[];
  instance?: DevPodWorkspaceTemplateDefinition;
  ignoreReconciliation?: boolean;
  clusterRef?: ClusterRef;
  kubernetes?: {
    podStatus?: {
      phase?: string;
      reason?: string;
      message?: string;
      containerStatuses?: Array<{
        name: string;
        image?: string;
        state?: {
          waiting?: { reason?: string; message?: string };
          terminated?: { reason?: string; message?: string; exitCode?: number };
        }
      }>;
      containerResources?: Array<{ name: string; resources?: { limits?: Record<string, string> } }>;
      containerMetrics?: Array<{ name: string; usage?: Record<string, string> }>;
      conditions?: Array<{ status: string; reason?: string; message?: string }>;
      events?: Array<{ type: string; reason?: string; message?: string }>;
    };
    persistentVolumeClaimStatus?: {
      capacity?: Record<string, string>;
      phase?: string;
      conditions?: Array<{ status: string; reason?: string; message?: string }>;
    };
  };
  
  "source"?: TWorkspaceSource;
  "ide"?: TIDE;
  "metrics"?: ProWorkspaceMetricsSummary;

  constructor() {
  }
}

class ProWorkspaceMetricsSummary {
  "latencyMs"?: number;
  "connectionType"?: "direct" | "DERP";
  "derpRegion"?: string;
}
