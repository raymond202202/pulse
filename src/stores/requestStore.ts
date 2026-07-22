import { create } from 'zustand'
import type { ApiRequest, ApiResponse, HttpMethod, KeyValue, RequestBody, AuthConfig } from '../types'

interface RequestState {
  request: ApiRequest
  response: ApiResponse | null
  loading: boolean
  error: string | null

  setMethod: (method: HttpMethod) => void
  setUrl: (url: string) => void
  setHeaders: (headers: KeyValue[]) => void
  setQueryParams: (params: KeyValue[]) => void
  setBody: (body: RequestBody | undefined) => void
  setAuth: (auth: AuthConfig | undefined) => void
  setResponse: (response: ApiResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetResponse: () => void
}

const createEmptyRequest = (): ApiRequest => ({
  id: crypto.randomUUID(),
  name: 'New Request',
  method: 'GET',
  url: '',
  headers: [{ key: '', value: '', enabled: true }],
  queryParams: [],
  body: { mode: 'none' },
  auth: { authType: 'none' },
})

export const useRequestStore = create<RequestState>((set) => ({
  request: createEmptyRequest(),
  response: null,
  loading: false,
  error: null,

  setMethod: (method) => set((s) => ({ request: { ...s.request, method } })),
  setUrl: (url) => set((s) => ({ request: { ...s.request, url } })),
  setHeaders: (headers) => set((s) => ({ request: { ...s.request, headers } })),
  setQueryParams: (queryParams) => set((s) => ({ request: { ...s.request, queryParams } })),
  setBody: (body) => set((s) => ({ request: { ...s.request, body } })),
  setAuth: (auth) => set((s) => ({ request: { ...s.request, auth } })),
  setResponse: (response) => set({ response, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  resetResponse: () => set({ response: null, error: null }),
}))
