/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYME_MERCHANT_CODE?: string;
  readonly VITE_PAYME_API_VERSION?: string;
  readonly VITE_PAYME_AUDIENCE?: string;
  readonly VITE_PAYME_AUTH_URL?: string;
  readonly VITE_PAYME_CLIENT_ID?: string;
  readonly VITE_PAYME_CLIENT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
