export function arr<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

export function getProjectNamespace(projectName?: string, namespacePrefix?: string): string {
  if (!projectName) {
    return "default"
  }
  
  if (namespacePrefix) {
    return `${namespacePrefix}-${projectName}`
  }
  
  return projectName
}

export function createNewResource(resource: any): any {
  return {
    apiVersion: `${resource.group}/${resource.version}`,
    kind: resource.kind,
  }
}
