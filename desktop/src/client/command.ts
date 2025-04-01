interface EventEmitter<T extends string = string> {
  addListener(event: T, callback: (data: string) => void): void;
  removeListener(event: T, callback: (data: string) => void): void;
}

interface Child {
  kill(): Promise<void>;
  pid?: number;
}

interface ChildProcess<T> {
  stdout: EventEmitter<"data">;
  stderr: EventEmitter<"data">;
  on(event: string, callback: (arg: any) => void): void;
  code?: number;
}

interface ShellCommand<T> {
  stdout: EventEmitter<"data">;
  stderr: EventEmitter<"data">;
  on(event: string, callback: (arg: any) => void): void;
  spawn(): Promise<Child>;
  execute(): Promise<ChildProcess<T>>;
  sidecar(binary: string, args: string[], options?: any): ShellCommand<T>;
  create(command: string, args: string[], options?: any): ShellCommand<T>;
}

const ShellCommand = {
  sidecar: (binary: string, args: string[], options?: any): ShellCommand<string> => ({} as any),
  create: (command: string, args: string[], options?: any): ShellCommand<string> => ({} as any)
}
import { debug, ErrorTypeCancelled, isError, Result, ResultError, Return, sleep } from "../lib"
import { 
  KLED_BINARY, 
  KCLUSTER_BINARY, 
  KLEDSPACE_BINARY, 
  KPOLICY_BINARY, 
  FLAG_OPTION, 
  KLED_UI_ENV_VAR,
  API_KEY_ENV_VAR,
  API_BASE_URL_ENV_VAR
} from "./constants"
import { TStreamEvent } from "./types"
import { TAURI_SERVER_URL } from "./tauriClient"

export type TStreamEventListenerFn = (event: TStreamEvent) => void
export type TEventListener<TEventName extends string> = Parameters<
  EventEmitter<TEventName>["addListener"]
>[1]
type TStreamOptions = Readonly<{
  ignoreStdoutError?: boolean
  ignoreStderrError?: boolean
}>
const defaultStreamOptions: TStreamOptions = {
  ignoreStdoutError: false,
  ignoreStderrError: false,
}

export type TCommand<T> = {
  run(): Promise<Result<T>>
  stream(listener: TStreamEventListenerFn): Promise<ResultError>
  cancel(): Promise<ResultError>
}

export class Command implements TCommand<ChildProcess<string>> {
  private sidecarCommand: ShellCommand<string>
  private childProcess?: Child
  private args: string[]
  private cancelled = false
  private cliType: 'kled' | 'kcluster' | 'kledspace' | 'kpolicy'

  public static ADDITIONAL_ENV_VARS: string = ""
  public static HTTP_PROXY: string = ""
  public static HTTPS_PROXY: string = ""
  public static NO_PROXY: string = ""

  constructor(args: string[], cliType: 'kled' | 'kcluster' | 'kledspace' | 'kpolicy' = 'kled') {
    debug("commands", `Creating ${cliType} command with args:`, args)
    this.cliType = cliType
    const extraEnvVars = Command.ADDITIONAL_ENV_VARS.split(",")
      .map((envVarStr) => envVarStr.split("="))
      .reduce(
        (acc, pair) => {
          const [key, value] = pair
          if (key === undefined || value === undefined) {
            return acc
          }

          return { ...acc, [key]: value }
        },
        {} as Record<string, string>
      )

    // set proxy related environment variables
    if (Command.HTTP_PROXY) {
      extraEnvVars["HTTP_PROXY"] = Command.HTTP_PROXY
    }
    if (Command.HTTPS_PROXY) {
      extraEnvVars["HTTPS_PROXY"] = Command.HTTPS_PROXY
    }
    if (Command.NO_PROXY) {
      extraEnvVars["NO_PROXY"] = Command.NO_PROXY
    }

    // allows the CLI to detect if commands have been invoked from the UI
    extraEnvVars[KLED_UI_ENV_VAR] = "true"
    
    try {
      const apiKey = typeof process !== 'undefined' && process.env && 
                    (process.env as unknown as Record<string, string>)[API_KEY_ENV_VAR]
      if (apiKey) {
        extraEnvVars[API_KEY_ENV_VAR] = apiKey
      }
      
      const apiBaseUrl = typeof process !== 'undefined' && process.env && 
                        (process.env as unknown as Record<string, string>)[API_BASE_URL_ENV_VAR]
      if (apiBaseUrl) {
        extraEnvVars[API_BASE_URL_ENV_VAR] = apiBaseUrl
      }
    } catch (e) {
      console.warn('Could not access environment variables:', e)
    }

    const cliTypeProperty = 'cliType'
    extraEnvVars[cliTypeProperty] = cliType
    
    let binaryPath = KLED_BINARY
    if (cliType === 'kcluster') {
      binaryPath = KCLUSTER_BINARY
    } else if (cliType === 'kledspace') {
      binaryPath = KLEDSPACE_BINARY
    } else if (cliType === 'kpolicy') {
      binaryPath = KPOLICY_BINARY
    }
    
    const isFlatpak = typeof window !== 'undefined' && 
                     window.hasOwnProperty('__TAURI__') && 
                     (window as any).__TAURI__?.env?.TAURI_IS_FLATPAK === "true";
                     
    if (isFlatpak) {
      this.sidecarCommand = ShellCommand.create("run-path-kled-wrapper", args, {
        env: { ...extraEnvVars, ["FLATPAK_ID"]: "sh.spectrumwebco.kled" },
      })
    } else {
      this.sidecarCommand = ShellCommand.sidecar(binaryPath, args, { env: extraEnvVars })
    }
    this.args = args
  }

  public async run(): Promise<Result<ChildProcess<string>>> {
    try {
      const rawResult = await this.sidecarCommand.execute()
      debug("commands", `Result for command with args ${this.args}:`, rawResult)

      return Return.Value(rawResult)
    } catch (e) {
      return Return.Failed(e + "")
    }
  }

  public async stream(
    listener: TStreamEventListenerFn,
    streamOptions?: TStreamOptions
  ): Promise<ResultError> {
    let opts = defaultStreamOptions
    if (streamOptions) {
      opts = { ...defaultStreamOptions, ...streamOptions }
    }

    try {
      this.childProcess = await this.sidecarCommand.spawn()
      if (this.cancelled) {
        await this.childProcess.kill()

        return Return.Failed("Command already cancelled", "", ErrorTypeCancelled)
      }

      await new Promise((res, rej) => {
        const stdoutListener: TEventListener<"data"> = (message: string) => {
          try {
            const data = JSON.parse(message)

            // special case: the cli sends us a message where "done" is "true"
            // to signal the command is terminated and we should stop listen to it
            // This happens for the vscode browser command as it needs to stay open
            // for port-forwarding, but we don't care anymore about its output.
            if (data?.done === "true") {
              res(Return.Ok())
            } else {
              listener({ type: "data", data })
            }
          } catch (error) {
            if (!opts.ignoreStdoutError) {
              console.error("Failed to parse stdout message ", message, error)
            }
          }
        }
        const stderrListener: TEventListener<"data"> = (message: string) => {
          try {
            const error = JSON.parse(message)
            listener({ type: "error", error })
          } catch (error) {
            if (!opts.ignoreStderrError) {
              console.error("Failed to parse stderr message ", message, error)
            }
          }
        }

        this.sidecarCommand.stderr.addListener("data", stderrListener)
        this.sidecarCommand.stdout.addListener("data", stdoutListener)

        const cleanup = () => {
          this.sidecarCommand.stderr.removeListener("data", stderrListener)
          this.sidecarCommand.stdout.removeListener("data", stdoutListener)
          this.childProcess = undefined
        }

        this.sidecarCommand.on("close", ({ code }: { code: number }) => {
          cleanup()
          if (code !== 0) {
            rej(new Error("exit code: " + code))
          } else {
            res(Return.Ok())
          }
        })

        this.sidecarCommand.on("error", (arg: Error) => {
          cleanup()
          rej(arg)
        })
      })

      return Return.Ok()
    } catch (e) {
      if (isError(e)) {
        if (this.cancelled) {
          return Return.Failed(e.message, "", ErrorTypeCancelled)
        }

        return Return.Failed(e.message)
      }
      console.error(e)

      return Return.Failed("streaming failed")
    }
  }

  /**
   * Cancel the command.
   * Only works if it has been created with the `stream` method.
   */
  public async cancel(): Promise<Result<undefined>> {
    try {
      this.cancelled = true
      if (!this.childProcess) {
        // nothing to clean up
        return Return.Ok()
      }
      // Try to send signal first before force killing process
      await fetch(TAURI_SERVER_URL + "/child-process/signal", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          processId: this.childProcess.pid,
          signal: 2, // SIGINT
        }),
      })

      await sleep(3_000)
      // the actual child process could be gone after sending a SIGINT
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this.childProcess) {
        await this.childProcess.kill()
      }

      return Return.Ok()
    } catch (e) {
      if (isError(e)) {
        return Return.Failed(e.message)
      }

      return Return.Failed("failed to cancel command")
    }
  }
}

export function isOk(result: ChildProcess<string>): boolean {
  return result.code === 0
}

export function toFlagArg(flag: string, arg: string) {
  return [flag, arg].join("=")
}

export function serializeRawOptions(
  rawOptions: Record<string, unknown>,
  flag: string = FLAG_OPTION
): string[] {
  return Object.entries(rawOptions).map(([key, value]) => flag + `=${key}=${value}`)
}
