import { Result, Return } from '../../lib';
import { spacetimedb, MobileSpacetimeDBClient } from './spacetimedb';

class MobileClient {
  private debug = false;
  public readonly spacetimedb: MobileSpacetimeDBClient;
  
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
    if (level === 'debug' && !this.debug) {
      return;
    }
    
    switch (level) {
      case 'debug':
        console.debug(message);
        break;
      case 'info':
        console.info(message);
        break;
      case 'warn':
        console.warn(message);
        break;
      case 'error':
        console.error(message);
        break;
    }
  }
  
  async checkPushNotificationPermission(): Promise<boolean> {
    return false;
  }
  
  async requestPushNotificationPermission(): Promise<boolean> {
    return false;
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

export const client = new MobileClient();
