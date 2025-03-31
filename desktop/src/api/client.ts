import { Client } from "../platform/src/client"
import { DevPodWorkspaceInstance, DevPodWorkspaceInstanceList } from "./v1/devpodworkspaceinstance_types"
import { Result, Return } from "../platform/src/result"

export class ApiClient {
  private client: Client

  constructor(baseUrl: string, accessKey?: string, debug?: boolean) {
    this.client = new Client(baseUrl, accessKey, debug)
  }

  public setDebug(isEnabled: boolean): void {
    this.client.setDebug(isEnabled)
  }

  public getBaseUrl(): string {
    return this.client.getBaseUrl()
  }

  public setBaseUrl(baseUrl: string): void {
    this.client.setBaseUrl(baseUrl)
  }

  public getAccessKey(): string | null {
    return this.client.getAccessKey()
  }

  public setAccessKey(accessKey: string | null): void {
    this.client.setAccessKey(accessKey)
  }

  public async login(username: string, password: string): Promise<Result<any>> {
    return this.client.login(username, password)
  }

  public async loginWithAccessKey(accessKey: string): Promise<Result<any>> {
    return this.client.loginWithAccessKey(accessKey)
  }

  public async logout(): Promise<Result<void>> {
    return this.client.logout()
  }

  public async getSelf(): Promise<Result<any>> {
    return this.client.getSelf()
  }

  public async listWorkspaceInstances(namespace?: string): Promise<Result<DevPodWorkspaceInstanceList>> {
    return this.client.list(
      { group: "storage.loft.sh", version: "v1", resource: "devpodworkspaceinstances" },
      { namespace }
    )
  }

  public async getWorkspaceInstance(name: string, namespace?: string): Promise<Result<DevPodWorkspaceInstance>> {
    return this.client.get(
      { group: "storage.loft.sh", version: "v1", resource: "devpodworkspaceinstances" },
      name,
      { namespace }
    )
  }

  public async createWorkspaceInstance(
    instance: DevPodWorkspaceInstance
  ): Promise<Result<DevPodWorkspaceInstance>> {
    return this.client.create(
      { group: "storage.loft.sh", version: "v1", resource: "devpodworkspaceinstances" },
      instance
    )
  }

  public async updateWorkspaceInstance(
    instance: DevPodWorkspaceInstance
  ): Promise<Result<DevPodWorkspaceInstance>> {
    if (!instance.metadata?.name) {
      return Return.Failed("Workspace instance name is required")
    }
    
    return this.client.update(
      { group: "storage.loft.sh", version: "v1", resource: "devpodworkspaceinstances" },
      instance.metadata.name,
      instance,
      { namespace: instance.metadata?.namespace }
    )
  }

  public async deleteWorkspaceInstance(
    name: string,
    namespace?: string
  ): Promise<Result<DevPodWorkspaceInstance>> {
    return this.client.delete(
      { group: "storage.loft.sh", version: "v1", resource: "devpodworkspaceinstances" },
      name,
      { namespace }
    )
  }
}
