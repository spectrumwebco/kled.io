export type GroupVersionResource = {
  group: string
  version: string
  resource: string
}

export type RequestOptions = {
  [key: string]: any
}

export type RequestOptionsCluster = RequestOptions & {
  cluster: string
}

export type RequestOptionsVCluster = RequestOptions & {
  vCluster: string
  vClusterNamespace?: string
}

export type RequestOptionsProject = RequestOptions & {
  project: string
}

export type RequestOptionsSpace = RequestOptions & {
  space: string
}

export type RequestOptionsNamespace = RequestOptions & {
  namespace: string
}

export type GetOptions = RequestOptions & {
  subresource?: string
}

export type ListOptions = RequestOptions & {
  limit?: number
  continue?: string
  labelSelector?: string
  fieldSelector?: string
  timeoutSeconds?: number
  resourceVersion?: string
  resourceVersionMatch?: string
  watch?: boolean
  allowWatchBookmarks?: boolean
}

export type CreateOptions = RequestOptions & {
  dryRun?: string[]
  fieldManager?: string
}

export type UpdateOptions = RequestOptions & {
  dryRun?: string[]
  fieldManager?: string
}

export type PatchOptions = RequestOptions & {
  dryRun?: string[]
  fieldManager?: string
  force?: boolean
  patchType?: "json" | "merge" | "strategic"
}

export type DeleteOptions = RequestOptions & {
  gracePeriodSeconds?: number
  propagationPolicy?: string
  dryRun?: string[]
}

export type LogOptions = RequestOptions & {
  container?: string
  follow?: boolean
  previous?: boolean
  sinceSeconds?: number
  tailLines?: number
  timestamps?: boolean
  limitBytes?: number
}

export type ExecOptions = RequestOptions & {
  stdin?: boolean
  stdout?: boolean
  stderr?: boolean
  tty?: boolean
}

export type List<T> = {
  kind: string
  apiVersion: string
  metadata: {
    resourceVersion: string
    continue?: string
  }
  items: T[]
}

export type Unstructured = {
  apiVersion: string
  kind: string
  metadata: {
    name: string
    namespace?: string
    [key: string]: any
  }
  [key: string]: any
}

export type V1AccessKey = {
  name: string
  accessKey: string
}

export type V1Table = {
  kind: string
  apiVersion: string
  metadata: {
    resourceVersion: string
    continue?: string
  }
  columnDefinitions: {
    name: string
    type: string
    format: string
    description: string
    priority: number
  }[]
  rows: {
    cells: any[]
    object: Unstructured
  }[]
}

export type VersionV1Version = {
  version: string
  buildDate: string
  goVersion: string
  compiler: string
  platform: string
}
