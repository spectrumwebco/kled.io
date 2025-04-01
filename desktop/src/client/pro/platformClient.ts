import { ProWorkspaceInstance } from "../../contexts"
import { DaemonStatus } from "../../gen"
import { ManagementV1DevPodWorkspaceInstance } from "../api/v1/devpodworkspaceinstance_types"
import { ManagementV1Project } from "../api/v1/management_v1_typesProject"
import { ManagementV1ProjectClusters } from "../api/v1/management_v1_typesProjectClusters"
import { ManagementV1ProjectTemplates } from "../api/v1/management_v1_typesProjectTemplates"
import { ManagementV1Self } from "../api/v1/management_v1_typesSelf"
import { ManagementV1UserProfile } from "../api/v1/management_v1_typesUserProfile"
import { Client } from "../../platform/src/client"
import { Result, ResultError, Return, isError } from "../../lib"
import {
  TGitCredentialHelperData,
  TImportWorkspaceConfig,
  TListProInstancesConfig,
  TPlatformHealthCheck,
  TPlatformVersionInfo,
  TProID,
  TProInstance,
} from "../../types"
import { TAURI_SERVER_URL } from "../tauriClient"
import { TDebuggable, TStreamEventListenerFn } from "../types"
import { ProCommands } from "./proCommands"
import { client as globalClient } from "../../client"

export class PlatformClient implements TDebuggable {
  private client: Client

  constructor(protected readonly id: string) {
    this.client = new Client("", "", false)
  }

  public setDebug(isEnabled: boolean): void {
    this.client.setDebug(isEnabled)
  }

  public async login(
    host: string,
    accessKey?: string,
    listener?: TStreamEventListenerFn
  ): Promise<ResultError> {
    this.client.setBaseUrl(host)
    if (accessKey) {
      const result = await this.client.loginWithAccessKey(accessKey)
      if (result.err) {
        return Return.Failed(result.err)
      }
    }
    return Return.Failed("")
  }

  public async checkHealth(): Promise<Result<TPlatformHealthCheck>> {
    const result = await this.client.getSelf()
    if (result.err) {
      return Return.Value({ healthy: false, details: [result.err], loginRequired: true })
    }
    return Return.Value({ healthy: true, details: [], loginRequired: false })
  }

  public async getVersion() {
    return this.client.getVersion()
  }

  public async getSelf(): Promise<Result<ManagementV1Self>> {
    const result = await this.client.getSelf()
    if (result.err) {
      return Return.Failed(result.err)
    }
    return Return.Value(result.val as unknown as ManagementV1Self)
  }

  public async listProjects(): Promise<Result<readonly ManagementV1Project[]>> {
    const result = await this.client.list({ group: "management.loft.sh", version: "v1", resource: "projects" })
    if (result.err) {
      return Return.Failed(result.err)
    }
    if (!result.val || !result.val.items) {
      return Return.Value([])
    }
    return Return.Value(result.val.items as unknown as readonly ManagementV1Project[])
  }

  public async getProjectTemplates(
    projectName: string
  ): Promise<Result<ManagementV1ProjectTemplates>> {
    const result = await this.client.get(
      { group: "management.loft.sh", version: "v1", resource: "projects" },
      projectName,
      { subresource: "templates" }
    )
    if (result.err) {
      return Return.Failed(result.err)
    }
    return Return.Value(result.val as unknown as ManagementV1ProjectTemplates)
  }

  public async getProjectClusters(
    projectName: string
  ): Promise<Result<ManagementV1ProjectClusters>> {
    const result = await this.client.get(
      { group: "management.loft.sh", version: "v1", resource: "projects" },
      projectName,
      { subresource: "clusters" }
    )
    if (result.err) {
      return Return.Failed(result.err)
    }
    return Return.Value(result.val as unknown as ManagementV1ProjectClusters)
  }

  public async createWorkspace(
    instance: ManagementV1DevPodWorkspaceInstance
  ): Promise<Result<ManagementV1DevPodWorkspaceInstance>> {
    const result = await this.client.create(
      { group: "management.loft.sh", version: "v1", resource: "devpodworkspaceinstances" },
      instance
    )
    if (result.err) {
      return Return.Failed(result.err)
    }
    return Return.Value(result.val as unknown as ManagementV1DevPodWorkspaceInstance)
  }

  public async updateWorkspace(
    instance: ManagementV1DevPodWorkspaceInstance
  ): Promise<Result<ManagementV1DevPodWorkspaceInstance>> {
    const result = await this.client.update(
      { group: "management.loft.sh", version: "v1", resource: "devpodworkspaceinstances" },
      instance.metadata?.name || "",
      instance,
      { namespace: instance.metadata?.namespace }
    )
    if (result.err) {
      return Return.Failed(result.err)
    }
    return Return.Value(result.val as unknown as ManagementV1DevPodWorkspaceInstance)
  }
}

export class PlatformDaemonClient extends PlatformClient {
  constructor(id: string) {
    super(id)
  }

  private handleError<T>(err: unknown, fallbackMsg: string): Result<T> {
    if (isError(err)) {
      return Return.Failed(err.message)
    }

    if (typeof err === "string") {
      return Return.Failed(`${fallbackMsg}: ${err}`)
    }

    return Return.Failed(fallbackMsg)
  }

  private async getProxy<T>(path: string): Promise<Result<T>> {
    try {
      const res = await fetch(`${TAURI_SERVER_URL}/daemon-proxy/${this.id}${path}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
      if (!res.ok) {
        const maybeText = await res.text()

        let errMessage = `Get resource: ${res.statusText}.`
        if (maybeText) {
          errMessage += maybeText
        }

        return Return.Failed(errMessage)
      }
      const json: T = await res.json()

      return Return.Value(json)
    } catch (e) {
      return this.handleError(e, "unable to get resource")
    }
  }

  private async get<T>(path: string): Promise<Result<T>> {
    try {
      const res = await fetch(`${TAURI_SERVER_URL}${path}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
      if (!res.ok) {
        return Return.Failed(`Get resource: ${res.statusText}`)
      }

      const json: T = await res.json().catch(() => "")

      return Return.Value(json)
    } catch (e) {
      return this.handleError(e, "unable to get resource")
    }
  }

  private async post<T>(path: string, body: BodyInit): Promise<Result<T>> {
    try {
      const res = await fetch(`${TAURI_SERVER_URL}/daemon-proxy/${this.id}${path}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body,
      })
      if (!res.ok) {
        return Return.Failed(`Error getting resource ${path} : ${res.statusText}`)
      }
      const json: T = await res.json()

      return Return.Value(json)
    } catch (e) {
      return this.handleError(e, "unable to get resource")
    }
  }

  public async restartDaemon() {
    return this.get(`/daemon/${this.id}/restart`)
  }

  public async checkHealth(): Promise<Result<TPlatformHealthCheck>> {
    const res = await this.get<DaemonStatus>(`/daemon/${this.id}/status`)
    if (!res.ok) {
      return res
    }
    const status = res.val
    let healthy = status.state === "running"

    const details: string[] = []
    if (status.loginRequired) {
      healthy = false
      details.push("Login required to connect to platform")
    }
    if (status.state === "pending") {
      details.push("Daemon is starting up")
    }

    return Return.Value({ healthy, details, loginRequired: status.loginRequired })
  }

  public async getUserProfile(): Promise<Result<ManagementV1UserProfile>> {
    return this.getProxy("/user-profile")
  }

  public async updateUserProfile(
    userProfile: ManagementV1UserProfile
  ): Promise<Result<ManagementV1UserProfile>> {
    try {
      const body = JSON.stringify(userProfile)
      const res = (await this.post("/update-user-profile", body)) as Result<ManagementV1UserProfile>

      return res
    } catch (e) {
      return this.handleError(e, "failed to update workspace")
    }
  }

  public async queryGitCredentialsHelper(
    host: string
  ): Promise<Result<TGitCredentialHelperData | undefined>> {
    const searchParams = new URLSearchParams([["host", host]])

    return this.getProxy("/git-credentials?" + searchParams.toString())
  }
}
