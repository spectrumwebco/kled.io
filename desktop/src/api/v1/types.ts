
export type ManagementV1KledWorkspaceInstancePodStatusPhaseEnum = 
  | "Pending"
  | "Running"
  | "Succeeded"
  | "Failed"
  | "Unknown";

export type ManagementV1KledWorkspaceInstancePersistentVolumeClaimStatusPhaseEnum = 
  | "Pending"
  | "Bound"
  | "Lost";

export interface ManagementV1KledWorkspaceInstancePodStatus {
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
  containerResources?: Array<{ 
    name: string; 
    resources?: { 
      limits?: Record<string, string> 
    } 
  }>;
  containerMetrics?: Array<{ 
    name: string; 
    usage?: Record<string, string> 
  }>;
  conditions?: Array<{ 
    status: string; 
    reason?: string; 
    message?: string 
  }>;
  events?: Array<{ 
    type: string; 
    reason?: string; 
    message?: string 
  }>;
}

export interface ManagementV1KledWorkspaceInstancePersistentVolumeClaimStatus {
  capacity?: Record<string, string>;
  phase?: string;
  conditions?: Array<{ 
    status: string; 
    reason?: string; 
    message?: string 
  }>;
}
