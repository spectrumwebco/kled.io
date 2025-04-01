import { API_PATHS, COOKIE_NAMES, HEADER_NAMES, WEBSOCKET_PATHS } from "./constants"
import { arr } from "./helpers"
import { NewResource, Resources } from "./resources"
import {
  ErrorTypeNetwork,
  ErrorTypeNotFound,
  ErrorTypeServiceUnavailable,
  ErrorTypeUnauthorized,
  MapErrorCode,
  Result,
  ResultError,
  Return,
} from "./result"
import {
  CreateOptions,
  DeleteOptions,
  ExecOptions,
  GetOptions,
  GroupVersionResource,
  List,
  ListOptions,
  LogOptions,
  PatchOptions,
  RequestOptions,
  RequestOptionsCluster,
  RequestOptionsNamespace,
  RequestOptionsProject,
  RequestOptionsSpace,
  RequestOptionsVCluster,
  Unstructured,
  UpdateOptions,
  V1AccessKey,
  V1Table,
  VersionV1Version,
} from "./types"

export class Client {
  private baseUrl: string
  private accessKey: string | null
  private debug: boolean

  constructor(baseUrl: string, accessKey?: string, debug?: boolean) {
    this.baseUrl = baseUrl
    this.accessKey = accessKey || null
    this.debug = debug || false
  }

  public setDebug(debug: boolean): void {
    this.debug = debug
  }

  public getBaseUrl(): string {
    return this.baseUrl
  }

  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl
  }

  public getAccessKey(): string | null {
    return this.accessKey
  }

  public setAccessKey(accessKey: string | null): void {
    this.accessKey = accessKey
  }

  public async login(
    username: string,
    password: string
  ): Promise<Result<any>> {
    const result = await this.request<any>(
      API_PATHS.LOGIN,
      {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      },
      false
    )

    if (result.err) {
      return result
    }

    this.accessKey = result.val.status?.accessKey || null
    return result
  }

  public async loginWithAccessKey(
    accessKey: string
  ): Promise<Result<any>> {
    this.accessKey = accessKey
    const result = await this.getSelf()
    if (result.err) {
      this.accessKey = null
      return result
    }
    return result
  }

  public async logout(): Promise<Result<void>> {
    this.accessKey = null
    return Return.Value(undefined)
  }

  public async getSelf(): Promise<Result<any>> {
    return this.request<any>(API_PATHS.SELF, {}, true)
  }

  public async getVersion(): Promise<Result<VersionV1Version>> {
    return this.request<VersionV1Version>("/version", {}, true)
  }

  public async get<T>(
    resource: GroupVersionResource,
    name: string,
    options?: GetOptions
  ): Promise<Result<T>> {
    const path = this.buildResourcePath(resource, name, options)
    return this.request<T>(path, {}, true, options)
  }

  public async list<T>(
    resource: GroupVersionResource,
    options?: ListOptions
  ): Promise<Result<List<T>>> {
    const path = this.buildResourcePath(resource, "", options)
    return this.request<List<T>>(path, {}, true, options)
  }

  public async create<T>(
    resource: GroupVersionResource,
    object: T,
    options?: CreateOptions
  ): Promise<Result<T>> {
    const path = this.buildResourcePath(resource, "", options)
    return this.request<T>(
      path,
      {
        method: "POST",
        body: JSON.stringify(object),
      },
      true,
      options
    )
  }

  public async update<T>(
    resource: GroupVersionResource,
    name: string,
    object: T,
    options?: UpdateOptions
  ): Promise<Result<T>> {
    const path = this.buildResourcePath(resource, name, options)
    return this.request<T>(
      path,
      {
        method: "PUT",
        body: JSON.stringify(object),
      },
      true,
      options
    )
  }

  public async delete<T>(
    resource: GroupVersionResource,
    name: string,
    options?: DeleteOptions
  ): Promise<Result<T>> {
    const path = this.buildResourcePath(resource, name, options)
    return this.request<T>(
      path,
      {
        method: "DELETE",
      },
      true,
      options
    )
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
    authenticated = true,
    options?: RequestOptions
  ): Promise<Result<T>> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...init.headers,
      }

      if (authenticated && this.accessKey) {
        headers["Authorization"] = `Bearer ${this.accessKey}`
      }

      if (options) {
        if ((options as RequestOptionsCluster).cluster) {
          headers[HEADER_NAMES.CLUSTER] = (options as RequestOptionsCluster).cluster
        }

        if ((options as RequestOptionsVCluster).vCluster) {
          headers[HEADER_NAMES.VCLUSTER] = (options as RequestOptionsVCluster).vCluster
        }

        if ((options as RequestOptionsProject).project) {
          headers[HEADER_NAMES.PROJECT] = (options as RequestOptionsProject).project
        }

        if ((options as RequestOptionsSpace).space) {
          headers[HEADER_NAMES.SPACE] = (options as RequestOptionsSpace).space
        }

        if ((options as RequestOptionsNamespace).namespace) {
          headers[HEADER_NAMES.NAMESPACE] = (options as RequestOptionsNamespace).namespace
        }
      }

      const url = new URL(path, this.baseUrl)
      const response = await fetch(url.toString(), {
        ...init,
        headers,
      })

      if (!response.ok) {
        return Return.Failed(
          `${response.status} ${response.statusText}`,
          MapErrorCode(response.status)
        )
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        try {
          const data = (await response.json()) as T
          return Return.Value(data)
        } catch (e) {
          return Return.Failed(`Failed to parse JSON response: ${e}`)
        }
      }

      try {
        const data = (await response.text()) as unknown as T
        return Return.Value(data)
      } catch (e) {
        return Return.Failed(`Failed to parse response: ${e}`)
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes("Failed to fetch") || e.message.includes("Network request failed")) {
          return Return.Failed(e.message, ErrorTypeNetwork)
        }
      }
      return Return.Failed(`${e}`)
    }
  }

  private buildResourcePath(
    resource: GroupVersionResource,
    name: string,
    options?: RequestOptions
  ): string {
    const { group, version, resource: resourceName } = resource
    let path = ""

    if (group === "") {
      path = `/api/${version}`
    } else {
      path = `/apis/${group}/${version}`
    }

    if ((options as RequestOptionsNamespace)?.namespace) {
      path += `/namespaces/${(options as RequestOptionsNamespace).namespace}`
    }

    path += `/${resourceName}`

    if (name) {
      path += `/${name}`
    }

    return path
  }
}
