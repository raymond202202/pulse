import { useEnvironmentStore } from '../stores/environmentStore'
import { useMemo } from 'react'

export function useVariableResolver() {
  const environments = useEnvironmentStore((s) => s.environments)
  const activeId = useEnvironmentStore((s) => s.activeEnvironmentId)

  const variables = useMemo(() => {
    const env = environments.find((e) => e.id === activeId)
    if (!env) return {}
    const result: Record<string, string> = {}
    env.variables.filter((v) => v.enabled && v.key).forEach((v) => {
      result[v.key] = v.value
    })
    return result
  }, [environments, activeId])

  const resolve = (template: string): string => {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] || `{{${key}}}`
    )
  }

  return { variables, resolve, activeId }
}
