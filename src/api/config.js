export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_STACKROX_URL ? '/stackrox-api' : '',
  realUrl: import.meta.env.VITE_STACKROX_URL || '',
  apiToken: import.meta.env.VITE_STACKROX_TOKEN || '',
  useMockFallback: import.meta.env.VITE_USE_MOCK_FALLBACK !== 'false',
  timeout: 15000,
  pollInterval: Number(import.meta.env.VITE_SYNC_INTERVAL) || 30000,
};

export function isApiConfigured() {
  return Boolean(API_CONFIG.realUrl && API_CONFIG.apiToken);
}

export function getAuthHeader() {
  if (!API_CONFIG.apiToken) return {};
  return { Authorization: `Bearer ${API_CONFIG.apiToken}` };
}
