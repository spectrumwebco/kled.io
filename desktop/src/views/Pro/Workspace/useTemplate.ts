import { useTemplates } from "@/contexts"
import { TParameterWithValue, getParametersWithValues } from "@/lib"
import { ManagementV1DevPodWorkspaceInstance } from "../api/v1/devpodworkspaceinstance_types"
import { ManagementV1DevPodWorkspaceTemplate } from "../api/v1/management_v1_typesDevPodWorkspaceTemplate"
import { useMemo } from "react"

export function useTemplate(instance: ManagementV1DevPodWorkspaceInstance | undefined) {
  const { data: templates } = useTemplates()

  return useMemo<{
    parameters: readonly TParameterWithValue[]
    template: ManagementV1DevPodWorkspaceTemplate | undefined
  }>(() => {
    // find template for workspace
    const currentTemplate = templates?.workspace.find(
      (template) => instance?.spec?.templateRef?.name === template.metadata?.name
    )
    const empty = { parameters: [], template: undefined }
    if (!currentTemplate || !instance) {
      return empty
    }

    const parameters = getParametersWithValues(instance, currentTemplate)
    if (!parameters) {
      return { parameters: [], template: currentTemplate }
    }

    return { parameters, template: currentTemplate }
  }, [instance, templates])
}
