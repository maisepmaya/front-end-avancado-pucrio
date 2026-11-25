/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL do back-end (ex.: http://localhost:5000). Sem ela, o app roda em modo demo. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
