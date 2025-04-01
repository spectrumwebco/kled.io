import { useProContext } from "@/contexts"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { QueryKeys } from "@/queryKeys"
import { ManagementV1DevPodWorkspaceTemplate } from "../api/v1/management_v1_typesDevPodWorkspaceTemplate"
import { ManagementV1DevPodEnvironmentTemplate } from "../api/v1/management_v1_typesDevPodEnvironmentTemplate"
import { ManagementV1DevPodWorkspacePreset } from "../api/v1/management_v1_typesDevPodWorkspacePreset"

type TTemplates = Readonly<{
  default: ManagementV1DevPodWorkspaceTemplate | undefined
  workspace: readonly ManagementV1DevPodWorkspaceTemplate[]
  environment: readonly ManagementV1DevPodEnvironmentTemplate[]
  presets: readonly ManagementV1DevPodWorkspacePreset[]
}>
export function useTemplates(): UseQueryResult<TTemplates> {
  const { host, currentProject, client } = useProContext()
  const query = useQuery<TTemplates>({
    queryKey: QueryKeys.proWorkspaceTemplates(host, currentProject?.metadata!.name!),
    queryFn: async () => {
      const projectTemplates = (
        await client.getProjectTemplates(currentProject?.metadata!.name!)
      ).unwrap()

      // try to find default template in list
      let defaultTemplate: ManagementV1DevPodWorkspaceTemplate | undefined = undefined
      if (projectTemplates?.defaultDevPodWorkspaceTemplate) {
        defaultTemplate = projectTemplates.devPodWorkspaceTemplates?.find(
          (template) => template.metadata?.name === projectTemplates.defaultDevPodWorkspaceTemplate
        )
      }

      return {
        default: defaultTemplate,
        workspace: projectTemplates?.devPodWorkspaceTemplates ?? [],
        environment: projectTemplates?.devPodEnvironmentTemplates ?? [],
        presets: projectTemplates?.devPodWorkspacePresets ?? [],
      }
    },
    enabled: !!currentProject,
  })

  return query
}
