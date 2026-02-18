const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  skipContentType?: boolean;
}

const TOKEN_KEY = 'b2b_nexus_token';

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function buildHeaders(options?: RequestOptions) {
  const headers: Record<string, string> = {};
  if (!options?.skipContentType) headers['Content-Type'] = 'application/json';
  const token = getStoredToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options?.headers) Object.assign(headers, options.headers as Record<string, string>);
  return headers;
}

export const apiClient = {
  setToken(token: string) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch {}
  },
  getToken() {
    return getStoredToken();
  },
  clearToken() {
    try { localStorage.removeItem(TOKEN_KEY); } catch {}
  },

  async request<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, init);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${text}`);
    }
    return response.json();
  },

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request(endpoint, { method: 'GET', headers: buildHeaders(options), ...options });
  },

  async post<T>(endpoint: string, data: unknown, options?: RequestOptions): Promise<T> {
    const body = options?.skipContentType ? (data as any) : JSON.stringify(data);
    return this.request(endpoint, { method: 'POST', headers: buildHeaders(options), body, ...options });
  },

  async put<T>(endpoint: string, data: unknown, options?: RequestOptions): Promise<T> {
    const body = options?.skipContentType ? (data as any) : JSON.stringify(data);
    return this.request(endpoint, { method: 'PUT', headers: buildHeaders(options), body, ...options });
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request(endpoint, { method: 'DELETE', headers: buildHeaders(options), ...options });
  },
};
