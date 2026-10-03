import { ResolveRequest, ResolveResponse } from '@/types/api';

// In browser, relative calls (/api/v1/...) hit Next.js rewrites which proxy to FastAPI on port 8080.
// In SSR, use BACKEND_INTERNAL_URL or default to http://127.0.0.1:8080.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL !== undefined && process.env.NEXT_PUBLIC_API_URL !== ''
    ? process.env.NEXT_PUBLIC_API_URL
    : typeof window !== 'undefined'
    ? ''
    : process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8080';

export class ApiClientError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

/**
 * Resolves media formats via the backend API.
 */
export async function resolveMedia(url: string): Promise<ResolveResponse> {
  const endpoint = `${API_BASE_URL}/api/v1/resolve`;
  const payload: ResolveRequest = { url: url.trim() };

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  } catch (err) {
    throw new ApiClientError(
      `Unable to reach backend service (${API_BASE_URL || 'http://127.0.0.1:8080'}). Please ensure the FastAPI backend is running on port 8080.`,
      0
    );
  }

  if (!response.ok) {
    let errorDetail = 'Failed to process media request.';
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      errorDetail = `Server returned status ${response.status}: ${response.statusText}`;
    }
    throw new ApiClientError(errorDetail, response.status);
  }

  return (await response.json()) as ResolveResponse;
}

/**
 * Generates a relative streaming URL that pipes data through the backend's zero-buffering proxy.
 * Uses relative path so browser stays on same-origin (http://localhost:3000/api/v1/stream) without port mismatches.
 */
export function getProxyStreamUrl(directUrl: string, filename: string, audioUrl?: string | null): string {
  const params = new URLSearchParams({
    url: directUrl,
    filename: filename,
  });
  if (audioUrl) {
    params.set('audio_url', audioUrl);
  }
  return `/api/v1/stream?${params.toString()}`;
}
