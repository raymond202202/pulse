/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface Window {
  electronAPI?: {
    send: (channel: string, data: any) => void
    on: (channel: string, callback: (...args: any[]) => void) => void
  }
}
