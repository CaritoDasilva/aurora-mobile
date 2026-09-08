import { useState, useCallback } from 'react';
import { Message, AppState, EngineResponse } from '../types';
import { processText, processVoice, confirmAction, cancelAction } from '../services/api';

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

  function addMessage(role: Message['role'], text: string) {
    setMessages((prev) => [...prev, makeMessage(role, text)]);
  }

  function handleResponse(res: EngineResponse) {
    addMessage('aurora', res.message);
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
      addMessage('aurora', 'Perdón, hubo un error al conectar con el servidor. Revisá tu conexión.');
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
      addMessage('aurora', 'Perdón, hubo un error al procesar tu voz. Intentá de nuevo.');
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
      const res = await cancelAction();
      handleResponse(res);
    } catch (e: any) {
      addMessage('aurora', 'Acción cancelada.');
      setAppState('idle');
    }
    setPendingAction(undefined);
    setConfirmationPrompt(undefined);
  }, []);

  return { messages, appState, pendingAction, confirmationPrompt, sendText, sendVoice, confirm, cancel };
}
