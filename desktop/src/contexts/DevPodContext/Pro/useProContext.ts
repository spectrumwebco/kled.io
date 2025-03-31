import { ProClient } from "@/client"
import { TWorkspaceOwnerFilterState } from "@/components"
import { ManagementV1Project } from "../api/v1/management_v1_typesProject"
import { ManagementV1Self } from "../api/v1/management_v1_typesSelf"
import { UseQueryResult } from "@tanstack/react-query"
import { Dispatch, SetStateAction, createContext, useContext } from "react"

export type TProContext = Readonly<{
  managementSelfQuery: UseQueryResult<ManagementV1Self | undefined>
  currentProject?: ManagementV1Project
  host: string
  client: ProClient
  isLoadingWorkspaces: boolean
  ownerFilter: TWorkspaceOwnerFilterState
  setOwnerFilter: Dispatch<SetStateAction<TWorkspaceOwnerFilterState>>
}>
export const ProContext = createContext<TProContext>(null!)

export function useProContext() {
  return useContext(ProContext)
}
