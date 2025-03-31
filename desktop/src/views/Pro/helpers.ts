import { ManagementV1DevPodWorkspacePreset } from "../api/v1/management_v1_typesDevPodWorkspacePreset"

export function presetDisplayName(preset: ManagementV1DevPodWorkspacePreset | undefined) {
  return preset?.spec?.displayName ?? preset?.metadata?.name
}
