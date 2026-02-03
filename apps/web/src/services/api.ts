const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Flag to prevent multiple refresh attempts running simultaneously
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // If a refresh is already in progress, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
      return data.accessToken;
    } catch {
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let token = localStorage.getItem('auth_token');
  if (token === 'null' || token === 'undefined') token = null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // If 401, try to refresh the token
  if (response.status === 401 && endpoint !== '/refresh' && endpoint !== '/login') {
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Retry the original request with new token
      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
          ...options.headers,
        },
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.json();
        throw error;
      }

      return retryResponse.json();
    } else {
      // Refresh failed - clear tokens and notify app
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.dispatchEvent(new CustomEvent('session-expired'));
      throw { message: 'Session expired', statusCode: 401 };
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {} as T;
}

// Export para debugging (opcional)
export { API_URL };