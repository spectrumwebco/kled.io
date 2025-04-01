import { ApiClient } from "../../api/client"
import { DevPodWorkspaceInstance } from "../../api/v1/devpodworkspaceinstance_types"
import { Result, Return } from "../../platform/src/result"
import { TDebuggable, TStreamEventListenerFn } from "../types"

export class KledApiClient implements TDebuggable {
  private client: ApiClient

  constructor(protected readonly id: string) {
    this.client = new ApiClient("", "", false)
  }

  public setDebug(isEnabled: boolean): void {
    this.client.setDebug(isEnabled)
  }

  public async login(
    host: string,
    accessKey?: string,
    listener?: TStreamEventListenerFn
  ): Promise<Result<any>> {
    this.client.setBaseUrl(host)
    if (accessKey) {
      const result = await this.client.loginWithAccessKey(accessKey)
      if (result.err) {
        return Return.Failed(result.err)
      }
      return result
    }
    return Return.Failed("No access key provided")
  }

  public async checkHealth(): Promise<Result<any>> {
    const result = await this.client.getSelf()
    if (result.err) {
      return Return.Failed(result.err)
    }
    return Return.Value({ healthy: true, details: [], loginRequired: false })
  }

  public async getSelf(): Promise<Result<any>> {
    return this.client.getSelf()
  }

  public async listWorkspaceInstances(namespace?: string): Promise<Result<any>> {
    return this.client.listWorkspaceInstances(namespace)
  }

  public async getWorkspaceInstance(name: string, namespace?: string): Promise<Result<DevPodWorkspaceInstance>> {
    return this.client.getWorkspaceInstance(name, namespace)
  }

  public async createWorkspaceInstance(
    instance: DevPodWorkspaceInstance
  ): Promise<Result<DevPodWorkspaceInstance>> {
    return this.client.createWorkspaceInstance(instance)
  }

  public async updateWorkspaceInstance(
    instance: DevPodWorkspaceInstance
  ): Promise<Result<DevPodWorkspaceInstance>> {
    return this.client.updateWorkspaceInstance(instance)
  }

  public async deleteWorkspaceInstance(
    name: string,
    namespace?: string
  ): Promise<Result<DevPodWorkspaceInstance>> {
    return this.client.deleteWorkspaceInstance(name, namespace)
  }
}
