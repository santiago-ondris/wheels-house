const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Flag to prevent multiple refresh attempts running simultaneously
let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

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
    return data.accessToken;
  } catch (error) {
    console.error('Refresh token error:', error);
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');

  // Centralized header construction
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  // If 401, try to refresh the token
  if (response.status === 401 && endpoint !== '/refresh' && endpoint !== '/login') {
    // Only start one refresh at a time
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;

    if (newToken) {
      const retryHeaders: HeadersInit = {
        ...headers,
        'Authorization': `Bearer ${newToken}`,
      };

      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: retryHeaders,
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