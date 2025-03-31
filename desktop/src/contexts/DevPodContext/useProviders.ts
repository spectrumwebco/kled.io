import { useContext } from "react"
import { TProviderManager } from "../../types"
import { KledContext, TKledContext } from "./DevPodProvider"
import { useProviderManager } from "./useProviderManager"

export function useProviders(): [TKledContext["providers"] | [undefined], TProviderManager] {
  const providers = useContext(KledContext)?.providers ?? [undefined]
  const manager = useProviderManager()

  return [providers, manager]
}
