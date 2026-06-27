import type { Cattle, HealthEvent, CreateCattleInput, CreateHealthEventInput, AnalyticsData } from '@shared/type';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

const request = async <T,>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.error || json.message || `HTTP ${response.status}`);
  }

  // Some endpoints wrap data in { data: ... }, others return directly
  return (json.data !== undefined ? json.data : json) as T;
};

export const api = {
  // Cattle endpoints
  getCattle: (filters?: { status?: string; breed?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.breed) params.append('breed', filters.breed);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString();
    return request<Cattle[]>(`/cattle${query ? `?${query}` : ''}`);
  },
  getCattleById: (id: string) => request<Cattle>(`/cattle/${id}`),
  createCattle: (data: CreateCattleInput) =>
    request<Cattle>('/cattle', { method: 'POST', body: JSON.stringify(data) }),
  updateCattle: (id: string, data: Partial<CreateCattleInput>) =>
    request<Cattle>(`/cattle/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCattle: (id: string) =>
    request<void>(`/cattle/${id}`, { method: 'DELETE' }),

  // Health events endpoints
  getHealthEvents: (cattleId: string) =>
    request<HealthEvent[]>(`/cattle/${cattleId}/health-events`),
  createHealthEvent: (cattleId: string, data: CreateHealthEventInput) =>
    request<HealthEvent>(`/cattle/${cattleId}/health-events`, { method: 'POST', body: JSON.stringify(data) }),

  // Analytics endpoints
  getAnalytics: () => request<AnalyticsData>('/analytics'),
};
