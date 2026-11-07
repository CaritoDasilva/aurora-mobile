import { useState, useCallback } from 'react';
import { Message, AppState, EngineResponse } from '../types';
import { processText, processVoice, confirmAction, cancelAction } from '../services/api';
import { useSpeech } from './useSpeech';
import { runNativeAction } from '../services/nativeSkills';

function makeId() {
  return Math.random().toString(36).slice(2);
}

function makeMessage(role: Message['role'], text: string): Message {
  return { id: makeId(), role, text, timestamp: new Date() };
}

export function useAurora() {
  const [messages, setMessages] = useState<Message[]>([
    makeMessage('aurora', '¡Hola! Soy Aurora. ¿En qué te ayudo hoy?'),
  ]);
  const [appState, setAppState] = useState<AppState>('idle');
  const [pendingAction, setPendingAction] = useState<string | undefined>();
  const [confirmationPrompt, setConfirmationPrompt] = useState<string | undefined>();

  const { speak, toggle: toggleSpeech, enabled: speechEnabled } = useSpeech();

  function addMessage(role: Message['role'], text: string) {
    setMessages((prev) => [...prev, makeMessage(role, text)]);
    if (role === 'aurora') speak(text);
  }

  // Frases de error para la persona mayor, según la acción que falló.
  function nativeErrorMessage(action: NonNullable<EngineResponse['action']>, e: any): string {
    if (String(e?.message ?? e).includes('permission')) {
      return action.type === 'reminder'
        ? 'Necesito permiso para mostrarte avisos. Puedes activarlo en los Ajustes del teléfono.'
        : 'Necesito un permiso para hacer eso. Puedes activarlo en los Ajustes del teléfono.';
    }
    if (action.type === 'call') return `No pude abrir el teléfono para llamar a ${action.name}.`;
    if (action.type === 'sms') return `No pude abrir los mensajes para ${action.name}.`;
    return 'No pude programar el recordatorio. Inténtalo de nuevo.';
  }

  async function performNativeAction(action: NonNullable<EngineResponse['action']>) {
    try {
      // Deja terminar la frase de Aurora antes de que el teléfono cambie de pantalla.
      if (action.type !== 'reminder') await new Promise((r) => setTimeout(r, 1500));
      await runNativeAction(action);
    } catch (e: any) {
      console.error('Native action error:', e);
      addMessage('aurora', nativeErrorMessage(action, e));
    }
  }

  function handleResponse(res: EngineResponse) {
    addMessage('aurora', res.message);
    if (res.action) void performNativeAction(res.action);
    if (res.status === 'awaiting_confirmation') {
      setPendingAction(res.pendingAction);
      setConfirmationPrompt(res.confirmationPrompt);
      setAppState('awaiting_confirmation');
    } else if (res.status === 'blocked') {
      setAppState('blocked');
    } else {
      setPendingAction(undefined);
      setConfirmationPrompt(undefined);
      setAppState('idle');
    }
  }

  const sendText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    addMessage('user', text);
    setAppState('loading');
    try {
      const res = await processText(text);
      handleResponse(res);
    } catch (e: any) {
      addMessage('aurora', 'Perdón, hubo un error al conectar con el servidor. Revisa tu conexión.');
      setAppState('idle');
    }
  }, []);

  const sendVoice = useCallback(async (audioBase64: string, audioFormat: string) => {
    setAppState('loading');
    try {
      const res = await processVoice(audioBase64, audioFormat);
      addMessage('user', '[Mensaje de voz]');
      handleResponse(res);
    } catch (e: any) {
      addMessage('aurora', 'Perdón, hubo un error al procesar tu voz. Inténtalo de nuevo.');
      setAppState('idle');
    }
  }, []);

  const confirm = useCallback(async () => {
    if (!pendingAction) return;
    setAppState('loading');
    try {
      const res = await confirmAction(pendingAction);
      handleResponse(res);
    } catch (e: any) {
      addMessage('aurora', 'Perdón, hubo un error al confirmar la acción.');
      setAppState('idle');
    }
  }, [pendingAction]);

  const cancel = useCallback(async () => {
    setAppState('loading');
    try {
      const res = await cancelAction(pendingAction);
      handleResponse(res);
    } catch (e: any) {
      addMessage('aurora', 'Acción cancelada.');
      setAppState('idle');
    }
    setPendingAction(undefined);
    setConfirmationPrompt(undefined);
  }, [pendingAction]);

  // Avisos de la app (p. ej. permisos) dichos por Aurora, sin pasar por el servidor.
  const say = useCallback((text: string) => addMessage('aurora', text), []);

  // "Entendido" tras una acción bloqueada: vuelve al inicio sin llamar al servidor.
  const dismissBlocked = useCallback(() => setAppState('idle'), []);

  return {
    messages, appState, pendingAction, confirmationPrompt,
    sendText, sendVoice, confirm, cancel,
    say, dismissBlocked, speechEnabled, toggleSpeech,
  };
}
