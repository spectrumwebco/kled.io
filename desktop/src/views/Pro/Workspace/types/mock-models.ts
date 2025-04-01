
export interface ManagementV1DevPodWorkspaceInstance {
  metadata?: {
    name?: string;
    namespace?: string;
    creationTimestamp?: string;
  };
  spec?: {
    templateRef?: {
      name?: string;
    };
    parameters?: Record<string, string>;
  };
  status?: {
    phase?: string;
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
            terminated?: { reason?: string; message?: string };
          };
        }>;
        containerResources?: Array<{
          name: string;
          resources?: {
            limits?: Record<string, string>;
          };
        }>;
        containerMetrics?: Array<{
          name: string;
          usage?: Record<string, string>;
        }>;
        conditions?: Array<{
          status: string;
          reason?: string;
          message?: string;
        }>;
        events?: Array<{
          type: string;
          reason?: string;
          message?: string;
        }>;
      };
      persistentVolumeClaimStatus?: {
        phase?: string;
        capacity?: Record<string, string>;
        conditions?: Array<{
          status: string;
          reason?: string;
          message?: string;
        }>;
        events?: Array<{
          type: string;
          reason?: string;
          message?: string;
        }>;
      };
    };
  };
}

export interface ManagementV1DevPodWorkspaceTemplate {
  metadata?: {
    name?: string;
    namespace?: string;
  };
  spec?: {
    displayName?: string;
    parameters?: Array<{
      variable: string;
      label?: string;
      description?: string;
      required?: boolean;
      default?: string;
      options?: string[];
    }>;
  };
}

export interface ManagementV1DevPodWorkspaceInstanceKubernetesStatus {
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
      };
    }>;
    containerResources?: Array<{
      name: string;
      resources?: {
        limits?: Record<string, string>;
      };
    }>;
    containerMetrics?: Array<{
      name: string;
      usage?: Record<string, string>;
    }>;
    conditions?: Array<{
      status: string;
      reason?: string;
      message?: string;
    }>;
    events?: Array<{
      type: string;
      reason?: string;
      message?: string;
    }>;
  };
  persistentVolumeClaimStatus?: {
    phase?: string;
    capacity?: Record<string, string>;
    conditions?: Array<{
      status: string;
      reason?: string;
      message?: string;
    }>;
    events?: Array<{
      type: string;
      reason?: string;
      message?: string;
    }>;
  };
}

export interface ManagementV1DevPodWorkspaceInstancePodStatus {
  phase?: string;
  reason?: string;
  message?: string;
  containerStatuses?: Array<{
    name: string;
    image?: string;
    state?: {
      waiting?: { reason?: string; message?: string };
      terminated?: { reason?: string; message?: string; exitCode?: number };
    };
  }>;
  containerResources?: Array<{
    name: string;
    resources?: {
      limits?: Record<string, string>;
    };
  }>;
  containerMetrics?: Array<{
    name: string;
    usage?: Record<string, string>;
  }>;
  conditions?: Array<{
    status: string;
    reason?: string;
    message?: string;
  }>;
  events?: Array<{
    type: string;
    reason?: string;
    message?: string;
  }>;
}

export enum ManagementV1DevPodWorkspaceInstancePodStatusPhaseEnum {
  Running = "Running",
  Pending = "Pending",
  Failed = "Failed",
  Succeeded = "Succeeded",
  Unknown = "Unknown"
}

export interface ManagementV1DevPodWorkspaceInstancePersistentVolumeClaimStatus {
  phase?: string;
  capacity?: Record<string, string>;
  conditions?: Array<{
    status: string;
    reason?: string;
    message?: string;
  }>;
  events?: Array<{
    type: string;
    reason?: string;
    message?: string;
  }>;
}

export enum ManagementV1DevPodWorkspaceInstancePersistentVolumeClaimStatusPhaseEnum {
  Bound = "Bound",
  Pending = "Pending",
  Lost = "Lost"
}
