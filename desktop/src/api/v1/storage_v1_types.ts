
export interface StorageV1Condition {
  type?: string;
  status?: string;
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
}

export interface StorageV1AppParameter {
  variable?: string;
  label?: string;
  description?: string;
  type?: string;
  required?: boolean;
  default?: string;
  validation?: string;
  options?: string[];
}

export interface StorageV1TemplateMetadata {
  name?: string;
  namespace?: string;
  [key: string]: any;
}

export interface StorageV1UserOrTeam {
  user?: string;
  team?: string;
}

export interface StorageV1Access {
  name?: string;
  verbs?: string[];
}

export interface StorageV1DevPodWorkspaceTemplateVersion {
  apiVersion?: string;
  kind?: string;
  metadata?: StorageV1TemplateMetadata;
  spec?: {
    template?: any;
    [key: string]: any;
  };
}
