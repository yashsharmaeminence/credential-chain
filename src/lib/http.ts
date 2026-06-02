const ENV = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

export function apiBaseUrl(): string {
  const raw = ENV.VITE_API_BASE_URL?.trim();
  if (!raw) return "";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export function apiUrl(path: string): string {
  const base = apiBaseUrl();
  if (!path.startsWith("/")) throw new Error(`apiUrl expects a leading '/': ${path}`);
  return `${base}${path}`;
}

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path));
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${path}${text ? `: ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

function institutionAuthHeaders(path: string): Record<string, string> {
  const key = ENV.VITE_INSTITUTION_API_KEY?.trim();
  if (!key || !path.startsWith("/institution/")) return {};
  return { Authorization: `Bearer ${key}` };
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...institutionAuthHeaders(path),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${path}${text ? `: ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

