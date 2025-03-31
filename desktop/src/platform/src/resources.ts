import { GroupVersionResource } from "./types"

export const Resources = {
  ClusterV1HelmRelease: {
    group: "cluster.loft.sh",
    version: "v1",
    kind: "HelmRelease",
  },
  V1Pod: {
    group: "",
    version: "v1",
    kind: "Pod",
  },
  V1Service: {
    group: "",
    version: "v1",
    kind: "Service",
  },
  V1Beta1PodMetrics: {
    group: "metrics.k8s.io",
    version: "v1beta1",
    kind: "PodMetrics",
  },
  V1Beta1NodeMetrics: {
    group: "metrics.k8s.io",
    version: "v1beta1",
    kind: "NodeMetrics",
  },
  VirtualClusterV1HelmRelease: {
    group: "virtualcluster.loft.sh",
    version: "v1",
    kind: "HelmRelease",
  },
  ManagementV1KledWorkspaceInstance: {
    group: "management.loft.sh",
    version: "v1",
    kind: "DevPodWorkspaceInstance",
  },
}

export function createResourceFromApiVersion(
  apiVersion: string,
  kind: string,
  metadata: { name: string; namespace?: string }
): any {
  const parts = apiVersion.split("/")
  let group = ""
  let version = ""
  if (parts.length === 1) {
    version = parts[0] || ""
  } else {
    group = parts[0] || ""
    version = parts[1] || ""
  }

  return {
    apiVersion,
    kind,
    metadata,
  }
}

export function GroupVersionResourceFromGVK(
  group: string,
  version: string,
  kind: string
): GroupVersionResource {
  let resource = ""
  if (kind.endsWith("y")) {
    resource = kind.substring(0, kind.length - 1) + "ies"
  } else {
    resource = kind + "s"
  }
  resource = resource.toLowerCase()

  return {
    group,
    version,
    resource,
  }
}
