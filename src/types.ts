export interface EngineResponse {
  id: string;
  status: 'completed' | 'awaiting_confirmation' | 'blocked' | 'error';
  message: string;
  confirmationPrompt?: string;
  pendingAction?: string;
  error?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'aurora';
  text: string;
  timestamp: Date;
}

export type AppState = 'idle' | 'recording' | 'loading' | 'awaiting_confirmation' | 'blocked';
