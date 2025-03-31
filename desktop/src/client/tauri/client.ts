import { app, event, path } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import * as clipboard from "@tauri-apps/plugin-clipboard-manager";
import * as dialog from "@tauri-apps/plugin-dialog";
import * as fs from "@tauri-apps/plugin-fs";
import * as log from "@tauri-apps/plugin-log";
import * as os from "@tauri-apps/plugin-os";
import * as process from "@tauri-apps/plugin-process";
import * as shell from "@tauri-apps/plugin-shell";
import { Result, Return } from "../../lib";
import { spacetimedb, TauriSpacetimeDBClient } from './spacetimedb';

class TauriClient {
  private debug = false;
  public readonly spacetimedb: TauriSpacetimeDBClient;
  
  constructor() {
    this.spacetimedb = spacetimedb;
  }
  
  setDebug(debug: boolean) {
    this.debug = debug;
    this.spacetimedb.setDebug(debug);
  }
  
  async getSpacetimeStatus(): Promise<Result<{ running: boolean; version: string; connectedUsers: number }>> {
    return this.spacetimedb.getStatus();
  }
  
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string) {
    const logFn = log[level];
    logFn(message);
  }
  
  async connectToSpacetimeDB(): Promise<Result<boolean>> {
    return this.spacetimedb.connect();
  }
  
  async executeSpacetimeQuery(query: string): Promise<Result<any>> {
    return this.spacetimedb.executeQuery(query);
  }
  
  async subscribeToSpacetimeTable(table: string, callback: (data: any) => void): Promise<Result<() => void>> {
    return this.spacetimedb.subscribe(table, callback);
  }
}

export const client = new TauriClient();
