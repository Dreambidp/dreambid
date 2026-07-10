import { Capacitor } from '@capacitor/core';

const DEFAULT_NATIVE_API_URL = 'https://web-production-86c3.up.railway.app/api';
const DEFAULT_WEB_API_URL = '/api';

const isNativePlatform = () => {
  return typeof window !== 'undefined' && window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform();
};

const normalizeApiUrl = (url) => {
  if (!url) return url;
  const trimmed = url.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (isNativePlatform()) {
    return normalizeApiUrl(envUrl) || DEFAULT_NATIVE_API_URL;
  }
  return normalizeApiUrl(envUrl) || DEFAULT_WEB_API_URL;
})();

export const API_HOST = API_BASE_URL.replace(/\/api$/, '');
