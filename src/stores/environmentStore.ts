import { create } from 'zustand'
import type { Environment } from '../types'

interface EnvironmentState {
  environments: Environment[]
  activeEnvironmentId: string | null
  setEnvironments: (envs: Environment[]) => void
  addEnvironment: (env: Environment) => void
  removeEnvironment: (id: string) => void
  setActiveEnvironment: (id: string | null) => void
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  environments: [],
  activeEnvironmentId: null,
  setEnvironments: (environments) => set({ environments }),
  addEnvironment: (env) =>
    set((s) => ({ environments: [...s.environments, env] })),
  removeEnvironment: (id) =>
    set((s) => ({ environments: s.environments.filter((e) => e.id !== id) })),
  setActiveEnvironment: (id) => set({ activeEnvironmentId: id }),
}))
