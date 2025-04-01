
export interface ManagementV1Self {
  user?: string;
  accessKey?: string;
  admin?: boolean;
  teams?: string[];
  annotations?: {[key: string]: string};
}

export interface ManagementV1Project {
  name?: string;
  displayName?: string;
  description?: string;
  teams?: string[];
  users?: string[];
  clusters?: string[];
  hibernation?: boolean;
  [key: string]: any;
}

export interface ManagementV1Cluster {
  name?: string;
  displayName?: string;
  description?: string;
  access?: {
    users?: string[];
    teams?: string[];
  };
  hibernation?: boolean;
  [key: string]: any;
}

export interface ManagementV1ProjectTemplates {
  templates?: ManagementV1DevPodWorkspaceTemplate[];
  environmentTemplates?: ManagementV1DevPodEnvironmentTemplate[];
  presets?: ManagementV1DevPodWorkspacePreset[];
}

export interface ManagementV1ProjectClusters {
  clusters?: ManagementV1Cluster[];
}

export interface ManagementV1UserProfile {
  user?: string;
  gitCredentials?: {
    [key: string]: {
      user?: string;
      accessToken?: string;
    };
  };
}

export interface ManagementV1DevPodWorkspaceTemplate {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    name?: string;
    namespace?: string;
    [key: string]: any;
  };
  spec?: {
    displayName?: string;
    description?: string;
    template?: any;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ManagementV1DevPodEnvironmentTemplate {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    name?: string;
    namespace?: string;
    [key: string]: any;
  };
  spec?: {
    displayName?: string;
    description?: string;
    template?: any;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ManagementV1DevPodWorkspacePreset {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    name?: string;
    namespace?: string;
    [key: string]: any;
  };
  spec?: {
    displayName?: string;
    description?: string;
    template?: any;
    [key: string]: any;
  };
  [key: string]: any;
}
