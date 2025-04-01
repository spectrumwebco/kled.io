/**
 * GPU resource configuration for Kled.io development environments
 * Provides support for CUDA, OpenCL, and other GPU acceleration frameworks
 */

export type GPUResourceType = 'cuda' | 'opencl' | 'vulkan' | 'directml' | 'metal';

export interface GPUResourceLimits {
  memory?: string; // e.g. "8GB"
  cores?: number;
  utilization?: number; // percentage 0-100
}

export interface GPUResource {
  type: GPUResourceType;
  version?: string;
  limits?: GPUResourceLimits;
  dedicated: boolean; // Whether to allocate a dedicated GPU or share
}

export interface GPUConfiguration {
  enabled: boolean;
  resources: GPUResource[];
  autoDetect: boolean; // Automatically detect available GPUs
  fallbackToCPU: boolean; // Fall back to CPU if GPU is not available
}

/**
 * Default GPU configuration with CUDA support for AI workloads on Apple Silicon
 */
export const DEFAULT_GPU_CONFIG: GPUConfiguration = {
  enabled: true,
  resources: [
    {
      type: 'cuda',
      dedicated: true,
      limits: {
        memory: '16GB',
        cores: 4,
        utilization: 80,
      },
    },
  ],
  autoDetect: true,
  fallbackToCPU: true,
};

/**
 * Apple Silicon M2 specific configuration for AI workloads
 */
export const APPLE_SILICON_M2_CONFIG: GPUConfiguration = {
  enabled: true,
  resources: [
    {
      type: 'cuda',
      dedicated: true,
      limits: {
        memory: '16GB',
        cores: 4,
        utilization: 90,
      },
    },
  ],
  autoDetect: true,
  fallbackToCPU: true,
};

/**
 * Create a GPU configuration object with specified parameters
 */
export function createGPUConfig(
  type: GPUResourceType = 'cuda',
  dedicated: boolean = true,
  memoryLimit?: string,
  coreLimit?: number
): GPUConfiguration {
  return {
    enabled: true,
    resources: [
      {
        type,
        dedicated,
        limits: {
          memory: memoryLimit,
          cores: coreLimit,
        },
      },
    ],
    autoDetect: true,
    fallbackToCPU: true,
  };
}

/**
 * Generate container environment variables for GPU configuration
 */
export function generateGPUEnvironment(config: GPUConfiguration): Record<string, string> {
  if (!config.enabled) {
    return {};
  }

  const env: Record<string, string> = {
    KLED_GPU_ENABLED: 'true',
  };

  const cudaResources = config.resources.filter(r => r.type === 'cuda');
  if (cudaResources.length > 0) {
    env.NVIDIA_VISIBLE_DEVICES = 'all';
    env.NVIDIA_DRIVER_CAPABILITIES = 'compute,utility';

    const limits = cudaResources[0].limits;
    if (limits && limits.memory) {
      env.NVIDIA_MEM_LIMIT = limits.memory;
    }

    if (limits && limits.cores) {
      env.NVIDIA_CORES = limits.cores.toString();
    }
  }

  return env;
}

/**
 * Detect available GPU resources on the host system
 */
export async function detectGPUResources(): Promise<GPUResource[]> {
  // This is a placeholder for the actual detection logic
  // In a real implementation, this would use native APIs to detect GPUs
  return [
    {
      type: 'cuda',
      version: '11.8',
      dedicated: true,
    },
  ];
}
