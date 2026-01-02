// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; todo -> eso cuando tengamos los environments seteados
const API_URL = `http://${window.location.hostname}:3000`;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}