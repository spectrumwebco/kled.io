
export interface V1ObjectMeta {
  name?: string;
  namespace?: string;
  labels?: {[key: string]: string};
  annotations?: {[key: string]: string};
  creationTimestamp?: string;
  [key: string]: any;
}

export interface V1Container {
  name?: string;
  image?: string;
  command?: string[];
  args?: string[];
  env?: V1EnvVar[];
  envFrom?: V1EnvFromSource[];
  volumeMounts?: V1VolumeMount[];
  resources?: V1ResourceRequirements;
  [key: string]: any;
}

export interface V1EnvVar {
  name?: string;
  value?: string;
  valueFrom?: any;
}

export interface V1EnvFromSource {
  prefix?: string;
  configMapRef?: any;
  secretRef?: any;
}

export interface V1VolumeMount {
  name?: string;
  mountPath?: string;
  readOnly?: boolean;
}

export interface V1Volume {
  name?: string;
  [key: string]: any;
}

export interface V1ResourceRequirements {
  limits?: {[key: string]: string};
  requests?: {[key: string]: string};
}

export interface V1Affinity {
  nodeAffinity?: any;
  podAffinity?: any;
  podAntiAffinity?: any;
}

export interface V1Toleration {
  key?: string;
  operator?: string;
  value?: string;
  effect?: string;
  tolerationSeconds?: number;
}

export interface V1HostAlias {
  ip?: string;
  hostnames?: string[];
}
