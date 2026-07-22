export interface KeyValue {
  key: string
  value: string
  enabled: boolean
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export type BodyMode = 'none' | 'json' | 'xml' | 'formdata' | 'formurlencoded' | 'binary' | 'graphql' | 'raw'

export type AuthType = 'none' | 'bearer' | 'basic' | 'apikey' | 'oauth2'

export interface RequestBody {
  mode: BodyMode
  raw?: string
  formData?: KeyValue[]
  formUrlEncoded?: KeyValue[]
  graphqlQuery?: string
  graphqlVariables?: string
}

export interface AuthConfig {
  authType: AuthType
  bearerToken?: string
  basicUsername?: string
  basicPassword?: string
  apiKey?: string
  apiKeyHeader?: string
}

export interface ApiRequest {
  id: string
  name: string
  method: HttpMethod
  url: string
  headers: KeyValue[]
  queryParams: KeyValue[]
  body?: RequestBody
  auth?: AuthConfig
  preScript?: string
  postScript?: string
}

export interface ApiResponse {
  status: number
  statusText: string
  headers: KeyValue[]
  body: string
  timeMs: number
  sizeBytes: number
}

export interface Collection {
  id: string
  name: string
  description?: string
  items: CollectionItem[]
  variables: KeyValue[]
}

export type CollectionItem =
  | { type: 'folder'; id: string; name: string; items: CollectionItem[] }
  | { type: 'request'; id: string; name: string; request: ApiRequest }

export interface Environment {
  id: string
  name: string
  variables: KeyValue[]
}

export interface HistoryEntry {
  id: string
  request: ApiRequest
  response?: ApiResponse
  timestamp: string
}

export interface AiMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AiContext {
  request?: ApiRequest
  response?: ApiResponse
}

export type ThemeMode = 'light' | 'dark'
