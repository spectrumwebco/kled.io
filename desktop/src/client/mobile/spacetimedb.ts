import { Result, Return } from '../../lib';

export class MobileSpacetimeDBClient {
  private apiUrl: string;
  private debug: boolean;

  constructor(apiUrl: string = 'https://api.kled.io') {
    this.apiUrl = apiUrl;
    this.debug = false;
  }

  setDebug(debug: boolean) {
    this.debug = debug;
  }

  async connect(): Promise<Result<boolean>> {
    try {
      const response = await fetch(`${this.apiUrl}/spacetime/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return Return.Failed(`Failed to connect to SpacetimeDB: ${response.statusText}`);
      }

      return Return.Value(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (this.debug) {
        console.error('SpacetimeDB connect error:', errorMessage);
      }
      return Return.Failed(`Failed to connect to SpacetimeDB: ${errorMessage}`);
    }
  }

  async getStatus(): Promise<Result<{ running: boolean; version: string; connectedUsers: number }>> {
    try {
      const response = await fetch(`${this.apiUrl}/spacetime/status`);
      
      if (!response.ok) {
        return Return.Failed(`Failed to get SpacetimeDB status: ${response.statusText}`);
      }

      const data = await response.json();
      
      return Return.Value({
        running: data.running,
        version: data.version,
        connectedUsers: data.connected_users
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (this.debug) {
        console.error('SpacetimeDB status error:', errorMessage);
      }
      return Return.Failed(`Failed to get SpacetimeDB status: ${errorMessage}`);
    }
  }

  async executeQuery(query: string): Promise<Result<any>> {
    try {
      const response = await fetch(`${this.apiUrl}/spacetime/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        return Return.Failed(`Failed to execute SpacetimeDB query: ${response.statusText}`);
      }

      const data = await response.json();
      return Return.Value(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (this.debug) {
        console.error('SpacetimeDB query error:', errorMessage);
      }
      return Return.Failed(`Failed to execute SpacetimeDB query: ${errorMessage}`);
    }
  }

  async subscribe(table: string, callback: (data: any) => void): Promise<Result<() => void>> {
    try {
      if (this.debug) {
        console.log(`Subscribed to SpacetimeDB table: ${table}`);
      }
      
      return Return.Value(() => {
        if (this.debug) {
          console.log(`Unsubscribed from SpacetimeDB table: ${table}`);
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (this.debug) {
        console.error('SpacetimeDB subscribe error:', errorMessage);
      }
      return Return.Failed(`Failed to subscribe to SpacetimeDB: ${errorMessage}`);
    }
  }
}

export const spacetimedb = new MobileSpacetimeDBClient();
