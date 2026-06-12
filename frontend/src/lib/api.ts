/**
 * Cliente HTTP fino para a API do Sugar Dream (NestJS).
 * Em dev, as chamadas passam pelo rewrite /backend -> backend NestJS (ver next.config.js).
 * O token JWT, quando presente, é lido do localStorage.
 */
const BASE = '/backend';

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = window.localStorage.getItem('sd_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export interface MatchCandidate {
  userId: string;
  firstName: string;
  age: number;
  city?: string;
  state?: string;
  compatibilityScore: number;
  profilePhotoUrl?: string;
}

export interface MatchListResponse {
  totalMatches: number;
  matches: MatchCandidate[];
}

export interface Profile {
  userId: string;
  bio?: string;
  interests?: string[];
  relationshipStatus?: string;
  incomeRange?: string;
  profilePhotoUrl?: string;
}

export async function fetchMatches(): Promise<MatchListResponse> {
  return apiGet<MatchListResponse>('/api/v1/matches');
}

export async function fetchProfile(userId: string): Promise<Profile> {
  return apiGet<Profile>(`/api/v1/users/${userId}/profile`);
}

export async function fetchCurrentUser() {
  return apiGet<any>('/api/v1/users/me');
}
