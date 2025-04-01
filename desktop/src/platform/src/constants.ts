export const API_PATHS = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  SELF: "/self",
  DEVPOD_WORKSPACE_INSTANCES: "/devpodworkspaceinstances",
  DEVPOD_WORKSPACE_TEMPLATES: "/devpodworksspacetemplates",
  DEVPOD_WORKSPACE_PRESETS: "/devpodworkspacepresets",
  DEVPOD_ENVIRONMENT_TEMPLATES: "/devpodenvironmenttemplates",
}

export const WEBSOCKET_PATHS = {
  EXEC: "/exec",
  LOGS: "/logs",
  STREAM: "/stream",
}

export const COOKIE_NAMES = {
  ACCESS_KEY: "loft_access_key",
}

export const HEADER_NAMES = {
  CLUSTER: "X-Cluster",
  VCLUSTER: "X-VCluster",
  VCLUSTER_NAMESPACE: "X-VCluster-Namespace",
  PROJECT: "X-Project",
  NAMESPACE: "X-Namespace",
}

export default {
  DEFAULT_TIMEOUT: 30000,
  DEFAULT_RETRY_COUNT: 3,
  DEFAULT_RETRY_DELAY: 1000,
}
