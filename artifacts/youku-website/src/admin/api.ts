const BASE = "/api/admin";

async function req(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  stats: () => req("/stats"),

  users: {
    list: (params?: Record<string, string>) => req(`/users?${new URLSearchParams(params || {})}`),
    get: (id: number) => req(`/users/${id}`),
    create: (data: unknown) => req("/users", "POST", data),
    update: (id: number, data: unknown) => req(`/users/${id}`, "PUT", data),
    delete: (id: number) => req(`/users/${id}`, "DELETE"),
  },

  content: {
    list: (params?: Record<string, string>) => req(`/content?${new URLSearchParams(params || {})}`),
    get: (id: number) => req(`/content/${id}`),
    create: (data: unknown) => req("/content", "POST", data),
    update: (id: number, data: unknown) => req(`/content/${id}`, "PUT", data),
    delete: (id: number) => req(`/content/${id}`, "DELETE"),
    episodes: {
      list: (id: number) => req(`/content/${id}/episodes`),
      create: (id: number, data: unknown) => req(`/content/${id}/episodes`, "POST", data),
      update: (id: number, epId: number, data: unknown) => req(`/content/${id}/episodes/${epId}`, "PUT", data),
      delete: (id: number, epId: number) => req(`/content/${id}/episodes/${epId}`, "DELETE"),
    },
  },

  carousel: {
    list: () => req("/carousel/carousel"),
    create: (data: unknown) => req("/carousel/carousel", "POST", data),
    update: (id: number, data: unknown) => req(`/carousel/carousel/${id}`, "PUT", data),
    delete: (id: number) => req(`/carousel/carousel/${id}`, "DELETE"),
  },

  featured: {
    list: () => req("/carousel/featured"),
    create: (data: unknown) => req("/carousel/featured", "POST", data),
    update: (id: number, data: unknown) => req(`/carousel/featured/${id}`, "PUT", data),
    delete: (id: number) => req(`/carousel/featured/${id}`, "DELETE"),
    contentList: () => req("/carousel/content-list"),
  },

  subscriptions: {
    list: (params?: Record<string, string>) => req(`/subscriptions?${new URLSearchParams(params || {})}`),
    create: (data: unknown) => req("/subscriptions", "POST", data),
    update: (id: number, data: unknown) => req(`/subscriptions/${id}`, "PUT", data),
    delete: (id: number) => req(`/subscriptions/${id}`, "DELETE"),
  },

  wallet: {
    get: () => req("/wallet"),
    withdraw: (data: unknown) => req("/wallet/withdraw", "POST", data),
    topup: (data: unknown) => req("/wallet/topup", "POST", data),
  },

  transactions: {
    list: (params?: Record<string, string>) => req(`/transactions?${new URLSearchParams(params || {})}`),
  },

  activities: {
    list: (params?: Record<string, string>) => req(`/activities?${new URLSearchParams(params || {})}`),
    log: (data: unknown) => req("/activities", "POST", data),
  },
};
