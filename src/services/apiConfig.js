import { Capacitor } from '@capacitor/core';

const DEFAULT_NATIVE_API_URL = 'https://dreambid-production.up.railway.app/api';
const DEFAULT_WEB_API_URL = '/api';

const isNativePlatform = () => {
  return typeof window !== 'undefined' && window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform();
};

export const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (isNativePlatform()) {
    return envUrl || DEFAULT_NATIVE_API_URL;
  }
  return envUrl || DEFAULT_WEB_API_URL;
})();

export const API_HOST = API_BASE_URL.replace(/\/api$/, '');
