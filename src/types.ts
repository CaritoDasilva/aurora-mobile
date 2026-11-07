// Acción que el servidor pide ejecutar en el teléfono (espejo de NativeAction en aurora-be).
export type NativeAction =
  | { type: 'call'; phone: string; name: string }
  | { type: 'sms'; phone: string; name: string; body: string }
  | { type: 'reminder'; title: string; body: string; triggerSeconds: number };

export interface EngineResponse {
  id: string;
  status: 'completed' | 'awaiting_confirmation' | 'blocked' | 'error';
  message: string;
  confirmationPrompt?: string;
  pendingAction?: string;
  action?: NativeAction;
  error?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'aurora';
  text: string;
  timestamp: Date;
}

export type AppState = 'idle' | 'recording' | 'loading' | 'awaiting_confirmation' | 'blocked';
