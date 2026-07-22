import { create } from 'zustand'
import type { Environment } from '../types'

const STORAGE_KEY = 'pulse-environments'

function load(): Environment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function save(environments: Environment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(environments))
  } catch {}
}

interface EnvironmentState {
  environments: Environment[]
  activeEnvironmentId: string | null
  setEnvironments: (envs: Environment[]) => void
  addEnvironment: (name: string) => void
  renameEnvironment: (id: string, name: string) => void
  removeEnvironment: (id: string) => void
  setActiveEnvironment: (id: string | null) => void
  updateVariable: (envId: string, index: number, key: string, value: string, enabled: boolean) => void
  addVariable: (envId: string) => void
  removeVariable: (envId: string, index: number) => void
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  environments: load(),
  activeEnvironmentId: null,

  setEnvironments: (environments) => {
    save(environments)
    set({ environments })
  },

  addEnvironment: (name) =>
    set((s) => {
      const env: Environment = {
        id: crypto.randomUUID(),
        name,
        variables: [],
      }
      const environments = [...s.environments, env]
      save(environments)
      return { environments }
    }),

  renameEnvironment: (id, name) =>
    set((s) => {
      const environments = s.environments.map((e) =>
        e.id === id ? { ...e, name } : e
      )
      save(environments)
      return { environments }
    }),

  removeEnvironment: (id) =>
    set((s) => {
      const environments = s.environments.filter((e) => e.id !== id)
      save(environments)
      return {
        environments,
        activeEnvironmentId: s.activeEnvironmentId === id ? null : s.activeEnvironmentId,
      }
    }),

  setActiveEnvironment: (id) => set({ activeEnvironmentId: id }),

  updateVariable: (envId, index, key, value, enabled) =>
    set((s) => {
      const environments = s.environments.map((e) => {
        if (e.id !== envId) return e
        const vars = [...e.variables]
        vars[index] = { key, value, enabled }
        return { ...e, variables: vars }
      })
      save(environments)
      return { environments }
    }),

  addVariable: (envId) =>
    set((s) => {
      const environments = s.environments.map((e) => {
        if (e.id !== envId) return e
        return { ...e, variables: [...e.variables, { key: '', value: '', enabled: true }] }
      })
      save(environments)
      return { environments }
    }),

  removeVariable: (envId, index) =>
    set((s) => {
      const environments = s.environments.map((e) => {
        if (e.id !== envId) return e
        return { ...e, variables: e.variables.filter((_, i) => i !== index) }
      })
      save(environments)
      return { environments }
    }),
}))
