/** Instrucción de acción nativa que el backend pide ejecutar en el dispositivo. */
export interface SkillCall {
  name: 'make_call' | 'send_sms' | 'schedule_reminder';
  args: Record<string, unknown>;
}

export interface EngineResponse {
  id: string;
  status: 'completed' | 'awaiting_confirmation' | 'blocked' | 'error';
  message: string;
  confirmationPrompt?: string;
  /** ID opaco de acción pendiente: lo emite el servidor, un solo uso, expira. */
  pendingActionId?: string;
  /** Acción nativa a ejecutar en ESTE dispositivo. */
  skillCall?: SkillCall;
  error?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'aurora';
  text: string;
  timestamp: Date;
}

export type AppState = 'idle' | 'recording' | 'loading' | 'awaiting_confirmation' | 'blocked';
