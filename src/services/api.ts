import { API_BASE_URL } from '../config';
import { EngineResponse } from '../types';

// `native: true` + header: el servidor devuelve `action` (llamar, SMS, recordatorio)
// en vez de ejecutarla en su propia máquina.
async function post(path: string, body?: Record<string, unknown>): Promise<EngineResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-aurora-client': 'mobile' },
    body: JSON.stringify({ ...body, native: true }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export function processText(text: string): Promise<EngineResponse> {
  return post('/process', { type: 'text', text });
}

export function processVoice(audioBase64: string, audioFormat: string): Promise<EngineResponse> {
  return post('/process', { type: 'voice', audioBase64, audioFormat });
}

export function confirmAction(pendingAction: string): Promise<EngineResponse> {
  return post('/confirm', { pendingAction });
}

export function cancelAction(): Promise<EngineResponse> {
  return post('/cancel');
}
