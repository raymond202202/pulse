import { create } from 'zustand'
import type { Collection } from '../types'

interface CollectionState {
  collections: Collection[]
  setCollections: (collections: Collection[]) => void
  addCollection: (collection: Collection) => void
  removeCollection: (id: string) => void
}

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: [],
  setCollections: (collections) => set({ collections }),
  addCollection: (collection) =>
    set((s) => ({ collections: [...s.collections, collection] })),
  removeCollection: (id) =>
    set((s) => ({ collections: s.collections.filter((c) => c.id !== id) })),
}))
