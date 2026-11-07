import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';

const TOKEN_KEY = 'aurora_session_token';
const NETWORK_ERROR = 'No pude conectarme con el servidor. Revisa tu conexión e inténtalo de nuevo.';

let token: string | null = null;
let onUnauthorized: (() => void) | null = null;

/** Error con un mensaje listo para mostrarle a la persona. */
export class AuthError extends Error {}

export function getAuthToken(): string | null {
  return token;
}

/** La app registra qué hacer cuando el servidor responde 401 (sesión vencida). */
export function setUnauthorizedHandler(fn: (() => void) | null): void {
  onUnauthorized = fn;
}

export function handleUnauthorized(): void {
  void clearSession();
  onUnauthorized?.();
}

async function storeToken(value: string | null): Promise<void> {
  try {
    if (value) await SecureStore.setItemAsync(TOKEN_KEY, value);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // Sin almacenamiento seguro (p. ej. web): la sesión dura solo mientras la app está abierta.
  }
}

async function clearSession(): Promise<void> {
  token = null;
  await storeToken(null);
}

async function authPost(path: string, body: Record<string, unknown>) {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-aurora-client': 'mobile' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthError(NETWORK_ERROR);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AuthError(data.message ?? 'Algo salió mal. Inténtalo de nuevo.');
  return data;
}

export async function requestCode(phone: string): Promise<void> {
  await authPost('/auth/request-code', { phone });
}

export async function verifyCode(phone: string, code: string): Promise<void> {
  const data = await authPost('/auth/verify-code', { phone, code });
  token = data.token as string;
  await storeToken(token);
}

/**
 * Al abrir la app: retoma la sesión guardada si el servidor todavía la reconoce.
 * Si el servidor no responde, conserva la sesión (el chat avisará del problema de conexión).
 */
export async function restoreSession(): Promise<boolean> {
  try {
    token = await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    token = null;
  }
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/session`, {
      headers: { Authorization: `Bearer ${token}`, 'x-aurora-client': 'mobile' },
    });
    if (res.status === 401) {
      await clearSession();
      return false;
    }
  } catch {
    // sin conexión: no se cierra la sesión por eso
  }
  return true;
}

export async function logout(): Promise<void> {
  const current = token;
  await clearSession();
  if (!current) return;
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${current}`, 'x-aurora-client': 'mobile' },
    });
  } catch {
    // el token ya no existe en el teléfono; el servidor lo vence solo
  }
}
