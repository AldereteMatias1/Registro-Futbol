const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_URL no está configurado');
}

export type ApiOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: string | null;
};

export const getAdminAuth = () => {
  return localStorage.getItem('adminAuth');
};

export const setAdminAuth = (value: string | null) => {
  if (value) {
    localStorage.setItem('adminAuth', value);
  } else {
    localStorage.removeItem('adminAuth');
  }
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.auth) {
    headers.Authorization = `Basic ${options.auth}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message ?? 'Error en la solicitud');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
