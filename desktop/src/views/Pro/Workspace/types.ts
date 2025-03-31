import { ProWorkspaceInstance } from "@/contexts"
import { TWorkspaceResult } from "@/contexts/DevPodContext/workspaces/useWorkspace"
import { ManagementV1DevPodWorkspaceTemplate } from "../api/v1/management_v1_typesDevPodWorkspaceTemplate"

export type TTabProps = Readonly<{
  host: string
  workspace: TWorkspaceResult<ProWorkspaceInstance>
  instance: ProWorkspaceInstance
  template: ManagementV1DevPodWorkspaceTemplate | undefined
}>
