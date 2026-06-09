import { API_BASE_URL } from '../config';
import { EngineResponse } from '../types';

export async function processText(text: string): Promise<EngineResponse> {
  const response = await fetch(`${API_BASE_URL}/engine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: text }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function processVoice(audioBase64: string): Promise<EngineResponse> {
  const response = await fetch(`${API_BASE_URL}/engine/voice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio: audioBase64 }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function confirmAction(pendingAction: string): Promise<EngineResponse> {
  const response = await fetch(`${API_BASE_URL}/engine/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pendingAction }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function cancelAction(): Promise<EngineResponse> {
  const response = await fetch(`${API_BASE_URL}/engine/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
