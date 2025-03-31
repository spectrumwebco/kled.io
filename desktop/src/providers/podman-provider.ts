/**
 * Kled.io Podman Provider
 *
 * This provider enables development environments using Podman instead of Docker.
 * It allows for rootless containers and better security, with full support for
 * GPU acceleration and other Kled.io features.
 */

import { generateGPUEnvironment, GPUConfiguration, DEFAULT_GPU_CONFIG } from '../config/gpu-resources';

export interface PodmanProviderOptions {
  name: string;
  gpuConfig?: GPUConfiguration;
  podmanVersion?: string;
  rootless?: boolean;
  securityOptions?: string[];
  supportAppleSilicon?: boolean;
  memoryLimit?: string;
  cpuLimit?: number;
}

export const DEFAULT_PODMAN_PROVIDER_OPTIONS: PodmanProviderOptions = {
  name: 'podman',
  gpuConfig: DEFAULT_GPU_CONFIG,
  podmanVersion: '4.0',
  rootless: true,
  securityOptions: ['seccomp=unconfined'],
  supportAppleSilicon: true,
  memoryLimit: '8Gi',
  cpuLimit: 4,
};

export class PodmanProvider {
  private options: PodmanProviderOptions;

  constructor(options: Partial<PodmanProviderOptions> = {}) {
    this.options = {
      ...DEFAULT_PODMAN_PROVIDER_OPTIONS,
      ...options,
    };
  }

  /**
   * Generate provider configuration for Kled.io
   */
  generateProviderConfig(): Record<string, any> {
    const gpuEnv = generateGPUEnvironment(
      this.options.gpuConfig || DEFAULT_GPU_CONFIG
    );

    // Base environment variables
    const environment: Record<string, string> = {
      KLED_PODMAN_ENABLED: 'true',
      KLED_PODMAN_VERSION: this.options.podmanVersion || '4.0',
      KLED_PODMAN_ROOTLESS: this.options.rootless ? 'true' : 'false',
      ...gpuEnv,
    };

    // Handle Apple Silicon specific configuration
    if (this.options.supportAppleSilicon) {
      environment.KLED_APPLE_SILICON_ENABLED = 'true';
    }

    return {
      name: this.options.name,
      binaries: ['podman'],
      options: {
        container: {
          engine: 'podman',
          security: {
            rootless: this.options.rootless,
            securityOptions: this.options.securityOptions,
          },
          env: environment,
          resources: {
            memory: this.options.memoryLimit,
            cpu: this.options.cpuLimit,
          },
        },
      },
    };
  }

  /**
   * Register the podman provider with Kled.io
   */
  async register(): Promise<void> {
    // This would call into the Kled.io API to register the provider
    console.log('Registering Podman Provider:', this.options.name);
    // Implementation would depend on the actual Kled.io API
  }
}

/**
 * Create and register a default podman provider
 */
export async function createDefaultPodmanProvider(): Promise<PodmanProvider> {
  const provider = new PodmanProvider();
  await provider.register();
  return provider;
}
