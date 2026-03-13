const DEFAULT_BACKEND_URL = "https://cloud-nova.onrender.com";

const normalizeUrl = (url: string) => url.replace(/\/$/, "");

const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = configuredApiUrl
  ? normalizeUrl(configuredApiUrl)
  : DEFAULT_BACKEND_URL;

const shouldKeepAlive = API_BASE_URL.startsWith("http");

export const keepBackendAlive = () => {
  if (!shouldKeepAlive) {
    return null;
  }

  const ping = () => fetch(`${API_BASE_URL}/`).catch(() => undefined);

  ping();
  return window.setInterval(ping, 10 * 60 * 1000);
};

export default API_BASE_URL;